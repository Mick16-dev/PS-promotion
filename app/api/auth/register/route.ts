import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // Use SERVICE ROLE KEY to bypass "Signups disabled" restriction
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

  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Create User in Auth (Bypassing public signup restrictions)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (authError) {
      console.error('Admin Create User Error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      // 2. Create Profile record
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: fullName,
          role: 'Promoter',
          access_status: 'active',
          subscription_status: 'trial',
          is_super_admin: false,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Note: User is already created in Auth at this point
      }

      return NextResponse.json({ success: true, user: authData.user })
    }

    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })

  } catch (error: any) {
    console.error('Registration API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
