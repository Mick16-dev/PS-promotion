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

  // Validate but do NOT use the 'result.data' to avoid field stripping
  const result = syncSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: 'Security Validation Failed', details: result.error.format() },
      { status: 400 }
    )
  }

  const { user_id } = body

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

    // 2. Check if token needs refreshing
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
        if (refreshData.access_token) {
          accessToken = refreshData.access_token
          await supabaseAdmin
            .from('user_integrations')
            .update({ 
              access_token: accessToken,
              updated_at: new Date().toISOString() 
            })
            .eq('id', integration.id)
        }
      } catch (err) {
        console.error('TOKEN_REFRESH_FAILED:', err)
      }
    }

    // 3. Trigger n8n with the FRESH token
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        access_token: accessToken
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

    return NextResponse.json(
      { success: res.ok, ...data },
      { status: res.ok ? 200 : 502 }
    )
  } catch (e: any) {
    console.error('API_SYNC_ERROR:', e)
    return NextResponse.json(
      { success: false, error: 'Sync process failed.', details: e?.message },
      { status: 502 },
    )
  }
}
