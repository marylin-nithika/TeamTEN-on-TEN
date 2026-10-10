-- CREOVATE Supabase Schema Migration
-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('brand', 'creator')),
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Creator Profiles Table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    headline TEXT,
    biography TEXT,
    location TEXT,
    specialization TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    tools TEXT[] DEFAULT '{}',
    content_types TEXT[] DEFAULT '{}',
    styles TEXT[] DEFAULT '{}',
    hourly_rate NUMERIC(10, 2),
    day_rate NUMERIC(10, 2),
    availability TEXT CHECK (availability IN ('Available Now', 'Next Week', 'Booked', 'Part-time')) DEFAULT 'Available Now',
    turnaround_time TEXT DEFAULT '3-5 business days',
    commercial_permissions JSONB DEFAULT '{"full_commercial": true, "resale": false, "nft_rights": false, "attribution_required": false}'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Portfolio Items Table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
    thumbnail_url TEXT,
    tools_used TEXT[] DEFAULT '{}',
    prompt_summary TEXT,
    workflow_steps TEXT[] DEFAULT '{}',
    aspect_ratio TEXT DEFAULT '16:9',
    duration TEXT,
    resolution TEXT DEFAULT '4K UHD',
    tags TEXT[] DEFAULT '{}',
    verification_status TEXT CHECK (verification_status IN ('verified_creator', 'self_reported', 'community_verified')) DEFAULT 'self_reported',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Creator Verifications Table
CREATE TABLE IF NOT EXISTS public.creator_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL,
    evidence_url TEXT,
    status TEXT NOT NULL DEFAULT 'verified',
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Briefs Table
CREATE TABLE IF NOT EXISTS public.briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    objective TEXT,
    description TEXT NOT NULL,
    target_audience TEXT,
    content_type TEXT NOT NULL,
    style TEXT,
    tone TEXT,
    aspect_ratio TEXT DEFAULT '16:9',
    duration TEXT,
    resolution TEXT DEFAULT '1080p',
    deliverables TEXT[] DEFAULT '{}',
    preferred_tools TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    references TEXT[] DEFAULT '{}',
    budget NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    deadline TEXT,
    revisions INT DEFAULT 2,
    licensing_territory TEXT DEFAULT 'Worldwide',
    licensing_duration TEXT DEFAULT 'Perpetual',
    licensing_exclusivity BOOLEAN DEFAULT true,
    ai_disclosure_required BOOLEAN DEFAULT true,
    ownership_type TEXT DEFAULT 'Full Buyout',
    status TEXT CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_id UUID NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    proposed_price NUMERIC(10, 2) NOT NULL,
    estimated_timeline TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brief_id, creator_id)
);

-- 7. Saved Creators Table
CREATE TABLE IF NOT EXISTS public.saved_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, creator_id)
);

-- 8. Engagements Table
CREATE TABLE IF NOT EXISTS public.engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_id UUID NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    agreed_price NUMERIC(10, 2) NOT NULL,
    usage_rights TEXT DEFAULT 'Full Commercial Buyout - Worldwide Perpetual',
    status TEXT CHECK (status IN ('active', 'in_review', 'completed', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Deliverables Table
CREATE TABLE IF NOT EXISTS public.deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id UUID NOT NULL REFERENCES public.engagements(id) ON DELETE CASCADE,
    version INT DEFAULT 1,
    file_url TEXT NOT NULL,
    notes TEXT,
    approval_status TEXT CHECK (approval_status IN ('submitted', 'approved', 'revision_requested')) DEFAULT 'submitted',
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_creator_profiles_spec ON public.creator_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_portfolio_creator ON public.portfolio_items(creator_id);
CREATE INDEX IF NOT EXISTS idx_briefs_brand ON public.briefs(brand_id);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON public.briefs(status);
CREATE INDEX IF NOT EXISTS idx_proposals_brief ON public.proposals(brief_id);
CREATE INDEX IF NOT EXISTS idx_proposals_creator ON public.proposals(creator_id);
CREATE INDEX IF NOT EXISTS idx_engagements_brand ON public.engagements(brand_id);
CREATE INDEX IF NOT EXISTS idx_engagements_creator ON public.engagements(creator_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Creator Profiles
CREATE POLICY "Creator profiles are viewable by everyone" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Creators can update their own creator profile" ON public.creator_profiles FOR ALL USING (auth.uid() = id);

-- Portfolio Items
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Creators can insert/update/delete their portfolio items" ON public.portfolio_items FOR ALL USING (auth.uid() = creator_id);

-- Creator Verifications
CREATE POLICY "Verifications viewable by everyone" ON public.creator_verifications FOR SELECT USING (true);

-- Briefs
CREATE POLICY "Briefs viewable by everyone" ON public.briefs FOR SELECT USING (true);
CREATE POLICY "Brands can manage their own briefs" ON public.briefs FOR ALL USING (auth.uid() = brand_id);

-- Proposals
CREATE POLICY "Proposals viewable by creator or brief brand" ON public.proposals FOR SELECT USING (
    auth.uid() = creator_id OR auth.uid() IN (SELECT brand_id FROM public.briefs WHERE id = brief_id)
);
CREATE POLICY "Creators can create proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators and brands can update proposals" ON public.proposals FOR UPDATE USING (
    auth.uid() = creator_id OR auth.uid() IN (SELECT brand_id FROM public.briefs WHERE id = brief_id)
);

-- Saved Creators
CREATE POLICY "Brands can view saved creators" ON public.saved_creators FOR SELECT USING (auth.uid() = brand_id);
CREATE POLICY "Brands can insert/delete saved creators" ON public.saved_creators FOR ALL USING (auth.uid() = brand_id);

-- Engagements
CREATE POLICY "Engagements viewable by brand or creator" ON public.engagements FOR SELECT USING (
    auth.uid() = brand_id OR auth.uid() = creator_id
);
CREATE POLICY "Brands and creators can update engagements" ON public.engagements FOR UPDATE USING (
    auth.uid() = brand_id OR auth.uid() = creator_id
);

-- Deliverables
CREATE POLICY "Deliverables viewable by engagement participants" ON public.deliverables FOR SELECT USING (
    auth.uid() IN (SELECT brand_id FROM public.engagements WHERE id = engagement_id) OR
    auth.uid() IN (SELECT creator_id FROM public.engagements WHERE id = engagement_id)
);
CREATE POLICY "Creators can insert deliverables" ON public.deliverables FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT creator_id FROM public.engagements WHERE id = engagement_id)
);
CREATE POLICY "Participants can update deliverables" ON public.deliverables FOR UPDATE USING (
    auth.uid() IN (SELECT brand_id FROM public.engagements WHERE id = engagement_id) OR
    auth.uid() IN (SELECT creator_id FROM public.engagements WHERE id = engagement_id)
);
