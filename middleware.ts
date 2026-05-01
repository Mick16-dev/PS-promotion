import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (Note: This is per-edge-instance)
// For production, consider using @vercel/kv or Upstash for global consistency
const RATE_LIMIT_THRESHOLD = 30 // requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

const ipCache = new Map<string, { count: number; lastRequest: number }>()

export function middleware(request: NextRequest) {
  const ip = request.ip || '127.0.0.1'
  const now = Date.now()
  
  // Only rate limit auth-related and API routes
  if (
    request.nextUrl.pathname.startsWith('/api/auth') || 
    request.nextUrl.pathname.startsWith('/api/n8n') ||
    request.nextUrl.pathname.startsWith('/login')
  ) {
    const rateData = ipCache.get(ip) || { count: 0, lastRequest: now }
    
    if (now - rateData.lastRequest > RATE_LIMIT_WINDOW) {
      rateData.count = 1
      rateData.lastRequest = now
    } else {
      rateData.count += 1
    }
    
    ipCache.set(ip, rateData)
    
    if (rateData.count > RATE_LIMIT_THRESHOLD) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // Add security headers to every response
  const response = NextResponse.next()
  
  // Set security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (some API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
