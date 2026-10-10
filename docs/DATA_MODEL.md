# CREOVATE Data Model Specification

## System Overview
CREOVATE is built on a Supabase PostgreSQL database architecture designed for AI content creators, generative artists, filmmakers, brands, and creative agencies. It enforces strict Row Level Security (RLS) policies and clear role differentiation (`brand` vs. `creator`).

---

## Entity Relationship Diagram (Conceptual)

```
[ auth.users ]
      │ (1:1)
      ▼
 [ profiles ]
   ├── (1:1) ──► [ creator_profiles ]
   ├── (1:N) ──► [ portfolio_items ]
   ├── (1:N) ──► [ creator_verifications ]
   ├── (1:N) ──► [ briefs ] (as brand)
   ├── (1:N) ──► [ proposals ] (as creator)
   ├── (1:N) ──► [ saved_creators ] (as brand)
   └── (1:N) ──► [ engagements ] (as brand or creator)
                    └── (1:N) ──► [ deliverables ]
```

---

## Data Tables & Attributes

### 1. `profiles`
Central user profile linked 1:1 with Supabase Auth (`auth.users.id`).
- `id` (UUID, PK): Primary key matching Auth User UUID.
- `role` (TEXT): `'brand'` or `'creator'`.
- `display_name` (TEXT): User or company name.
- `avatar_url` (TEXT): Profile photo or brand logo URL.
- `created_at` (TIMESTAMPTZ): Profile creation timestamp.

### 2. `creator_profiles`
Extended creator metadata for discovery and matching.
- `id` (UUID, PK): References `profiles(id)`.
- `headline` (TEXT): Bio tagline (e.g. "Photorealistic AI Sci-Fi Director").
- `biography` (TEXT): Full creator bio.
- `location` (TEXT): City & Country.
- `specialization` (TEXT): Primary focus (e.g. "Fashion & Product Ads", "AI VFX").
- `skills` (TEXT[]): Array of technical skills (e.g. `['Camera Control', 'Texture Synthesis']`).
- `tools` (TEXT[]): AI models & software (e.g. `['Midjourney v6', 'Runway Gen-3', 'Flux.1']`).
- `content_types` (TEXT[]): Deliverable formats (e.g. `['Social Ads', 'Brand Anthems']`).
- `styles` (TEXT[]): Visual styles (e.g. `['Photorealistic', 'Cyberpunk']`).
- `hourly_rate` / `day_rate` (NUMERIC): Commercial rates in USD.
- `availability` (TEXT): `'Available Now'`, `'Next Week'`, `'Booked'`, `'Part-time'`.
- `turnaround_time` (TEXT): Typical delivery estimate (e.g. "2-4 days").
- `commercial_permissions` (JSONB): Rights flags (resale, buyout, attribution).
- `rating` (NUMERIC): Average client rating (0.00 - 5.00).

### 3. `portfolio_items`
Visual showcase items demonstrating creator AI capabilities.
- `id` (UUID, PK): Unique item identifier.
- `creator_id` (UUID, FK): References `profiles(id)`.
- `title` (TEXT): Project title.
- `description` (TEXT): Project overview.
- `media_url` (TEXT): Image or video URL.
- `media_type` (TEXT): `'image'` or `'video'`.
- `thumbnail_url` (TEXT): Poster image.
- `tools_used` (TEXT[]): AI stack used for this work.
- `prompt_summary` (TEXT): Representative prompt snippet.
- `workflow_steps` (TEXT[]): Step-by-step breakdown of how it was made.
- `aspect_ratio` (TEXT): `'16:9'`, `'9:16'`, `'1:1'`, `'4:5'`.
- `duration` (TEXT): Video duration if applicable.
- `resolution` (TEXT): Render resolution (e.g. `'4K UHD'`).
- `tags` (TEXT[]): Categorization tags.
- `verification_status` (TEXT): `'verified_creator'`, `'self_reported'`, `'community_verified'`.

### 4. `creator_verifications`
Audit records for creator verification status.
- `id` (UUID, PK).
- `creator_id` (UUID, FK): References `profiles(id)`.
- `verification_type` (TEXT): Verification method.
- `evidence_url` (TEXT): Link to proof.
- `status` (TEXT): Verification state.

### 5. `briefs`
Brand campaign requirements.
- `id` (UUID, PK).
- `brand_id` (UUID, FK): References `profiles(id)`.
- `title` (TEXT): Campaign title.
- `objective` (TEXT): Marketing goal.
- `description` (TEXT): Comprehensive creative requirements.
- `target_audience` (TEXT): Audience demographics.
- `content_type` (TEXT): Campaign output type.
- `style` / `tone` (TEXT): Creative aesthetic guidance.
- `aspect_ratio` / `duration` / `resolution` (TEXT): Technical specs.
- `deliverables` (TEXT[]): Required final files.
- `preferred_tools` / `required_skills` (TEXT[]): AI requirements.
- `budget` (NUMERIC): Campaign budget in specified currency.
- `deadline` (TEXT): Completion target date.
- `licensing_territory` / `licensing_duration` / `licensing_exclusivity` / `ownership_type` (TEXT / BOOL): Rights parameters.
- `status` (TEXT): `'draft'`, `'published'`, `'in_progress'`, `'completed'`, `'cancelled'`.

### 6. `proposals`
Creator bids on published briefs.
- `id` (UUID, PK).
- `brief_id` (UUID, FK): References `briefs(id)`.
- `creator_id` (UUID, FK): References `profiles(id)`.
- `message` (TEXT): Proposal text & approach.
- `proposed_price` (NUMERIC): Price bid.
- `estimated_timeline` (TEXT): Completion estimate.
- `status` (TEXT): `'pending'`, `'accepted'`, `'declined'`.

### 7. `saved_creators`
Brand shortlists.
- `id` (UUID, PK).
- `brand_id` (UUID, FK): Brand owner.
- `creator_id` (UUID, FK): Shortlisted creator profile.

### 8. `engagements`
Agreed projects between brand and creator.
- `id` (UUID, PK).
- `brief_id` (UUID, FK).
- `creator_id` (UUID, FK).
- `brand_id` (UUID, FK).
- `agreed_price` (NUMERIC).
- `usage_rights` (TEXT): Licensing contract summary.
- `status` (TEXT): `'active'`, `'in_review'`, `'completed'`, `'cancelled'`.

### 9. `deliverables`
Versioned asset submissions for active engagements.
- `id` (UUID, PK).
- `engagement_id` (UUID, FK).
- `version` (INT): Deliverable version number (1, 2, 3...).
- `file_url` (TEXT): Media/file URL.
- `notes` (TEXT): Submission release notes.
- `approval_status` (TEXT): `'submitted'`, `'approved'`, `'revision_requested'`.
- `feedback` (TEXT): Brand review comments.

---

## Security & Access Control
- **Row Level Security (RLS)** enabled on all tables in Supabase PostgreSQL.
- **JWT Verification**: FastAPI backend verifies Supabase JWTs in headers for write operations.
- **Verification Rule**: Frontend user IDs are never trusted blindly; authenticated JWT payloads determine `user_id` and `role`.
