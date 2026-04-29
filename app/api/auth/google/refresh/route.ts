import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/google/refresh
 *
 * Checks if the user's stored Google access_token is expired.
 * If so, uses the refresh_token to obtain a new one, saves it to
 * user_integrations, and returns the fresh access_token.
 *
 * Returns: { access_token: string }
 */
export async function POST() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // ── Verify user session ──────────────────────────────────────────────────
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Fetch stored tokens ──────────────────────────────────────────────────
  const { data: integration, error: dbError } = await supabase
    .from('user_integrations')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', user.id)
    .eq('provider', 'google')
    .maybeSingle()

  if (dbError || !integration) {
    return NextResponse.json(
      { error: 'Google integration not found. Please connect your Google account in Settings.' },
      { status: 404 }
    )
  }

  if (!integration.refresh_token) {
    return NextResponse.json(
      { error: 'No refresh token stored. Please reconnect your Google account in Settings.' },
      { status: 400 }
    )
  }

  // ── Check if token is still valid (with 5-minute buffer) ─────────────────
  const expiresAt = integration.expires_at ? new Date(integration.expires_at).getTime() : 0
  const isExpired = Date.now() >= expiresAt - 5 * 60 * 1000 // 5 min buffer

  if (!isExpired) {
    // Token is still fresh — return it directly, no refresh needed
    return NextResponse.json({ access_token: integration.access_token })
  }

  // ── Token is expired — refresh it ────────────────────────────────────────
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Google OAuth credentials not configured on the server.' },
      { status: 500 }
    )
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: integration.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const tokens = await tokenRes.json()

  if (!tokenRes.ok || tokens.error) {
    return NextResponse.json(
      { error: 'Failed to refresh Google token. Please reconnect your Google account in Settings.', details: tokens },
      { status: 502 }
    )
  }

  // ── Save fresh token to DB ───────────────────────────────────────────────
  await supabase
    .from('user_integrations')
    .update({
      access_token: tokens.access_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('provider', 'google')

  return NextResponse.json({ access_token: tokens.access_token })
}
