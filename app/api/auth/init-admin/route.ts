import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
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

  const adminEmail = 'michaeltesfaye1621@gmail.com'
  const adminPassword = 'Password123!' // User should change this immediately

  try {
    // 1. Create User in Auth (Bypassing signup restrictions)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Master Admin' }
    })

    if (authError && authError.message !== 'User already exists') {
      throw authError
    }

    const userId = authData.user?.id || (await supabaseAdmin.from('profiles').select('id').eq('email', adminEmail).single()).data?.id

    if (!userId) throw new Error('Could not determine User ID')

    // 2. Ensure Profile exists and is Super Admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        full_name: 'Master Admin',
        role: 'Super Admin',
        is_super_admin: true,
        access_status: 'active',
        subscription_status: 'paid',
        updated_at: new Date().toISOString()
      })

    if (profileError) throw profileError

    return new NextResponse(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #0b0c0d; color: white; min-h: 100vh;">
        <h1 style="color: #4f46e5;">Admin Account Created!</h1>
        <p>You can now log in with:</p>
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; display: inline-block; text-align: left;">
          <p><strong>Email:</strong> ${adminEmail}</p>
          <p><strong>Password:</strong> ${adminPassword}</p>
        </div>
        <p style="margin-top: 20px;">
          <a href="/login" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Login</a>
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">Please change your password immediately after logging in.</p>
      </div>
    `, { headers: { 'Content-Type': 'text/html' } })

  } catch (error: any) {
    console.error('Admin Creation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
