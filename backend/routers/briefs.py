import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from database import BRIEFS_STORE, PROFILES_STORE, PROPOSALS_STORE
from schemas import BriefCreate, BriefResponse, BriefAssistRequest, BriefAssistResponse
from services.ai_brief import generate_groq_brief

router = APIRouter(prefix="/api/briefs", tags=["Briefs"])

@router.post("/assist", response_model=BriefAssistResponse)
def assist_brief_creation(request: BriefAssistRequest):
    """
    Generate structured creative brief using Groq LLM.
    Supports fallback if Groq API key is unconfigured or call fails.
    """
    return generate_groq_brief(request)

@router.get("", response_model=List[BriefResponse])
def get_briefs(
    brand_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    content_type: Optional[str] = Query(None)
):
    """List briefs with optional filtering by brand, status, or content type."""
    results = []
    for b in BRIEFS_STORE:
        if brand_id and b["brand_id"] != brand_id:
            continue
        if status and b["status"] != status:
            continue
        if content_type and b["content_type"].lower() != content_type.lower():
            continue
            
        brand_prof = next((p for p in PROFILES_STORE if p["id"] == b["brand_id"]), None)
        proposal_count = len([p for p in PROPOSALS_STORE if p["brief_id"] == b["id"]])
        
        results.append(BriefResponse(
            **b,
            brand_name=brand_prof["display_name"] if brand_prof else "Brand Client",
            brand_avatar=brand_prof["avatar_url"] if brand_prof else None,
            proposal_count=proposal_count
        ))
    return results

@router.get("/{brief_id}", response_model=BriefResponse)
def get_brief_detail(brief_id: str):
    """Fetch brief by ID."""
    b = next((item for item in BRIEFS_STORE if item["id"] == brief_id), None)
    if not b:
        raise HTTPException(status_code=404, detail="Brief not found")
        
    brand_prof = next((p for p in PROFILES_STORE if p["id"] == b["brand_id"]), None)
    proposal_count = len([p for p in PROPOSALS_STORE if p["brief_id"] == b["id"]])
    
    return BriefResponse(
        **b,
        brand_name=brand_prof["display_name"] if brand_prof else "Brand Client",
        brand_avatar=brand_prof["avatar_url"] if brand_prof else None,
        proposal_count=proposal_count
    )

@router.post("", response_model=BriefResponse)
def create_brief(payload: BriefCreate):
    """Publish or save draft creative brief."""
    new_id = f"b{uuid.uuid4().hex[:8]}"
    brief_dict = payload.model_dump()
    brief_dict["id"] = new_id
    brief_dict["created_at"] = datetime.utcnow().isoformat() + "Z"
    
    BRIEFS_STORE.insert(0, brief_dict)
    
    brand_prof = next((p for p in PROFILES_STORE if p["id"] == payload.brand_id), None)
    return BriefResponse(
        **brief_dict,
        brand_name=brand_prof["display_name"] if brand_prof else "Brand Client",
        brand_avatar=brand_prof["avatar_url"] if brand_prof else None,
        proposal_count=0
    )

@router.put("/{brief_id}", response_model=BriefResponse)
def update_brief(brief_id: str, payload: BriefCreate):
    """Update brief details."""
    b = next((item for item in BRIEFS_STORE if item["id"] == brief_id), None)
    if not b:
        raise HTTPException(status_code=404, detail="Brief not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        b[key] = value
        
    brand_prof = next((p for p in PROFILES_STORE if p["id"] == b["brand_id"]), None)
    proposal_count = len([p for p in PROPOSALS_STORE if p["brief_id"] == brief_id])
    
    return BriefResponse(
        **b,
        brand_name=brand_prof["display_name"] if brand_prof else "Brand Client",
        brand_avatar=brand_prof["avatar_url"] if brand_prof else None,
        proposal_count=proposal_count
    )
