import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const syncSchema = z.object({
  user_id: z.string().uuid(),
  spreadsheet_name: z.string().min(1),
  sheet_name: z.string().min(1),
}).passthrough()

export async function POST(request: Request) {
  // Create a service-role client to fetch integration tokens securely
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const webhookUrl = process.env.N8N_UNIVERSAL_SYNC_WEBHOOK
  
  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: 'Universal-sync webhook is not configured.' },
      { status: 500 },
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { user_id } = body
  const payload = body

  try {
    // 1. Fetch the promoter's Google Integration
    const { data: integration, error: intError } = await supabaseAdmin
      .from('user_integrations')
      .select('*')
      .eq('user_id', user_id)
      .eq('provider', 'google')
      .maybeSingle()
    
    if (!integration) {
      return NextResponse.json({ success: false, error: 'Google account not connected.' }, { status: 400 })
    }

    let accessToken = integration.access_token

    // 2. Token Refresh Logic
    // We attempt to refresh if we have a refresh_token. 
    // Google tokens typically expire in 1 hour.
    if (integration.refresh_token) {
      try {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: integration.refresh_token,
            grant_type: 'refresh_token',
          }),
        })

        const refreshData = await refreshResponse.json()
        
        if (refreshData.error) {
          console.error('GOOGLE_REFRESH_ERROR:', refreshData)
          // If the refresh token is invalid, we might need to re-authenticate
          if (refreshData.error === 'invalid_grant') {
            return NextResponse.json({ 
              success: false, 
              error: 'Google session expired. Please re-connect your Google account in Settings.',
              details: 'invalid_grant'
            }, { status: 401 })
          }
        }

        if (refreshData.access_token) {
          accessToken = refreshData.access_token
          // Update the database with the new token asynchronously to avoid blocking
          supabaseAdmin
            .from('user_integrations')
            .update({ 
              access_token: accessToken,
              updated_at: new Date().toISOString() 
            })
            .eq('id', integration.id)
            .then(({ error }) => {
              if (error) console.error('DB_TOKEN_UPDATE_ERROR:', error)
            })
        }
      } catch (err) {
        console.error('TOKEN_REFRESH_CRITICAL_FAILURE:', err)
      }
    }

    // 3. Trigger n8n with the FRESH token
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        access_token: accessToken // Send the fresh token to n8n
      }),
      cache: 'no-store',
    })

    const responseText = await res.text()
    let data = {}
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { message: responseText }
    }

    // If n8n returns a 401, it means the token we sent (even if just refreshed) was rejected
    if (res.status === 401 || (data as any).error?.code === 401) {
      return NextResponse.json({
        success: false,
        error: 'Google Authorization Failed',
        details: 'The access token was rejected by Google. Please try re-connecting your account in Settings.'
      }, { status: 401 })
    }

    return NextResponse.json(
      { success: res.ok, ...data },
      { status: res.ok ? 200 : res.status }
    )
  } catch (e: any) {
    console.error('API_SYNC_ERROR:', e)
    return NextResponse.json(
      { success: false, error: 'Sync process failed.', details: e?.message },
      { status: 502 },
    )
  }
}
