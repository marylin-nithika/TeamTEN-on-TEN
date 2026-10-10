import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from database import PROPOSALS_STORE, BRIEFS_STORE, PROFILES_STORE, CREATOR_PROFILES_STORE, ENGAGEMENTS_STORE
from schemas import ProposalCreate, ProposalResponse, EngagementResponse

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])

@router.get("", response_model=List[ProposalResponse])
def get_proposals(
    brief_id: Optional[str] = Query(None),
    creator_id: Optional[str] = Query(None)
):
    """Fetch proposals filtered by brief or creator."""
    results = []
    for prop in PROPOSALS_STORE:
        if brief_id and prop["brief_id"] != brief_id:
            continue
        if creator_id and prop["creator_id"] != creator_id:
            continue
            
        creator_p = next((p for p in PROFILES_STORE if p["id"] == prop["creator_id"]), None)
        creator_cp = next((cp for cp in CREATOR_PROFILES_STORE if cp["id"] == prop["creator_id"]), None)
        
        results.append(ProposalResponse(
            **prop,
            creator_name=creator_p["display_name"] if creator_p else "Creator",
            creator_avatar=creator_p["avatar_url"] if creator_p else None,
            creator_specialization=creator_cp["specialization"] if creator_cp else None
        ))
    return results

@router.post("", response_model=ProposalResponse)
def submit_proposal(payload: ProposalCreate):
    """Submit proposal to a brief."""
    # Check if existing proposal exists
    existing = next((p for p in PROPOSALS_STORE if p["brief_id"] == payload.brief_id and p["creator_id"] == payload.creator_id), None)
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted a proposal for this brief")
        
    brief = next((b for b in BRIEFS_STORE if b["id"] == payload.brief_id), None)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
        
    new_id = f"prop{uuid.uuid4().hex[:8]}"
    prop_dict = payload.model_dump()
    prop_dict["id"] = new_id
    prop_dict["status"] = "pending"
    prop_dict["created_at"] = datetime.utcnow().isoformat() + "Z"
    
    PROPOSALS_STORE.insert(0, prop_dict)
    
    creator_p = next((p for p in PROFILES_STORE if p["id"] == payload.creator_id), None)
    creator_cp = next((cp for cp in CREATOR_PROFILES_STORE if cp["id"] == payload.creator_id), None)
    
    return ProposalResponse(
        **prop_dict,
        creator_name=creator_p["display_name"] if creator_p else "Creator",
        creator_avatar=creator_p["avatar_url"] if creator_p else None,
        creator_specialization=creator_cp["specialization"] if creator_cp else None
    )

@router.patch("/{proposal_id}/status", response_model=ProposalResponse)
def update_proposal_status(proposal_id: str, status: str = Query(..., description="'accepted' or 'declined'")):
    """Accept or decline proposal. Accepting creates an Engagement."""
    prop = next((p for p in PROPOSALS_STORE if p["id"] == proposal_id), None)
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    if status not in ["accepted", "declined", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
        
    prop["status"] = status
    
    if status == "accepted":
        brief = next((b for b in BRIEFS_STORE if b["id"] == prop["brief_id"]), None)
        if brief:
            brief["status"] = "in_progress"
            
            # Create engagement
            eng_id = f"eng{uuid.uuid4().hex[:8]}"
            new_eng = {
                "id": eng_id,
                "brief_id": brief["id"],
                "brief_title": brief["title"],
                "creator_id": prop["creator_id"],
                "brand_id": brief["brand_id"],
                "agreed_price": prop["proposed_price"],
                "usage_rights": f"{brief.get('ownership_type', 'Full Buyout')} - {brief.get('licensing_territory', 'Worldwide')} ({brief.get('licensing_duration', 'Perpetual')})",
                "status": "active",
                "created_at": datetime.utcnow().isoformat() + "Z"
            }
            ENGAGEMENTS_STORE.insert(0, new_eng)
            
    creator_p = next((p for p in PROFILES_STORE if p["id"] == prop["creator_id"]), None)
    creator_cp = next((cp for cp in CREATOR_PROFILES_STORE if cp["id"] == prop["creator_id"]), None)
    
    return ProposalResponse(
        **prop,
        creator_name=creator_p["display_name"] if creator_p else "Creator",
        creator_avatar=creator_p["avatar_url"] if creator_p else None,
        creator_specialization=creator_cp["specialization"] if creator_cp else None
    )
