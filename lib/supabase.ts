import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types/supabase'

/**
 * Server-side Supabase client using the service role key.
 * Use only in API routes and server components/actions.
 * Never expose the service role key to the client.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  })
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
