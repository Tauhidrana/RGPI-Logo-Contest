export type Role = "admin" | "judge";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  created_at?: string;
  email?: string;
}

export interface Department {
  id: string;
  name_bn: string;
  name_en: string;
  is_active: boolean;
  sort_order: number;
}

export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "winner"
  | "first_runner_up"
  | "second_runner_up"
  | "rejected";

export interface Score {
  id: string;
  submission_id: string;
  judge_id: string;
  creativity: number;
  theme: number;
  simplicity: number;
  color_typography: number;
  required_text: number;
  total: number;
  comment: string;
  is_final: boolean;
  updated_at: string;
  judge?: Profile | null;
}

export interface Submission {
  id: string;
  submission_code: string;
  full_name: string;
  department_id: string | null;
  semester: string;
  roll: string;
  session: string;
  phone: string;
  email: string;
  logo_title: string;
  concept: string;
  jpg_path: string;
  ai_path: string;
  status: SubmissionStatus;
  is_deleted: boolean;
  admin_note: string | null;
  created_at: string;
  ip_hash: string | null;
  department?: Department | null;
  scores?: Score[];
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  target: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface ScoringWeights {
  creativity: number;
  theme: number;
  simplicity: number;
  color_typography: number;
  required_text: number;
}

export interface ContestSettings {
  deadline: string; // ISO
  max_submissions_per_person: number;
  gallery_visible: boolean;
  results_published: boolean;
  contest_open: boolean;
  anonymous_judging: boolean;
  judging_locked: boolean;
  shortlist_count: number;
  rules_bn: string[];
  rules_en: string[];
  theme_bn: string;
  theme_en: string;
  concept_bn: string;
  concept_en: string;
  scoring_weights: ScoringWeights;
  winners: {
    winner: string | null;
    first_runner_up: string | null;
    second_runner_up: string | null;
  };
}

export interface TrackResult {
  submission_code: string;
  status: SubmissionStatus;
  full_name?: string;
  logo_title?: string;
  created_at: string;
  rank?: number | null;
}
