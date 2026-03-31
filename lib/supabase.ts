import { createBrowserClient } from '@supabase/ssr'

let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
let supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

console.log('Supabase FINAL FIX Check:', {
  urlExists: !!supabaseUrl,
  urlStart: supabaseUrl.substring(0, 10),
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey.length
})

if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('Supabase credentials are missing or using placeholders. Dashboard login will fail.')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
