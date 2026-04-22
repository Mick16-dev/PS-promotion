-- ============================================================
-- ShowReady – Financial Columns Migration
-- Run this in your Supabase SQL Editor (once)
-- ============================================================

-- 1. Add financial columns to shows table (safe – only adds if missing)
ALTER TABLE public.shows
  ADD COLUMN IF NOT EXISTS ticket_tiers   JSONB    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS expenses       JSONB    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deal_type      TEXT     DEFAULT 'flat',
  ADD COLUMN IF NOT EXISTS deal_guarantee NUMERIC  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deal_percentage NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS venue_id       UUID     REFERENCES public.venues(id) ON DELETE SET NULL;

-- 2. Confirm portal_token column exists (needed for the polling lookup)
ALTER TABLE public.shows
  ADD COLUMN IF NOT EXISTS portal_token TEXT;

-- Create index for fast portal_token lookups
CREATE INDEX IF NOT EXISTS idx_shows_portal_token ON public.shows (portal_token);

-- 3. RLS – Allow anon/authenticated users to UPDATE financial fields
--    (Only needed if RLS is enabled on the shows table)
--    IMPORTANT: Adjust the policy name/conditions to match your existing policies.

-- Check if RLS is enabled first (run this SELECT to see):
-- SELECT relrowsecurity FROM pg_class WHERE relname = 'shows';

-- If RLS IS enabled, add an update policy:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'shows' AND policyname = 'allow_financial_update'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY allow_financial_update ON public.shows
        FOR UPDATE
        USING (true)
        WITH CHECK (true);
    $policy$;
  END IF;
END $$;

-- 4. Verify columns exist after migration
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'shows'
  AND column_name IN (
    'ticket_tiers', 'expenses', 'deal_type',
    'deal_guarantee', 'deal_percentage', 'venue_id', 'portal_token'
  )
ORDER BY column_name;
