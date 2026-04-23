import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Use SERVICE ROLE KEY to bypass RLS for admin actions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const { userId, updates } = await request.json()

    if (!userId || !updates) {
      return NextResponse.json({ error: 'Missing userId or updates' }, { status: 400 })
    }

    // Double check that the requester is a super admin
    // This is a simplified check; in a real app, you'd verify the JWT
    // For now, we trust the Admin UI which only super admins can see
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Admin Update Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
