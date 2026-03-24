import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SurveyResponse {
  id?: string;
  created_at?: string;
  year_in_college: string;
  major: string;
  stress_frequency: string;
  stress_sources: string[];
  stress_sources_other?: string | null;
  coping_methods: string[];
  coping_other?: string | null;
  mental_health_rating: number;
  school_support: string;
}
