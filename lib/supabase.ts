import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep this intentionally terse to avoid accidentally leaking anything into client logs.
  console.warn('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Avoid throwing during Next.js build/prerender; fail only if code actually tries to use Supabase.
    return new Proxy(
      {},
      {
        get() {
          throw new Error(
            'Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
          )
        },
      },
    ) as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
})()
