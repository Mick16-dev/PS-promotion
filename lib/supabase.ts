import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

console.log('Supabase Hook Check:', {
  urlPrefix: supabaseUrl.substring(0, 10),
  keyLength: supabaseAnonKey.length,
  isPlaceholder: supabaseUrl.includes('placeholder')
})

if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('Supabase credentials are missing or using placeholders. Dashboard login will fail.')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
