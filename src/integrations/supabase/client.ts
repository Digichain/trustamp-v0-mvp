// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://odzjfelpvhkhqgvogscr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kempmZWxwdmhraHFndm9nc2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MjU4NzksImV4cCI6MjA0OTMwMTg3OX0.JdB75MwPp7X35q-ZWpDXrPiqYkFFvjj3aBraU3XQetA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);