import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Get total active shows count
  const { count: totalShows } = await supabase
    .from('shows')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // 2. Get materials stats
  // For production performance, we'll fetch only what's needed for the "Priority" list (top 10 overdue)
  // and use a count for the rest.
  const { data: overdueMaterials, error: matErr } = await supabase
    .from('materials')
    .select(`
      id, 
      item_name, 
      deadline, 
      status,
      shows!inner (
        id,
        artist_name,
        venue,
        venue_name,
        user_id
      )
    `)
    .eq('shows.user_id', user.id)
    .not('status', 'in', '("delivered","submitted")')
    .lte('deadline', new Date().toISOString())
    .order('deadline', { ascending: true })
    .limit(10)

  // 3. Get total pending materials count (excluding overdue already fetched)
  const { count: awaitingDocs } = await supabase
    .from('materials')
    .select('id', { count: 'exact', head: true })
    .not('status', 'in', '("delivered","submitted")')
    .gt('deadline', new Date().toISOString())

  const { count: overdueDocs } = await supabase
    .from('materials')
    .select('id', { count: 'exact', head: true })
    .not('status', 'in', '("delivered","submitted")')
    .lte('deadline', new Date().toISOString())

  const overdueItems = (overdueMaterials || []).map((m: any) => ({
    id: m.id,
    artist: m.shows.artist_name,
    venue: m.shows.venue_name || m.shows.venue,
    document: m.item_name || 'Requirement',
    deadline: m.deadline,
    showId: m.shows.id
  }))

  return NextResponse.json({
    stats: {
      totalShows: totalShows || 0,
      awaitingDocs: awaitingDocs || 0,
      overdueDocs: overdueDocs || 0
    },
    overdueItems
  })
}
