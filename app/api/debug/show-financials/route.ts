import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase env vars missing.' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  if (token) {
    // Look up show by portal_token and return its financial columns
    const { data, error } = await supabase
      .from('shows')
      .select('id, portal_token, deal_type, deal_guarantee, deal_percentage, ticket_tiers, expenses')
      .eq('portal_token', token)
      .maybeSingle()

    return NextResponse.json({ data, error })
  }

  // Otherwise return the 5 most recent shows with financial columns
  const { data, error } = await supabase
    .from('shows')
    .select('id, show_name: show_name, portal_token, deal_type, deal_guarantee, deal_percentage, ticket_tiers, expenses, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({ data, error })
}
