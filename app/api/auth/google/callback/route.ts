import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/settings', request.url))
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${requestUrl.origin}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      console.error('Google credentials missing in environment')
      return NextResponse.redirect(new URL('/settings?error=missing_credentials', request.url))
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
      console.error('Google Token Exchange Error:', tokens)
      return NextResponse.redirect(new URL('/settings?error=google_token_error', request.url))
    }

    // 2. Authenticate with Supabase
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not found in callback')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Save integration to database
    // Note: Google only sends the refresh_token on the FIRST authorization (prompt=consent)
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

    const { error } = await supabase
      .from('user_integrations')
      .upsert(integrationData, { onConflict: 'user_id,provider' })

    if (error) {
      console.error('Supabase Upsert Error:', error)
      return NextResponse.redirect(new URL('/settings?error=database_error', request.url))
    }

    // Success! Redirect back to settings
    return NextResponse.redirect(new URL('/settings?success=google_connected', request.url))
  } catch (error: any) {
    console.error('OAuth Callback Critical Error:', error)
    return NextResponse.redirect(new URL('/settings?error=callback_error', request.url))
  }
}
