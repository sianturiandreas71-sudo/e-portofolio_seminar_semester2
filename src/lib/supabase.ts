import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djmwagwjlyqxrbglhewr.supabase.co';
const supabaseAnonKey = 'sb_publishable__2w9LXjNFCvqvMskQFp-5w_gUM83p4R';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
