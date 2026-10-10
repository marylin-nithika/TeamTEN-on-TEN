# CREOVATE - Generative AI Content Creator Marketplace

CREOVATE is a modern, high-end AI Content Creator Marketplace connecting AI filmmakers, animators, 3D visualizers, generative artists, brands, and creative agencies.

---

## 🌟 Key Features

### 1. Creator Discovery & Smart AI Match Score
- **12 Pre-Seeded Specialized Creators**: Photorealistic Sci-Fi, Luxury Fashion, 3D Surrealism, Anime Action, Architectural, Automotive, and Character Worldbuilding.
- **Smart AI Match Score**: Dynamic scoring engine comparing campaign requirements against creator toolstack (`Flux.1`, `Midjourney v6`, `Runway Gen-3`, `Sora`, `Luma Dream Machine`, `Kling AI`), skills, content formats, and budget.
- **Transparent Rationale Breakdown**: Expandable tooltips explaining skill overlap, tool proficiency, and budget compatibility.

### 2. "How It Was Made" Workflow Timelines
- Transparent step-by-step pipeline breakdowns (e.g. Midjourney keyframe -> ComfyUI ControlNet depth mapping -> Runway Gen-3 camera pan -> Topaz 4K 60fps upscale).
- Prompts & seed summaries with one-click copy.
- Clear, un-misleading verification status indicators (`Verified Creator`, `Self-Reported Workflow`, `Community Verified`).

### 3. Groq-Powered AI Brief Assistant
- Integrated via the official **`groq` Python SDK** in the FastAPI backend (`POST /api/briefs/assist`).
- Uses model configured in `backend/.env` (`GROQ_MODEL=llama-3.3-70b-versatile`).
- Generates structured campaign briefs from rough ideas (title, objective, format, aspect ratio, duration, suggested tools, required skills, budget estimates, commercial considerations, and clarifying questions).
- **Deterministic Rule-Based Fallback**: Seamless offline fallback if Groq API key is unconfigured or encounters timeouts/rate limits.
- User review before saving: Suggestions populate form fields for human inspection before publishing.

### 4. End-to-End Campaign Engagement Flow
- **Brand Brief Builder**: Full campaign specification with technical constraints and commercial buyout licensing terms.
- **Creator Proposals**: Creators submit custom price bids, timeline estimates, and pitch proposals.
- **Contract & Engagement Management**: Brands accept proposals, initiating active engagements with agreed usage rights persistence.
- **Deliverable Version Control**: Creators submit versioned file URLs with release notes; brands inspect and approve deliverables.

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- Node.js (v18+) & npm
- Python (3.11+)

### 1. Start FastAPI Backend Server
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```
Backend API will run at `http://localhost:8000`.

### 2. Start React + Vite Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Frontend Web App will run at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

ENVIRONMENT=development
PORT=8000
```

### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📂 Project Architecture

```
contentcreator/
├── backend/
│   ├── main.py               # FastAPI entry point & CORS
│   ├── config.py             # Environment configuration
│   ├── database.py           # Data store & AI match score calculation engine
│   ├── auth.py               # JWT authentication & preview fallback
│   ├── schemas.py            # Pydantic data models
│   ├── services/
│   │   └── ai_brief.py       # Official Groq SDK service with structured output & fallback
│   ├── routers/
│   │   ├── creators.py       # Creator discovery & portfolio endpoints
│   │   ├── briefs.py         # Brief creation & Groq assist endpoints
│   │   ├── proposals.py      # Proposal bidding endpoints
│   │   └── engagements.py    # Engagement contracts & deliverable versioning
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css          # Dark luxury styling & Tailwind utilities
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   ├── api.js         # REST API client
│       │   └── supabase.js    # Supabase JS client
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── CreatorCard.jsx
│       │   ├── CreatorDetailModal.jsx
│       │   ├── WorkflowModal.jsx
│       │   ├── BriefCard.jsx
│       │   ├── BriefBuilderModal.jsx
│       │   ├── AiAssistModal.jsx
│       │   ├── MatchScoreBadge.jsx
│       │   ├── VerificationBadge.jsx
│       │   ├── ProposalModal.jsx
│       │   ├── DeliverableModal.jsx
│       │   └── AuthModal.jsx
│       └── pages/
│           ├── Landing.jsx
│           ├── CreatorsDiscovery.jsx
│           ├── BriefsMarketplace.jsx
│           ├── BrandDashboard.jsx
│           └── CreatorDashboard.jsx
├── supabase/
│   ├── migrations/
│   │   └── 20261010_initial_schema.sql
│   └── seed.sql
└── docs/
    ├── DATA_MODEL.md
    └── DEMO.md
```

---

## 🎬 3-Minute Product Walkthrough & Demo Script

Refer to [`docs/DEMO.md`](docs/DEMO.md) for the live 3-minute presentation script.

---

## 📌 Known Limitations & Future Scope
- **Real-time Messaging**: Out of scope for current 4-hour prototype (optional messaging omitted in favor of structured proposal bids).
- **Payment Processing**: Escrow and card checkout not integrated (agreed commercial pricing stored in engagements).
- **Supabase Preview Mode**: Dual-mode operational fallback ensures zero-config instant evaluation while remote Supabase migration scripts are provided in `supabase/migrations`.
