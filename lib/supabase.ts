import { createBrowserClient as createSsrBrowserClient } from '@supabase/ssr'
import type { Database } from './supabase-types'

let _supabase: ReturnType<typeof createSsrBrowserClient> | null = null

const DEFAULT_SUPABASE_URL = 'https://drsavgkcmfsoooeymxtk.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyc2F2Z2tjbWZzb29vZXlteHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzUzODcsImV4cCI6MjEwNDUxMTM4N30._KagSEmqM28xJ_GGpaYvylzAYS4npsIQ1ygHO02MIxA'

export function createBrowserClient() {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

    try {
      _supabase = createSsrBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    } catch (err) {
      console.error('[Supabase] Failed to initialize browser client:', err)
      _supabase = createSsrBrowserClient<Database>(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY)
    }
  }
  return _supabase
}
