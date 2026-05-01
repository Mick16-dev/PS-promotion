-- ============================================================
-- ShowReady – Performance & Scaling Migration
-- Adding B-Tree indexes for fast querying and sorting
-- ============================================================

-- 1. Shows Table Indexes
-- Fast filtering by promoter
CREATE INDEX IF NOT EXISTS idx_shows_user_id ON public.shows (user_id);
-- Fast sorting and filtering by date
CREATE INDEX IF NOT EXISTS idx_shows_show_date ON public.shows (show_date);
-- Fast lookup by artist
CREATE INDEX IF NOT EXISTS idx_shows_artist_id ON public.shows (artist_id);
-- Fast filtering by status
CREATE INDEX IF NOT EXISTS idx_shows_status ON public.shows (status);

-- 2. Materials Table Indexes
-- Fast lookup for materials belonging to a show
CREATE INDEX IF NOT EXISTS idx_materials_show_id ON public.materials (show_id);
-- Fast filtering by status
CREATE INDEX IF NOT EXISTS idx_materials_status ON public.materials (status);

-- 3. Artists Table Indexes
-- Fast lookup by name (for search)
CREATE INDEX IF NOT EXISTS idx_artists_name ON public.artists (name);
-- Ensure email lookups are fast
CREATE INDEX IF NOT EXISTS idx_artists_email ON public.artists (email);

-- 4. Venues Table Indexes
CREATE INDEX IF NOT EXISTS idx_venues_name ON public.venues (name);
