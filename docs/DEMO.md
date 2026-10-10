# CREOVATE - 3-Minute Product Demo Script & Walkthrough

## Setup & Execution Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ / npm

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
# (Optional: configure GROQ_API_KEY and SUPABASE keys in backend/.env)
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 3-Minute Live Demo Script

### 0:00 - 0:45 | Introduction & Cinematic Hero Landing
- **Narrator**: *"Welcome to CREOVATE, the premier AI Content Creator Marketplace connecting AI filmmakers, generative artists, brands, and creative agencies."*
- **Action**: Show landing hero, featuring dark luxury glassmorphism, dynamic stats banner, and direct toggle entry points ("I'm a Brand" vs "I'm a Creator").
- **Action**: Highlight the core value proposition: discovering verified AI talent, transparent workflow breakdowns, and AI-assisted brief creation powered by Groq.

### 0:45 - 1:30 | Creator Discovery & Transparent AI Portfolios
- **Narrator**: *"Brands can browse 12 pre-seeded specialized AI creators across categories like Photorealistic Sci-Fi, Fashion Ads, and 3D Surrealism."*
- **Action**:
  1. Filter creators by Specialization (`AI Filmmaking & VFX`), Tools (`Runway Gen-3`, `Midjourney v6`), and Commercial Rights.
  2. Notice the real-time **AI Match Score** calculation based on active campaign criteria with detailed explanation tags.
  3. Click on **Elena Vance's profile** to inspect the portfolio item *"Neon Horizon 2099"*.
  4. Open the **"How it was made"** modal. Point out the transparent step-by-step workflow timeline (Midjourney -> ComfyUI ControlNet -> Runway Gen-3 -> Topaz Video AI), prompt breakdown, aspect ratio (`16:9`), and clear verification badge.

### 1:30 - 2:15 | Groq-Assisted Campaign Brief Builder
- **Narrator**: *"Creating detailed creative briefs for AI generation can be complex. CREOVATE integrates Groq LLM to instantly generate structured campaigns from rough ideas."*
- **Action**:
  1. Click **"Post a Brief"** -> Open the **Groq AI Assistant**.
  2. Input a prompt: *"Create a 30-second futuristic sneaker advertisement for Instagram Reels"*.
  3. Click **"Generate Brief with Groq AI"**. Watch the AI populate structured fields: campaign objective, deliverables (9:16 vertical reels), suggested tools (`Flux.1`, `Luma Dream Machine`), budget guidance (\$3,500), and commercial licensing considerations.
  4. Review and tweak fields before publishing (demonstrating user review before live submission).
  5. Click **"Publish Brief"**.

### 2:15 - 3:00 | Proposals, Engagements & Deliverable Approvals
- **Narrator**: *"Creators bid on briefs, and brands track projects seamlessly with versioned deliverable management."*
- **Action**:
  1. Switch role to **Creator** via quick-role switcher or login.
  2. View published briefs in the Creator Brief Gallery and submit a proposal for the Sneaker Campaign (\$3,200 bid, 3-day timeline).
  3. Switch back to **Brand Dashboard**. Review incoming proposals, accept the proposal, and view the newly created **Active Engagement**.
  4. Demonstrate submitting a deliverable (v1 URL) as Creator, then viewing and approving the submission as Brand with agreed usage rights persistence.

---

## Technical Highlights
- **Groq Integration**: Uses official `groq` Python SDK with structured JSON Pydantic parsing and deterministic rule-based fallback if offline/no key present.
- **Supabase Integration**: Complete PostgreSQL schema, RLS policies, seed dataset, and Auth support with instant dual-mode local preview fallback.
- **Visual Design**: High-density cinematic dark mode, glass cards, dynamic badges, and responsive layouts built with React + Tailwind CSS.
