import uuid
from typing import List, Dict, Any, Optional
from config import SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
from schemas import MatchExplanation

# Try importing supabase
supabase_client = None
if SUPABASE_URL and not SUPABASE_URL.startswith("https://placeholder"):
    try:
        from supabase import create_client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)
    except Exception as e:
        print(f"Supabase init note: {e}")

# In-Memory Seed Data for Preview & Hybrid execution
PROFILES_STORE: List[Dict[str, Any]] = [
    {"id": "11111111-1111-1111-1111-111111111111", "role": "brand", "display_name": "Aetheria Studio", "avatar_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop"},
    {"id": "22222222-2222-2222-2222-222222222222", "role": "brand", "display_name": "Neura Spark Agency", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000001", "role": "creator", "display_name": "Elena Vance", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000002", "role": "creator", "display_name": "Jaxson Thorne", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000003", "role": "creator", "display_name": "Amara Okafor", "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000004", "role": "creator", "display_name": "Kai Takahashi", "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000005", "role": "creator", "display_name": "Maya Lin", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000006", "role": "creator", "display_name": "Marcus Vance", "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000007", "role": "creator", "display_name": "Sophia Martinez", "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000008", "role": "creator", "display_name": "Liam O'Connor", "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000009", "role": "creator", "display_name": "Zoe Chen", "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000010", "role": "creator", "display_name": "David K. Rossi", "avatar_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000011", "role": "creator", "display_name": "Chloe Dubois", "avatar_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop"},
    {"id": "a0000000-0000-0000-0000-000000000012", "role": "creator", "display_name": "Tariq Al-Mansoor", "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop"}
]

CREATOR_PROFILES_STORE: List[Dict[str, Any]] = [
    {
        "id": "a0000000-0000-0000-0000-000000000001",
        "headline": "Photorealistic AI Sci-Fi & Cyberpunk Filmmaker",
        "biography": "Former VFX Supervisor with 8 years in Hollywood turned generative AI director. Specializes in photorealistic cinematic commercials and narrative teasers using Midjourney v6, Sora, and Runway Gen-3.",
        "location": "Los Angeles, CA",
        "specialization": "AI Filmmaking & VFX",
        "skills": ["Cinematic Lighting", "Prompt Architecture", "Camera Motion Control", "Color Grading", "3D Motion Synthesis"],
        "tools": ["Midjourney v6", "Runway Gen-3", "Sora", "ComfyUI", "Topaz Video AI", "Flux.1"],
        "content_types": ["Video Commercials", "Movie Teasers", "Brand Anthems", "Social Media Commercial"],
        "styles": ["Photorealistic", "Cyberpunk", "Cinematic Noir"],
        "hourly_rate": 150,
        "day_rate": 1100,
        "availability": "Available Now",
        "turnaround_time": "2-4 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.98
    },
    {
        "id": "a0000000-0000-0000-0000-000000000002",
        "headline": "Hyper-Realistic Commercial & Fashion Generative Director",
        "biography": "Creative Director helping global luxury brands create ultra-refined product ads using Flux.1 and Luma Dream Machine.",
        "location": "New York, NY",
        "specialization": "Fashion & Product Ads",
        "skills": ["Luxury Aesthetic", "Texture Synthesis", "Model Consistency", "Sound Design"],
        "tools": ["Flux.1", "Luma Dream Machine", "Midjourney v6", "Photoshop AI"],
        "content_types": ["Social Ads", "Product Trailers", "Lookbooks", "Product Launch Teaser"],
        "styles": ["Hyper-Realistic", "Minimalist Luxury", "High Fashion"],
        "hourly_rate": 180,
        "day_rate": 1300,
        "availability": "Available Now",
        "turnaround_time": "3-5 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.95
    },
    {
        "id": "a0000000-0000-0000-0000-000000000003",
        "headline": "3D Surrealist & Organic AI Motion Artist",
        "biography": "Blending bio-luminescent organic textures with fluid AI animations. Crafting music video visuals and immersive brand experiences.",
        "location": "Berlin, Germany",
        "specialization": "3D Surrealist Animation",
        "skills": ["Organic Texturing", "Fluid Motion", "Audio-Reactive Sync", "Fluid Physics AI"],
        "tools": ["Kling AI", "ElevenLabs", "Stable Diffusion XL", "Blender AI", "Midjourney v6"],
        "content_types": ["Music Videos", "Exhibition Visuals", "Brand Anthem Video"],
        "styles": ["Surrealist", "Organic Bio", "Psychedelic"],
        "hourly_rate": 120,
        "day_rate": 900,
        "availability": "Next Week",
        "turnaround_time": "5-7 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.89
    },
    {
        "id": "a0000000-0000-0000-0000-000000000004",
        "headline": "Anime & High-Speed Action AI VFX Specialist",
        "biography": "Pioneer in AI anime dynamics, dynamic camera motion, and action choreography using AnimateDiff and ControlNet workflows.",
        "location": "Tokyo, Japan",
        "specialization": "Anime & Action VFX",
        "skills": ["Action Choreography", "ControlNet Pose Sync", "Cel Shading AI"],
        "tools": ["AnimateDiff", "ControlNet", "Flux.1", "Premiere Pro"],
        "content_types": ["Anime Commercials", "Game Trailers", "Short Clips"],
        "styles": ["Anime / Manga", "Dynamic Action", "Vibrant"],
        "hourly_rate": 140,
        "day_rate": 1000,
        "availability": "Available Now",
        "turnaround_time": "2-3 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.92
    },
    {
        "id": "a0000000-0000-0000-0000-000000000005",
        "headline": "Luxury Brand & Architectural AI Visualizer",
        "biography": "Architect turned visual designer creating sweeping arch-viz flythroughs and luxury lifestyle commercials.",
        "location": "London, UK",
        "specialization": "Architectural & Lifestyle",
        "skills": ["Lighting Design", "Architectural Framing", "4K Upscaling"],
        "tools": ["Midjourney v6", "Runway Gen-3", "Magnific AI", "Photoshop"],
        "content_types": ["Architectural Flythroughs", "Property Promos", "Lifestyle Videos"],
        "styles": ["Photorealistic", "Architectural", "Elegant"],
        "hourly_rate": 165,
        "day_rate": 1200,
        "availability": "Part-time",
        "turnaround_time": "4-6 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.97
    },
    {
        "id": "a0000000-0000-0000-0000-000000000006",
        "headline": "Character Design & Deep Cinematic Worldbuilding",
        "biography": "Creating consistent multi-scene AI characters and detailed narrative visual bibles for gaming studios and agencies.",
        "location": "Austin, TX",
        "specialization": "Character & Worldbuilding",
        "skills": ["IP-Adapter Consistency", "Multi-Angle Character Sheet", "Voice Synthesis"],
        "tools": ["ComfyUI", "IP-Adapter", "ElevenLabs", "Suno AI"],
        "content_types": ["Character Reels", "Concept Bibles", "Gaming Teasers"],
        "styles": ["Dark Fantasy", "Sci-Fi", "Cinematic"],
        "hourly_rate": 135,
        "day_rate": 950,
        "availability": "Available Now",
        "turnaround_time": "3-5 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.88
    },
    {
        "id": "a0000000-0000-0000-0000-000000000007",
        "headline": "Motion Graphics & Generative Product Commercials",
        "biography": "Fast-turnaround social media ad specialist delivering 9:16 vertical reels with high hook rates and vibrant product drops.",
        "location": "Miami, FL",
        "specialization": "Social Ads & Reels",
        "skills": ["Hook Optimization", "Dynamic Typography", "Fast Pacing", "High-Speed Particle Effects"],
        "tools": ["Luma Dream Machine", "Flux.1", "After Effects", "Topaz Video AI", "Runway Gen-3"],
        "content_types": ["Instagram Reels", "TikTok Ads", "Product Drops", "Social Media Commercial"],
        "styles": ["Vibrant Pop", "Futuristic", "High Contrast", "Cyberpunk / Photorealistic"],
        "hourly_rate": 110,
        "day_rate": 800,
        "availability": "Available Now",
        "turnaround_time": "1-2 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.91
    },
    {
        "id": "a0000000-0000-0000-0000-000000000008",
        "headline": "Documentary & Historical AI Film Reconstructions",
        "biography": "Combining historical archival research with generative motion AI to bring ancient civilizations and documentary scenes to life.",
        "location": "Dublin, Ireland",
        "specialization": "Historical & Documentary",
        "skills": ["Archival Style", "Facial Expression Control", "Voiceover Integration"],
        "tools": ["Runway Gen-3", "Midjourney v6", "ElevenLabs", "Motion Brush"],
        "content_types": ["Documentary Scenes", "Educational Reels", "Museum Visuals"],
        "styles": ["Vintage Photoreal", "Documentary Noir", "Cinematic"],
        "hourly_rate": 130,
        "day_rate": 950,
        "availability": "Booked",
        "turnaround_time": "5-7 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.96
    },
    {
        "id": "a0000000-0000-0000-0000-000000000009",
        "headline": "Abstract Generative Art & Live Concert Visuals",
        "biography": "Generative artist crafting procedural liquid light shows, glitch aesthetics, and high-resolution visuals for live tours.",
        "location": "Toronto, Canada",
        "specialization": "Abstract & Concert Visuals",
        "skills": ["Procedural Motion", "Color Field Theory", "Glitch Synthesis"],
        "tools": ["TouchDesigner AI", "Stable Video Diffusion", "Flux.1", "ComfyUI"],
        "content_types": ["Concert Loops", "Album Artwork", "Stage Backdrops"],
        "styles": ["Abstract Liquid", "Glitch Art", "Neo-Neon"],
        "hourly_rate": 125,
        "day_rate": 880,
        "availability": "Available Now",
        "turnaround_time": "2-4 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.87
    },
    {
        "id": "a0000000-0000-0000-0000-000000000010",
        "headline": "Automotive & Industrial AI Content Specialist",
        "biography": "High-velocity automotive commercials featuring synthetic supercars, dramatic storm lighting, and reflection mapping.",
        "location": "Milan, Italy",
        "specialization": "Automotive & Industrial",
        "skills": ["Raytraced Reflection AI", "Speed Tracking Motion", "Sound FX Layering"],
        "tools": ["Midjourney v6", "Luma Dream Machine", "Flux.1", "DaVinci Resolve"],
        "content_types": ["Automotive Promos", "Industrial Teasers", "3D Showcases"],
        "styles": ["Hyper-Realistic", "Industrial Metallic", "Dramatic Cinematic"],
        "hourly_rate": 175,
        "day_rate": 1250,
        "availability": "Available Now",
        "turnaround_time": "3-4 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.99
    },
    {
        "id": "a0000000-0000-0000-0000-000000000011",
        "headline": "Beauty & Editorial Fashion AI Director",
        "biography": "Sensory cosmetics visualizer specializing in macro skin textures, silk wave physics, and haute couture digital fashion.",
        "location": "Paris, France",
        "specialization": "Beauty & Editorial Fashion",
        "skills": ["Macro Texture Control", "Digital Fabric Physics", "Soft Studio Lighting"],
        "tools": ["Flux.1", "Magnific AI", "RunWay Gen-3", "Midjourney"],
        "content_types": ["Cosmetic Ads", "Editorial Videos", "Fashion Teasers"],
        "styles": ["Soft Editorial", "Minimalist Luxury", "High Gloss"],
        "hourly_rate": 160,
        "day_rate": 1150,
        "availability": "Next Week",
        "turnaround_time": "3-5 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.94
    },
    {
        "id": "a0000000-0000-0000-0000-000000000012",
        "headline": "Futuristic VFX & Fantasy Narrative Filmmaker",
        "biography": "Creating epic creature design, mystical magic effects, and otherworldly environment shots for film studios.",
        "location": "Dubai, UAE",
        "specialization": "Fantasy & Epic Storytelling",
        "skills": ["Creature Generation", "Particle VFX AI", "Atmosphere Control"],
        "tools": ["Kling AI", "Sora", "Midjourney v6", "ElevenLabs"],
        "content_types": ["Short Films", "Fantasy Trailers", "Concept Videos"],
        "styles": ["Dark Fantasy", "Epic Cinematic", "Mythological"],
        "hourly_rate": 155,
        "day_rate": 1100,
        "availability": "Available Now",
        "turnaround_time": "4-6 days",
        "commercial_permissions": {"full_commercial": True, "resale": False, "nft_rights": False, "attribution_required": False},
        "rating": 4.90
    }
]

PORTFOLIO_ITEMS_STORE: List[Dict[str, Any]] = [
    {
        "id": "p0000000-0000-0000-0000-000000000001",
        "creator_id": "a0000000-0000-0000-0000-000000000001",
        "title": "Neon Horizon 2099 - Cyberpunk Speeder Commercial",
        "description": "A 30-second hyper-realistic teaser showing an autonomous hovercraft speeding through neon rain in Neo-Tokyo.",
        "media_url": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&h=675&fit=crop",
        "media_type": "image",
        "thumbnail_url": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&h=337&fit=crop",
        "tools_used": ["Midjourney v6", "Runway Gen-3", "ComfyUI", "Topaz Video AI"],
        "prompt_summary": "Cinematic 8k shot of sleek obsidian speeder gliding through wet neon rain cityscape, volumetric fog, anamorphic lens flare --ar 16:9 --style raw",
        "workflow_steps": [
            "1. Prompt iteration in Midjourney v6 for base keyframes",
            "2. Frame enhancement and ControlNet depth mapping in ComfyUI",
            "3. Video motion generation in Runway Gen-3 with custom camera pan prompt",
            "4. 4K 60fps interpolation in Topaz Video AI"
        ],
        "aspect_ratio": "16:9",
        "duration": "0:30",
        "resolution": "4K UHD",
        "tags": ["Cyberpunk", "Sci-Fi", "Commercial", "Anamorphic"],
        "verification_status": "verified_creator"
    },
    {
        "id": "p0000000-0000-0000-0000-000000000002",
        "creator_id": "a0000000-0000-0000-0000-000000000002",
        "title": "Aether Silk - Luxury Perfume Reveal",
        "description": "Minimalist visual launch campaign featuring floating glass perfume bottles with organic silk wave physics.",
        "media_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=675&fit=crop",
        "media_type": "image",
        "thumbnail_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=337&fit=crop",
        "tools_used": ["Flux.1", "Luma Dream Machine", "Photoshop AI"],
        "prompt_summary": "Haute couture perfume bottle floating amidst liquid gold silk, studio refraction lighting, soft focus bokeh --ar 16:9",
        "workflow_steps": [
            "1. Flux.1 Schnell prompt for crystal glass material synthesis",
            "2. Multi-angle lighting rendering using Luma Dream Machine",
            "3. Color grading and macro detail enhancement in Photoshop AI"
        ],
        "aspect_ratio": "16:9",
        "duration": "0:20",
        "resolution": "4K UHD",
        "tags": ["Luxury", "Perfume", "Fashion", "Minimalist"],
        "verification_status": "verified_creator"
    },
    {
        "id": "p0000000-0000-0000-0000-000000000003",
        "creator_id": "a0000000-0000-0000-0000-000000000003",
        "title": "Bio-Luminescent Abyss",
        "description": "Surrealist motion piece exploring organic underwater structures emitting pulse light.",
        "media_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=675&fit=crop",
        "media_type": "image",
        "thumbnail_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=337&fit=crop",
        "tools_used": ["Kling AI", "Stable Diffusion XL", "Blender AI"],
        "prompt_summary": "Surreal alien coral organism pulsing with iridescent violet light in deep navy water, macro shot --ar 16:9",
        "workflow_steps": [
            "1. SDXL base generation with custom LoRA fine-tuned on marine life",
            "2. Kling AI camera zoom & fluid animation",
            "3. Blender AI volumetric lighting pass"
        ],
        "aspect_ratio": "16:9",
        "duration": "0:45",
        "resolution": "1080p HD",
        "tags": ["Surreal", "3D Animation", "Organic", "Music Video"],
        "verification_status": "community_verified"
    },
    {
        "id": "p0000000-0000-0000-0000-000000000004",
        "creator_id": "a0000000-0000-0000-0000-000000000007",
        "title": "Pulse Runner 9:16 Social Teaser",
        "description": "Vertical viral sneaker teaser optimized for Instagram Reels with dynamic glitch transitions.",
        "media_url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=675&h=1200&fit=crop",
        "media_type": "image",
        "thumbnail_url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=337&h=600&fit=crop",
        "tools_used": ["Luma Dream Machine", "Flux.1", "After Effects"],
        "prompt_summary": "Futuristic glowing running shoe assembling from digital energy particles, extreme vertical 9:16 format",
        "workflow_steps": [
            "1. Flux.1 shoe render in portrait aspect ratio",
            "2. Luma Dream Machine camera roll and particle effect",
            "3. AE sound design and kinetic typography overlay"
        ],
        "aspect_ratio": "9:16",
        "duration": "0:15",
        "resolution": "1080p HD",
        "tags": ["Instagram Reels", "Sneaker", "Social Ad", "Vertical"],
        "verification_status": "verified_creator"
    }
]

BRIEFS_STORE: List[Dict[str, Any]] = [
    {
        "id": "b0000000-0000-0000-0000-000000000001",
        "brand_id": "11111111-1111-1111-1111-111111111111",
        "title": "Futuristic Sneaker Launch Video",
        "objective": "Launch the Aether-V9 self-lacing cyber sneaker with a 30-second high-impact vertical video for Instagram Reels & TikTok.",
        "description": "We are looking for an AI visual artist to produce a sleek, photorealistic 30-second cyber-aesthetic commercial for our new footwear line. The video should showcase synthetic footwear assembling in mid-air with volumetric glow.",
        "target_audience": "Gen Z & Millennial sneakerheads, tech enthusiasts aged 18-35",
        "content_type": "Social Media Commercial",
        "style": "Cyberpunk / Photorealistic",
        "tone": "Energetic, High-Tech, Premium",
        "aspect_ratio": "9:16",
        "duration": "0:30",
        "resolution": "4K UHD",
        "deliverables": ["1x Vertical Master (9:16)", "1x Square Cutdown (1:1)", "Prompt & Source Assets"],
        "preferred_tools": ["Flux.1", "Runway Gen-3", "Luma Dream Machine"],
        "required_skills": ["3D Motion Synthesis", "High-Speed Particle Effects", "Color Grading"],
        "references": ["https://images.unsplash.com/photo-1552346154-21d32810aba3"],
        "budget": 3500.0,
        "currency": "USD",
        "deadline": "2026-11-15",
        "revisions": 2,
        "licensing_territory": "Worldwide",
        "licensing_duration": "Perpetual",
        "licensing_exclusivity": True,
        "ai_disclosure_required": True,
        "ownership_type": "Full Buyout",
        "status": "published",
        "created_at": "2026-10-10T12:00:00Z"
    },
    {
        "id": "b0000000-0000-0000-0000-000000000002",
        "brand_id": "22222222-2222-2222-2222-222222222222",
        "title": "Organic Energy Drink Commercial",
        "objective": "Create a 15-second cinematic landscape commercial showcasing nature meeting futuristic bio-tech.",
        "description": "Seeking an AI animator to craft a vibrant, organic surrealist clip of glowing botanical ingredients dissolving into a sleek liquid can under pristine daylight.",
        "target_audience": "Health-conscious professionals and fitness creators aged 22-40",
        "content_type": "Brand Anthem Video",
        "style": "Organic Bio / Surrealist",
        "tone": "Refreshing, Inspiring, High-End",
        "aspect_ratio": "16:9",
        "duration": "0:15",
        "resolution": "4K UHD",
        "deliverables": ["1x Landscape Master (16:9)", "Layered Audio Track"],
        "preferred_tools": ["Midjourney v6", "Kling AI", "Topaz Video AI"],
        "required_skills": ["Fluid Physics AI", "Photorealistic Lighting", "Macro Detail"],
        "references": [],
        "budget": 2800.0,
        "currency": "USD",
        "deadline": "2026-11-20",
        "revisions": 2,
        "licensing_territory": "Worldwide",
        "licensing_duration": "Perpetual",
        "licensing_exclusivity": True,
        "ai_disclosure_required": True,
        "ownership_type": "Full Buyout",
        "status": "published",
        "created_at": "2026-10-10T14:00:00Z"
    }
]

PROPOSALS_STORE: List[Dict[str, Any]] = [
    {
        "id": "prop0000-0000-0000-0000-000000000001",
        "brief_id": "b0000000-0000-0000-0000-000000000001",
        "creator_id": "a0000000-0000-0000-0000-000000000001",
        "message": "Hi Aetheria Team! I specialize in cyber footwear visualizer videos using Flux.1 and Runway Gen-3. I can deliver a 9:16 master with full audio and prompt documentation in 3 days.",
        "proposed_price": 3200.0,
        "estimated_timeline": "3 Days",
        "status": "pending",
        "created_at": "2026-10-10T14:30:00Z"
    }
]

ENGAGEMENTS_STORE: List[Dict[str, Any]] = []
DELIVERABLES_STORE: List[Dict[str, Any]] = []
SAVED_CREATORS_STORE: List[Dict[str, Any]] = []

def calculate_creator_match_score(creator: Dict[str, Any], target_skills: List[str], target_tools: List[str], target_content_type: str, target_style: str, target_budget: float) -> MatchExplanation:
    """Calculate creator match score (0-100) and rationale breakdown."""
    score = 40 # Base baseline score
    reasons = []
    
    # Skills overlap
    c_skills = set(s.lower() for s in creator.get("skills", []))
    req_skills = set(s.lower() for s in target_skills)
    overlap_skills = [s for s in creator.get("skills", []) if s.lower() in req_skills]
    if overlap_skills:
        score += len(overlap_skills) * 12
        reasons.append(f"Shares {len(overlap_skills)} key skill(s): {', '.join(overlap_skills)}")

    # Tools overlap
    c_tools = set(t.lower() for t in creator.get("tools", []))
    req_tools = set(t.lower() for t in target_tools)
    overlap_tools = [t for t in creator.get("tools", []) if t.lower() in req_tools]
    if overlap_tools:
        score += len(overlap_tools) * 10
        reasons.append(f"Proficient in required AI toolchain: {', '.join(overlap_tools)}")

    # Content type match
    c_content = [ct.lower() for ct in creator.get("content_types", [])]
    if target_content_type and any(target_content_type.lower() in ct for ct in c_content):
        score += 15
        reasons.append(f"Experienced in delivering '{target_content_type}' format")

    # Style match
    c_styles = [st.lower() for st in creator.get("styles", [])]
    if target_style and any(target_style.lower() in st for st in c_styles):
        score += 15
        reasons.append(f"Specialized in '{target_style}' aesthetic")

    # Budget fit
    day_rate = creator.get("day_rate", 1000)
    budget_fit = target_budget <= 0 or (day_rate * 2.5 <= target_budget)
    if budget_fit and target_budget > 0:
        score += 10
        reasons.append(f"Fits target campaign budget (Day rate: ${day_rate:,.0f})")

    final_score = min(100, max(25, score))
    
    if not reasons:
        reasons.append("General matching creator with strong generative AI portfolio")

    return MatchExplanation(
        score=final_score,
        overlapping_skills=overlap_skills,
        overlapping_tools=overlap_tools,
        overlapping_content_types=[ct for ct in creator.get("content_types", []) if target_content_type and target_content_type.lower() in ct.lower()],
        overlapping_styles=[st for st in creator.get("styles", []) if target_style and target_style.lower() in st.lower()],
        budget_fit=budget_fit,
        reasons=reasons
    )
