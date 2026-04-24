import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return new Response('No code provided from Google', { status: 400 })
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${requestUrl.origin}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      return new Response(`Credentials missing. ID: ${!!clientId}, Secret: ${!!clientSecret}`, { status: 500 })
    }

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (tokens.error) {
      return new Response(`Google Token Error: ${JSON.stringify(tokens)}`, { status: 500 })
    }

    // 2. Authenticate with Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return new Response(`User Auth Error: ${userError?.message || 'No user found'}. Check if NEXT_PUBLIC_SUPABASE_URL is set in Vercel.`, { status: 401 })
    }

    // 3. Save integration to database
    const integrationData: any = {
      user_id: user.id,
      provider: 'google',
      access_token: tokens.access_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (tokens.refresh_token) {
      integrationData.refresh_token = tokens.refresh_token
    }

    const { error: dbError } = await supabase
      .from('user_integrations')
      .upsert(integrationData, { onConflict: 'user_id,provider' })

    if (dbError) {
      return new Response(`Database Error: ${dbError.message}. Ensure user_integrations table exists.`, { status: 500 })
    }

    // Success! Redirect back to settings
    return NextResponse.redirect(new URL('/settings?success=google_connected', request.url))
  } catch (error: any) {
    return new Response(`Critical Callback Error: ${error.message}`, { status: 500 })
  }
}
