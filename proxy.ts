import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  console.log('Proxy handling:', request.nextUrl.pathname)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  let supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

  // FORCE FIX: If your key is unusually long, we truncate it to standard length.
  if (supabaseAnonKey.length > 200) {
    supabaseAnonKey = supabaseAnonKey.substring(0, 193)
  }

  // 1. Create a Supabase client for the middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 2. Refresh the session if it exists (very important for JWT/Cookie sync)
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error('Middleware Auth Error:', error)
  }

  // 3. Auth Guard Logic
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  
  if (!user && !isLoginPage) {
    // Not logged in and not on login page -> Redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isLoginPage) {
    // Already logged in and on login page -> Redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.png, etc (favicon files)
     * - public (public static files like images)
     * - all common image/font extensions
     */
    '/((?!api|_next/static|_next/image|favicon|robots|sitemap|.*\\..*|public).*)',
  ],
}
