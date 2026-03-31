import { createBrowserClient } from '@supabase/ssr'

let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
let supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

// INTELLIGENT FIX: Supabase keys are JWTs that always start with 'eyJhbGci'
// We search for this pattern and take everything after it to bypass any injected junk.
const keyStart = supabaseAnonKey.indexOf('eyJhbGci')
if (keyStart !== -1) {
  supabaseAnonKey = supabaseAnonKey.substring(keyStart)
}

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
