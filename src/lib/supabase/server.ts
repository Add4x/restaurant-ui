import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/supabase'

export function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Using anon key for public operations
  )
} 