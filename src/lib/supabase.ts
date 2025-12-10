import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your .env.local file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Database types
export interface DbSermon {
  id: string;
  title: string;
  date_preached: string;
  pastor_name: string;
  scripture_references: { book: string; chapter: number; verses: string }[];
  video_url: string | null;
  summary: string | null;
  key_topics: string[];
  main_verses: { book: string; chapter: number; verses: string; text?: string }[];
  key_takeaways: string[];
  thumbnail_url: string | null;
  series_id: string | null;
  series_name: string | null;
  view_count: number;
  duration: string | null;
  status: string;
  created_at: string;
}
