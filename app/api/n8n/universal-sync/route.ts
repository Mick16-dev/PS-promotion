import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_UNIVERSAL_SYNC_WEBHOOK
  
  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Universal-sync webhook is not configured.' },
      { status: 500 },
    )
  }

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const data = await res.json()

    // Pass the n8n result back to the frontend
    // The frontend expects { success: true, spreadsheet_url: "..." }
    return NextResponse.json(
      {
        success: res.ok,
        ...data
      },
      { status: res.ok ? 200 : 502 },
    )
  } catch (e: any) {
    console.error('N8N_SYNC_ERROR:', e)
    return NextResponse.json(
      { success: false, error: 'Failed to reach n8n.', details: e?.message ?? String(e) },
      { status: 502 },
    )
  }
}
