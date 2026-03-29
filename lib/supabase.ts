import { createClient } from '@supabase/supabase-js'

// Next.js build environment may not have these variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables are missing. Using placeholder values for build.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
