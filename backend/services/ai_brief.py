import json
import logging
from typing import Optional
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL
from schemas import BriefAssistRequest, BriefAssistResponse

logger = logging.getLogger(__name__)

def generate_fallback_brief(request: BriefAssistRequest) -> BriefAssistResponse:
    """Deterministic rule-based fallback brief generator."""
    idea = request.rough_idea.lower()
    
    # Simple rule matching for defaults
    aspect_ratio = "9:16" if "reel" in idea or "tiktok" in idea or "vertical" in idea or "short" in idea else "16:9"
    duration = "0:30" if "30" in idea else ("0:15" if "15" in idea else "0:60")
    
    if "sneaker" in idea or "footwear" in idea or "shoe" in idea:
        title = "Futuristic Sneaker Launch Campaign"
        content_type = "Social Media Commercial"
        style = "Cyberpunk / Photorealistic"
        tone = "High-Energy, High-Tech, Premium"
        tools = ["Flux.1", "Runway Gen-3", "Luma Dream Machine", "Topaz Video AI"]
        skills = ["3D Motion Synthesis", "High-Speed Particle Effects", "Color Grading"]
        deliverables = ["1x Vertical Master (9:16)", "1x Square Cutdown (1:1)", "Keyframe Prompt Pack"]
        budget = 3500.0
    elif "drink" in idea or "beverage" in idea or "food" in idea:
        title = "Bio-Organic Beverage Commercial"
        content_type = "Brand Anthem Video"
        style = "Organic Bio / Surrealist"
        tone = "Refreshing, Inspiring, High-End"
        tools = ["Midjourney v6", "Kling AI", "ElevenLabs", "Topaz Video AI"]
        skills = ["Fluid Physics AI", "Photorealistic Lighting", "Macro Detail"]
        deliverables = ["1x Landscape Master (16:9)", "1x Vertical Reel Cutdown (9:16)"]
        budget = 2800.0
    elif "watch" in idea or "luxury" in idea or "fashion" in idea:
        title = "Haute Couture & Luxury Showcase"
        content_type = "Product Launch Teaser"
        style = "Minimalist Luxury / Macro Editorial"
        tone = "Sophisticated, Mysterious, Elegant"
        tools = ["Flux.1", "Magnific AI", "Photoshop AI", "DaVinci Resolve"]
        skills = ["Texture Synthesis", "Macro Lighting", "Consistent Geometry"]
        deliverables = ["3x 15s Micro Teasers", "High-Res Still Keyframes"]
        budget = 4500.0
    else:
        title = f"AI Commercial: {request.rough_idea[:40]}..."
        content_type = "Digital Video Campaign"
        style = "Photorealistic Cinematic"
        tone = "Modern, Dynamic, Engaging"
        tools = ["Midjourney v6", "Runway Gen-3", "Flux.1", "ComfyUI"]
        skills = ["Camera Control", "Prompt Architecture", "Color Grading"]
        deliverables = ["1x Master Video Asset", "Source Prompts & Assets"]
        budget = 3000.0

    return BriefAssistResponse(
        campaign_title=title,
        objective=f"Produce a high-conversion AI campaign for: {request.rough_idea}",
        description=f"Detailed creative campaign requirement generated for '{request.rough_idea}'. Focused on visual impact, brand consistency, and optimized delivery.",
        target_audience=request.target_audience or "Gen Z & Millennial consumers, digital native professionals aged 18-38",
        content_type=content_type,
        style=style,
        tone=tone,
        aspect_ratio=aspect_ratio,
        duration=duration,
        deliverables=deliverables,
        suggested_tools=tools,
        required_skills=skills,
        platforms=["Instagram Reels", "TikTok", "YouTube Shorts"],
        budget_guidance=f"Estimated budget for top-tier generative creators is approx ${budget:,.0f} USD.",
        estimated_budget=budget,
        commercial_considerations=[
            "Full commercial buyout required for digital ad placement",
            "AI tool disclosure statement mandatory for brand compliance",
            "Perpetual worldwide rights recommended"
        ],
        clarifying_questions=[
            "Do you require custom audio design or voiceover generation?",
            "Are there specific brand color guidelines or logos to embed?"
        ],
        generated_via="fallback"
    )

def generate_groq_brief(request: BriefAssistRequest) -> BriefAssistResponse:
    """Generate structured brief suggestions using Groq SDK with fallback support."""
    if not GROQ_API_KEY or GROQ_API_KEY.startswith("gsk_placeholder"):
        logger.info("Groq API key not set or is placeholder. Using rule-based fallback.")
        return generate_fallback_brief(request)

    prompt = f"""
You are an expert AI Creative Director and Executive Producer.
Analyze the following campaign idea and generate a structured JSON campaign brief for generative AI filmmakers/animators.

Campaign Input:
- Idea: "{request.rough_idea}"
- Target Audience: "{request.target_audience or 'Not specified'}"
- Budget Range: "{request.budget_range or 'Not specified'}"

You MUST respond strictly with valid JSON containing the following keys:
{{
  "campaign_title": "Short catchy title",
  "objective": "Clear campaign objective",
  "description": "2-3 sentence detailed creative description",
  "target_audience": "Specific audience demographic",
  "content_type": "Social Media Commercial | Brand Anthem Video | Product Launch Teaser | Architectural Flythrough | 3D Surrealist Animation",
  "style": "Visual style, e.g., Photorealistic / Cyberpunk / Minimalist Luxury",
  "tone": "Tone keywords, e.g. High-Energy, Premium",
  "aspect_ratio": "9:16 | 16:9 | 1:1 | 4:5",
  "duration": "0:15 | 0:30 | 0:45 | 1:00",
  "deliverables": ["List of deliverables"],
  "suggested_tools": ["List of AI tools e.g., Midjourney v6, Flux.1, Runway Gen-3, Luma Dream Machine, Sora"],
  "required_skills": ["List of skills"],
  "platforms": ["List of distribution platforms"],
  "budget_guidance": "Brief text explanation of budget rationale",
  "estimated_budget": 3500.0,
  "commercial_considerations": ["List of 2-3 licensing or AI disclosure points"],
  "clarifying_questions": ["List of 2 clarifying questions for the brand"]
}}
"""

    try:
        client = Groq(api_key=GROQ_API_KEY)
        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a professional creative producer AI returning strictly JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=1200,
            timeout=15.0
        )
        
        raw_json = completion.choices[0].message.content
        data = json.loads(raw_json)
        
        return BriefAssistResponse(
            campaign_title=data.get("campaign_title", "AI Generative Campaign"),
            objective=data.get("objective", f"Produce campaign for: {request.rough_idea}"),
            description=data.get("description", request.rough_idea),
            target_audience=data.get("target_audience", "General Target Audience"),
            content_type=data.get("content_type", "Social Media Commercial"),
            style=data.get("style", "Photorealistic"),
            tone=data.get("tone", "High-Tech, Premium"),
            aspect_ratio=data.get("aspect_ratio", "16:9"),
            duration=data.get("duration", "0:30"),
            deliverables=data.get("deliverables", ["1x Master Video Asset"]),
            suggested_tools=data.get("suggested_tools", ["Midjourney v6", "Runway Gen-3"]),
            required_skills=data.get("required_skills", ["Prompt Architecture", "Camera Control"]),
            platforms=data.get("platforms", ["Instagram", "YouTube"]),
            budget_guidance=data.get("budget_guidance", "Estimated rate based on complexity"),
            estimated_budget=float(data.get("estimated_budget", 3000.0)),
            commercial_considerations=data.get("commercial_considerations", ["Full Commercial Buyout"]),
            clarifying_questions=data.get("clarifying_questions", ["What is your target launch date?"]),
            generated_via="groq"
        )
    except Exception as e:
        logger.warning(f"Groq API call failed or timed out: {e}. Falling back to rule-based generation.")
        return generate_fallback_brief(request)
