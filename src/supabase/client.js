import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vgncfnovmtgjkptawtxy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbmNmbm92bXRnamtwdGF3dHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODU5NjMsImV4cCI6MjA3NTk2MTk2M30.4eUp7190prmi-zexMShMaORvbAP5JGDQR71za2SQVzA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;