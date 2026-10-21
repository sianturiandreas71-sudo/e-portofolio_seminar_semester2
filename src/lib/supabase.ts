import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Reflection = {
  id: string;
  course: string;
  description: string;
  focus: string;
  pdf_url: string;
  what_i_learned: string;
  learning_experience: string;
  reflection: string;
  practical_connection: string;
  future_changes: string;
  image_url: string;
  summary_connection: string;
  summary_challenge: string;
  summary_concept: string;
  summary_change: string;
  artifact_analysis_summary: string;
  artifact_analysis_reason: string;
  artifact_analysis_meaning: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type KaitanPraktis = {
  id: string;
  main_concepts: string;
  future_changes: string;
  updated_at: string;
};

export type KaitanPraktisItem = {
  id: string;
  course: string;
  main_concepts: string;
  future_changes: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Artifact = {
  id: string;
  title: string;
  course: string;
  type: string;
  description: string;
  file_url: string;
  file_type: string;
  preview_url: string;
  video_url: string;
  artifact_reason: string;
  evidence_shown: string;
  artifact_meaning: string;
  learning_from_artifact: string;
  practical_connection: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Documentation = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  created_at: string;
};

export type RefleksiPengalaman = {
  id: string;
  education_view: string;
  professional_effort: string;
  rtl_1_title: string;
  rtl_1_action: string;
  rtl_1_goal: string;
  rtl_1_indicator: string;
  rtl_1_timeframe: string;
  rtl_2_title: string;
  rtl_2_action: string;
  rtl_2_goal: string;
  rtl_2_indicator: string;
  rtl_2_timeframe: string;
  rtl_3_title: string;
  rtl_3_action: string;
  rtl_3_goal: string;
  rtl_3_indicator: string;
  rtl_3_timeframe: string;
  updated_at: string;
};

export type DesainKarya = {
  id: string;
  intro: string;
  work_name: string;
  target_audience: string;
  challenge: string;
  solution_idea: string;
  research_result: string;
  prototype_desc: string;
  how_it_works: string;
  implementation_plan: string;
  link_url_1: string;
  link_label_1: string;
  link_url_2: string;
  link_label_2: string;
  link_url_3: string;
  link_label_3: string;
  eval_stages: string;
  novelty_indicator: string;
  creativity_indicator: string;
  usefulness_indicator: string;
  evidence_method: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  name: string;
  program: string;
  field: string;
  semester: string;
  year: string;
  photo_url: string;
  bio: string;
  vision_education: string;
  vision_as_teacher: string;
  facilitator_paragraph: string;
  education_principle: string;
  self_development: string;
  personal_reflection: string;
  short_bio: string;
  updated_at: string;
};
