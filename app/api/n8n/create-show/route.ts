import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const showSchema = z.object({
  show_id: z.string().uuid(),
  user_id: z.string().uuid(),
  show_name: z.string().min(1),
}).passthrough()

export async function POST(request: Request) {
  const webhookUrl =
    process.env.N8N_CREATE_SHOW_WEBHOOK ??
    process.env.NEXT_PUBLIC_N8N_CREATE_SHOW_WEBHOOK ??
    ''

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Create-show webhook is not configured.' },
      { status: 500 },
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  // Passive security check
  const result = showSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Security Validation Error', details: result.error.format() },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const text = await res.text()

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        body: text,
      },
      { status: res.ok ? 200 : 502 },
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to reach n8n.', details: e?.message ?? String(e) },
      { status: 502 },
    )
  }
}
