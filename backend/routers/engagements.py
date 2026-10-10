import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from database import ENGAGEMENTS_STORE, DELIVERABLES_STORE, BRIEFS_STORE, PROFILES_STORE
from schemas import EngagementResponse, DeliverableCreate, DeliverableResponse

router = APIRouter(prefix="/api/engagements", tags=["Engagements"])

@router.get("", response_model=List[EngagementResponse])
def get_engagements(
    brand_id: Optional[str] = Query(None),
    creator_id: Optional[str] = Query(None)
):
    """List engagements for a brand or creator."""
    results = []
    for eng in ENGAGEMENTS_STORE:
        if brand_id and eng["brand_id"] != brand_id:
            continue
        if creator_id and eng["creator_id"] != creator_id:
            continue
            
        brief = next((b for b in BRIEFS_STORE if b["id"] == eng["brief_id"]), None)
        creator_p = next((p for p in PROFILES_STORE if p["id"] == eng["creator_id"]), None)
        brand_p = next((p for p in PROFILES_STORE if p["id"] == eng["brand_id"]), None)
        
        results.append(EngagementResponse(
            **eng,
            brief_title=brief["title"] if brief else "Campaign Brief",
            creator_name=creator_p["display_name"] if creator_p else "Creator",
            brand_name=brand_p["display_name"] if brand_p else "Brand Client"
        ))
    return results

@router.get("/{engagement_id}/deliverables", response_model=List[DeliverableResponse])
def get_deliverables(engagement_id: str):
    """Fetch deliverables for an engagement ordered by version."""
    delivs = [d for d in DELIVERABLES_STORE if d["engagement_id"] == engagement_id]
    delivs.sort(key=lambda d: d.get("version", 1))
    return [DeliverableResponse(**d) for d in delivs]

@router.post("/{engagement_id}/deliverables", response_model=DeliverableResponse)
def submit_deliverable(engagement_id: str, payload: DeliverableCreate):
    """Submit new deliverable asset version."""
    eng = next((e for e in ENGAGEMENTS_STORE if e["id"] == engagement_id), None)
    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")
        
    existing = [d for d in DELIVERABLES_STORE if d["engagement_id"] == engagement_id]
    next_version = len(existing) + 1
    
    new_id = f"deliv{uuid.uuid4().hex[:8]}"
    deliv_dict = {
        "id": new_id,
        "engagement_id": engagement_id,
        "version": next_version,
        "file_url": payload.file_url,
        "notes": payload.notes,
        "approval_status": "submitted",
        "feedback": None,
        "submitted_at": datetime.utcnow().isoformat() + "Z"
    }
    
    DELIVERABLES_STORE.append(deliv_dict)
    eng["status"] = "in_review"
    
    return DeliverableResponse(**deliv_dict)

@router.patch("/deliverables/{deliverable_id}/status", response_model=DeliverableResponse)
def update_deliverable_status(
    deliverable_id: str,
    approval_status: str = Query(..., description="'approved' or 'revision_requested'"),
    feedback: Optional[str] = Query(None)
):
    """Brand approves deliverable or requests revision."""
    d = next((item for item in DELIVERABLES_STORE if item["id"] == deliverable_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Deliverable not found")
        
    if approval_status not in ["approved", "revision_requested", "submitted"]:
        raise HTTPException(status_code=400, detail="Invalid approval status")
        
    d["approval_status"] = approval_status
    if feedback:
        d["feedback"] = feedback
        
    eng = next((e for e in ENGAGEMENTS_STORE if e["id"] == d["engagement_id"]), None)
    if eng:
        if approval_status == "approved":
            eng["status"] = "completed"
            brief = next((b for b in BRIEFS_STORE if b["id"] == eng["brief_id"]), None)
            if brief:
                brief["status"] = "completed"
        elif approval_status == "revision_requested":
            eng["status"] = "active"
            
    return DeliverableResponse(**d)
