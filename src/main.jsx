import { createClient } from '@supabase/supabase-js'

// Estos valores los obtendrás de tu proyecto en supabase.com
// Los añadiremos en Vercel como variables de entorno (no en el código)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
