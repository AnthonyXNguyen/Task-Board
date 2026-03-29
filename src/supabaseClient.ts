import { createClient } from '@supabase/supabase-js'
// Connection point to Supabase

// Get Supabase project URL from environment variables
// The '!' means we are confident that this value exists (non-null assertion)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!

// Get the public anon key from environment variables
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

// Create and export a single Supabase client instance
// Import when needed to interact with the database or auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey)