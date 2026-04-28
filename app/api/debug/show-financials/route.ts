import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This debug endpoint is protected by a secret key.
// Pass it as: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
export async function GET(request: Request) {
  // ── Auth guard ───────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Query ────────────────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase env vars missing.' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const searchToken = new URL(request.url).searchParams.get('token')

  if (searchToken) {
    const { data, error } = await supabase
      .from('shows')
      .select('id, portal_token, deal_type, deal_guarantee, deal_percentage, ticket_tiers, expenses')
      .eq('portal_token', searchToken)
      .maybeSingle()

    return NextResponse.json({ data, error })
  }

  const { data, error } = await supabase
    .from('shows')
    .select('id, show_name, portal_token, deal_type, deal_guarantee, deal_percentage, ticket_tiers, expenses, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({ data, error })
}
