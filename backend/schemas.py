from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Profile Schemas
class ProfileBase(BaseModel):
    role: str # 'brand' or 'creator'
    display_name: str
    avatar_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    id: str

class ProfileResponse(ProfileBase):
    id: str
    created_at: Optional[str] = None

# Creator Profile Schemas
class CommercialPermissions(BaseModel):
    full_commercial: bool = True
    resale: bool = False
    nft_rights: bool = False
    attribution_required: bool = False

class CreatorProfileBase(BaseModel):
    headline: Optional[str] = None
    biography: Optional[str] = None
    location: Optional[str] = None
    specialization: str
    skills: List[str] = []
    tools: List[str] = []
    content_types: List[str] = []
    styles: List[str] = []
    hourly_rate: Optional[float] = None
    day_rate: Optional[float] = None
    availability: str = "Available Now"
    turnaround_time: str = "3-5 business days"
    commercial_permissions: Optional[CommercialPermissions] = Field(default_factory=CommercialPermissions)
    rating: float = 4.9

class CreatorProfileUpdate(BaseModel):
    headline: Optional[str] = None
    biography: Optional[str] = None
    location: Optional[str] = None
    specialization: Optional[str] = None
    skills: Optional[List[str]] = None
    tools: Optional[List[str]] = None
    content_types: Optional[List[str]] = None
    styles: Optional[List[str]] = None
    hourly_rate: Optional[float] = None
    day_rate: Optional[float] = None
    availability: Optional[str] = None
    turnaround_time: Optional[str] = None

# Portfolio Schemas
class PortfolioItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    media_url: str
    media_type: str = "image" # 'image' or 'video'
    thumbnail_url: Optional[str] = None
    tools_used: List[str] = []
    prompt_summary: Optional[str] = None
    workflow_steps: List[str] = []
    aspect_ratio: str = "16:9"
    duration: Optional[str] = None
    resolution: str = "4K UHD"
    tags: List[str] = []
    verification_status: str = "self_reported" # 'verified_creator', 'self_reported', 'community_verified'

class PortfolioItemCreate(PortfolioItemBase):
    creator_id: str

class PortfolioItemResponse(PortfolioItemBase):
    id: str
    creator_id: str
    created_at: Optional[str] = None

# Match Breakdown
class MatchExplanation(BaseModel):
    score: int # 0 to 100
    overlapping_skills: List[str] = []
    overlapping_tools: List[str] = []
    overlapping_content_types: List[str] = []
    overlapping_styles: List[str] = []
    budget_fit: bool = True
    reasons: List[str] = []

# Creator Complete Response
class CreatorDetailResponse(BaseModel):
    profile: ProfileResponse
    creator_profile: CreatorProfileBase
    portfolio_items: List[PortfolioItemResponse] = []
    verifications: List[Dict[str, Any]] = []
    match_explanation: Optional[MatchExplanation] = None

# Brief Schemas
class BriefBase(BaseModel):
    title: str
    objective: Optional[str] = None
    description: str
    target_audience: Optional[str] = None
    content_type: str
    style: Optional[str] = None
    tone: Optional[str] = None
    aspect_ratio: str = "16:9"
    duration: Optional[str] = None
    resolution: str = "1080p"
    deliverables: List[str] = []
    preferred_tools: List[str] = []
    required_skills: List[str] = []
    references: List[str] = []
    budget: float
    currency: str = "USD"
    deadline: Optional[str] = None
    revisions: int = 2
    licensing_territory: str = "Worldwide"
    licensing_duration: str = "Perpetual"
    licensing_exclusivity: bool = True
    ai_disclosure_required: bool = True
    ownership_type: str = "Full Buyout"
    status: str = "published"

class BriefCreate(BriefBase):
    brand_id: str

class BriefResponse(BriefBase):
    id: str
    brand_id: str
    brand_name: Optional[str] = None
    brand_avatar: Optional[str] = None
    created_at: Optional[str] = None
    proposal_count: int = 0

# Groq AI Assist Schemas
class BriefAssistRequest(BaseModel):
    rough_idea: str = Field(..., description="Rough campaign idea, e.g. 'Create a 30-second futuristic sneaker commercial for IG Reels'")
    target_audience: Optional[str] = None
    budget_range: Optional[str] = None

class BriefAssistResponse(BaseModel):
    campaign_title: str
    objective: str
    description: str
    target_audience: str
    content_type: str
    style: str
    tone: str
    aspect_ratio: str
    duration: str
    deliverables: List[str]
    suggested_tools: List[str]
    required_skills: List[str]
    platforms: List[str]
    budget_guidance: str
    estimated_budget: float
    commercial_considerations: List[str]
    clarifying_questions: List[str]
    generated_via: str = "groq" # 'groq' or 'fallback'

# Proposal Schemas
class ProposalCreate(BaseModel):
    brief_id: str
    creator_id: str
    message: str
    proposed_price: float
    estimated_timeline: str

class ProposalResponse(BaseModel):
    id: str
    brief_id: str
    creator_id: str
    creator_name: Optional[str] = None
    creator_avatar: Optional[str] = None
    creator_specialization: Optional[str] = None
    message: str
    proposed_price: float
    estimated_timeline: str
    status: str = "pending" # 'pending', 'accepted', 'declined'
    created_at: Optional[str] = None

# Engagement Schemas
class EngagementResponse(BaseModel):
    id: str
    brief_id: str
    brief_title: Optional[str] = None
    creator_id: str
    creator_name: Optional[str] = None
    brand_id: str
    brand_name: Optional[str] = None
    agreed_price: float
    usage_rights: str
    status: str = "active" # 'active', 'in_review', 'completed', 'cancelled'
    created_at: Optional[str] = None

# Deliverable Schemas
class DeliverableCreate(BaseModel):
    engagement_id: str
    file_url: str
    notes: Optional[str] = None

class DeliverableResponse(BaseModel):
    id: str
    engagement_id: str
    version: int
    file_url: str
    notes: Optional[str] = None
    approval_status: str = "submitted" # 'submitted', 'approved', 'revision_requested'
    feedback: Optional[str] = None
    submitted_at: Optional[str] = None
