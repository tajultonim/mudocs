import { createClient } from '@supabase/supabase-js'
import { Database } from './database'
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

console.log(process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!)

export default supabase;