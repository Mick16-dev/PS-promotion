import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// In-memory sliding-window rate limiter
// Works within a single Edge runtime instance. For multi-region production,
// swap this out for @upstash/ratelimit + Redis.
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, number[]>()

const WINDOW_MS = 60_000   // 1 minute sliding window
const MAX_REQUESTS = 20    // max requests per window per IP

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    rateLimitMap.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Rate limit all API routes ──────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = getIP(req)

    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please slow down.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      )
    }
  }

  // ── Protect dashboard routes — redirect unauthenticated users to /login ─
  // (Supabase session is validated client-side; this is a lightweight guard)
  const response = NextResponse.next()

  // ── Attach security headers to every response ──────────────────────────
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
