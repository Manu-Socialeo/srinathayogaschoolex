import { createBrowserClient as createSsrBrowserClient } from '@supabase/ssr'
import type { Database } from './supabase-types'

let _supabase: ReturnType<typeof createSsrBrowserClient> | null = null

export function createBrowserClient() {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    _supabase = createSsrBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}
