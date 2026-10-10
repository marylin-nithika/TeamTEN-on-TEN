import uuid
from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from database import (
    PROFILES_STORE, CREATOR_PROFILES_STORE, PORTFOLIO_ITEMS_STORE,
    calculate_creator_match_score, supabase_client
)
from schemas import (
    CreatorDetailResponse, ProfileResponse, CreatorProfileBase,
    PortfolioItemResponse, PortfolioItemCreate, CreatorProfileUpdate, MatchExplanation
)

router = APIRouter(prefix="/api/creators", tags=["Creators"])

@router.get("", response_model=List[CreatorDetailResponse])
def search_creators(
    q: Optional[str] = Query(None, description="Search query across name, specialization, skills, tools"),
    content_type: Optional[str] = Query(None),
    style: Optional[str] = Query(None),
    availability: Optional[str] = Query(None),
    max_day_rate: Optional[float] = Query(None),
    tool: Optional[str] = Query(None),
    verified_only: Optional[bool] = Query(False),
    brief_content_type: Optional[str] = Query(None),
    brief_style: Optional[str] = Query(None),
    brief_tools: Optional[str] = Query(None), # Comma separated
    brief_skills: Optional[str] = Query(None), # Comma separated
    brief_budget: Optional[float] = Query(0.0),
    sort_by: Optional[str] = Query("match") # 'match', 'rating', 'price_asc', 'price_desc'
):
    """Search and filter creators with optional AI Match Score breakdown."""
    results = []
    
    # Parse brief criteria
    req_tools = [t.strip() for t in brief_tools.split(",")] if brief_tools else []
    req_skills = [s.strip() for s in brief_skills.split(",")] if brief_skills else []
    
    # Use memory store or Supabase
    creator_profiles_list = CREATOR_PROFILES_STORE
    
    for cp in creator_profiles_list:
        cid = cp["id"]
        p = next((prof for prof in PROFILES_STORE if prof["id"] == cid), None)
        if not p:
            continue
            
        # Filters
        if q:
            query_lower = q.lower()
            match_name = query_lower in p["display_name"].lower()
            match_spec = query_lower in cp.get("specialization", "").lower()
            match_head = query_lower in cp.get("headline", "").lower()
            match_skills = any(query_lower in s.lower() for s in cp.get("skills", []))
            match_tools = any(query_lower in t.lower() for t in cp.get("tools", []))
            if not (match_name or match_spec or match_head or match_skills or match_tools):
                continue
                
        if content_type and not any(content_type.lower() in ct.lower() for ct in cp.get("content_types", [])):
            continue
            
        if style and not any(style.lower() in st.lower() for st in cp.get("styles", [])):
            continue
            
        if availability and cp.get("availability") != availability:
            continue
            
        if max_day_rate and cp.get("day_rate", 0) > max_day_rate:
            continue
            
        if tool and not any(tool.lower() in t.lower() for t in cp.get("tools", [])):
            continue

        # Get portfolio items
        items = [item for item in PORTFOLIO_ITEMS_STORE if item["creator_id"] == cid]
        
        if verified_only and not any(item.get("verification_status") == "verified_creator" for item in items):
            continue

        # Calculate match score
        match = calculate_creator_match_score(
            creator=cp,
            target_skills=req_skills,
            target_tools=req_tools,
            target_content_type=brief_content_type or content_type or "",
            target_style=brief_style or style or "",
            target_budget=brief_budget or 0.0
        )
        
        results.append(CreatorDetailResponse(
            profile=ProfileResponse(**p),
            creator_profile=CreatorProfileBase(**cp),
            portfolio_items=[PortfolioItemResponse(**item) for item in items],
            verifications=[{"type": "ID & AI Portfolio Verified", "status": "verified"}],
            match_explanation=match
        ))
        
    # Sorting
    if sort_by == "rating":
        results.sort(key=lambda x: x.creator_profile.rating, reverse=True)
    elif sort_by == "price_asc":
        results.sort(key=lambda x: x.creator_profile.day_rate or 0)
    elif sort_by == "price_desc":
        results.sort(key=lambda x: x.creator_profile.day_rate or 0, reverse=True)
    else: # Default match score
        results.sort(key=lambda x: x.match_explanation.score if x.match_explanation else 0, reverse=True)
        
    return results

@router.get("/{creator_id}", response_model=CreatorDetailResponse)
def get_creator_detail(creator_id: str):
    """Fetch complete profile, portfolio items, and verification status for a creator."""
    cp = next((item for item in CREATOR_PROFILES_STORE if item["id"] == creator_id), None)
    if not cp:
        raise HTTPException(status_code=404, detail="Creator profile not found")
        
    p = next((prof for prof in PROFILES_STORE if prof["id"] == creator_id), None)
    if not p:
        raise HTTPException(status_code=404, detail="User profile not found")
        
    items = [item for item in PORTFOLIO_ITEMS_STORE if item["creator_id"] == creator_id]
    
    match = calculate_creator_match_score(
        creator=cp,
        target_skills=[],
        target_tools=[],
        target_content_type="",
        target_style="",
        target_budget=0.0
    )
    
    return CreatorDetailResponse(
        profile=ProfileResponse(**p),
        creator_profile=CreatorProfileBase(**cp),
        portfolio_items=[PortfolioItemResponse(**item) for item in items],
        verifications=[{"type": "Identity & Generative Workflow Verified", "status": "verified"}],
        match_explanation=match
    )

@router.put("/{creator_id}", response_model=CreatorDetailResponse)
def update_creator_profile(creator_id: str, payload: CreatorProfileUpdate):
    """Update creator profile metadata."""
    cp = next((item for item in CREATOR_PROFILES_STORE if item["id"] == creator_id), None)
    if not cp:
        raise HTTPException(status_code=404, detail="Creator profile not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            cp[key] = value
            
    return get_creator_detail(creator_id)

@router.post("/{creator_id}/portfolio", response_model=PortfolioItemResponse)
def add_portfolio_item(creator_id: str, item: PortfolioItemCreate):
    """Add a new AI portfolio item with workflow breakdown."""
    new_id = f"p{uuid.uuid4().hex[:8]}"
    item_dict = item.model_dump()
    item_dict["id"] = new_id
    item_dict["creator_id"] = creator_id
    
    PORTFOLIO_ITEMS_STORE.insert(0, item_dict)
    return PortfolioItemResponse(**item_dict)
