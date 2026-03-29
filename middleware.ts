import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  
  // We use Supabase JS directly here if auth-helpers are not available/preferred
  // But usually, we'd use the dedicated middleware helper if installed.
  // Since only supabase-js is in package.json, we'll suggest using a simpler layout-level check or installing helpers.
  
  // For now, let's create a placeholder middleware that can be easily updated.
  const response = NextResponse.next()

  // This is where you would usually check the session token from cookies
  // const { data: { session } } = await supabase.auth.getSession()
  
  // Logic: if path is NOT /login and no session exists -> redirect to /login
  // Since we don't have the auth-helpers installed yet (only supabase-js),
  // most people do this check in a Root Layout or a high-level component.
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (auth routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|auth).*)',
  ],
}
