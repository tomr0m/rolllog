export type Belt = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK'
export type Discipline = 'GI' | 'NO_GI'

export interface User {
  id: number
  email: string | null
  name: string
  is_quick_start: boolean
  practices_gi: boolean
  gi_belt: Belt | null
  gi_stripes: number
  practices_no_gi: boolean
  no_gi_belt: Belt | null
  no_gi_stripes: number
  start_date: string | null
  onboarding_done: boolean
  created_at: string
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
}

export interface TrainingSession {
  id: number
  user_id: number
  date: string
  discipline: Discipline
  duration_minutes: number
  techniques: string[]
  partners: string[]
  notes: string | null
  created_at: string
}

export interface SessionStats {
  total_sessions: number
  total_hours: number
  sessions_this_month: number
  hours_this_month: number
  current_streak_days: number
  gi_sessions: number
  no_gi_sessions: number
  top_partners: string[]
  top_techniques: string[]
}

export interface SessionsResponse {
  sessions: TrainingSession[]
  total: number
}
