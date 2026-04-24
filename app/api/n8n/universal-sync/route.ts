import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_UNIVERSAL_SYNC_WEBHOOK
  
  if (!webhookUrl) {
    console.error('N8N_CONFIG_ERROR: N8N_UNIVERSAL_SYNC_WEBHOOK is not set in environment variables.')
    return NextResponse.json(
      { success: false, error: 'Universal-sync webhook is not configured on Vercel.' },
      { status: 500 },
    )
  }

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body sent to API.' }, { status: 400 })
  }

  try {
    console.log('TRIGGERING_N8N_WEBHOOK:', webhookUrl)
    
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const contentType = res.headers.get('content-type')
    let result: any

    if (contentType && contentType.includes('application/json')) {
      result = await res.json()
    } else {
      const rawText = await res.text()
      console.warn('N8N_NON_JSON_RESPONSE:', rawText)
      result = { rawResponse: rawText }
    }

    if (!res.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `n8n returned status ${res.status}`, 
          details: result 
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    )
  } catch (e: any) {
    console.error('N8N_FETCH_CRASH:', e)
    return NextResponse.json(
      { 
        success: false, 
        error: 'The app could not reach your n8n server.', 
        details: e?.message ?? String(e) 
      },
      { status: 502 },
    )
  }
}
