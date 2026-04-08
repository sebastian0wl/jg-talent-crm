import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Feature flag: use Supabase or fall back to mock data
export const USE_SUPABASE = !!(supabaseUrl && supabaseAnonKey)

export const supabase = USE_SUPABASE
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null
