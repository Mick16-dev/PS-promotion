import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const showSchema = z.object({
  show_id: z.string().uuid(),
  user_id: z.string().uuid(),
  show_name: z.string().min(1),
}).passthrough()

export async function POST(request: Request) {
  const webhookUrl =
    process.env.N8N_CREATE_SHOW_WEBHOOK ??
    process.env.NEXT_PUBLIC_N8N_CREATE_SHOW_WEBHOOK ??
    ''

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Create-show webhook is not configured.' },
      { status: 500 },
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  // Passive security check
  const result = showSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Security Validation Error', details: result.error.format() },
      { status: 400 }
    )
  }

  try {
    // ── Verify the request's user_id matches the session ────────────────────
    // We do this before any service-role action to avoid user_id spoofing.
    const cookieStore = await cookies()
    const authedSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: authData, error: authErr } = await authedSupabase.auth.getUser()
    if (authErr || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (authData.user.id !== result.data.user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const text = await res.text()

    // ── Post-insert repair: ensure row is visible via RLS ───────────────────
    // n8n inserts can succeed but omit user_id/show_date/venue_name, which can
    // make the row invisible to the dashboard (RLS policies often key on user_id).
    // We patch the row server-side using the service role key (never exposed).
    try {
      const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
      const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

      if (supabaseUrl && serviceKey) {
        const admin = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })

        const showId = result.data.show_id
        const userId = result.data.user_id

        // Attempt update by primary id first (most common n8n behavior).
        const repairPatch: Record<string, any> = { user_id: userId }
        if (typeof body?.show_date === 'string' && body.show_date) repairPatch.show_date = body.show_date
        if (typeof body?.date === 'string' && body.date) repairPatch.date = body.date
        if (typeof body?.venue_name === 'string' && body.venue_name) repairPatch.venue_name = body.venue_name
        if (typeof body?.venue === 'string' && body.venue) repairPatch.venue = body.venue
        if (typeof body?.artist_name === 'string' && body.artist_name) repairPatch.artist_name = body.artist_name
        if (typeof body?.city === 'string' && body.city) repairPatch.city = body.city
        if (typeof body?.show_name === 'string' && body.show_name) repairPatch.show_name = body.show_name

        const { data: updated, error: updateErr } = await admin
          .from('shows')
          .update(repairPatch)
          .eq('id', showId)
          .select('id')
          .maybeSingle()

        // Fallback: if n8n stores our UUID in a `show_id` column, repair that row.
        if (!updated?.id) {
          await admin
            .from('shows')
            .update(repairPatch)
            .eq('show_id', showId)
            .select('id')
            .maybeSingle()
        }

        // Ensure materials created without user_id are still joinable under RLS.
        await admin
          .from('materials')
          .update({ user_id: userId })
          .eq('show_id', showId)
      }
    } catch {
      // Non-fatal: creation already succeeded. This is a best-effort repair.
    }

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        body: text,
        diagnostic_payload: body
      },
      { status: res.ok ? 200 : 502 },
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to reach n8n.', details: e?.message ?? String(e) },
      { status: 502 },
    )
  }
}
