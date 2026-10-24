import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kscjelcqqcpnunonygnk.supabase.co';
const supabaseAnonKey = 'sb_publishable_NaRc5bl6IoaSbgbM-2lqsw_LpwEVDYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
