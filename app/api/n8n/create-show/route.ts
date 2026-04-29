import { NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const showSchema = z.object({
  show_id: z.string().uuid(),
  user_id: z.string().uuid(),
  show_name: z.string().min(1),
  artist_name: z.string().min(1),
  artist_email: z.string().email(),
  spreadsheet_name: z.string().optional(),
  headers: z.array(z.string()).optional(),
  mapping: z.any().optional()
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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const result = showSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation Error', details: result.error.format() },
      { status: 400 }
    )
  }

  const payload = result.data

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Avoid caching webhook responses in edge/server environments.
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

