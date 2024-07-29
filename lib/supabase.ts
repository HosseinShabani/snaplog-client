import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyueoijqocuspzupwhzt.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWVvaWpxb2N1c3B6dXB3aHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3NTU0OTksImV4cCI6MjAzNzMzMTQ5OX0.rWkeOMJay-N-mcHVh1ZNk766TpG3pST0VoAKnTQdw1I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
