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
  xp: number
  stripes_earned_in_app: number
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
  technique_ids: number[]
  partners: string[]
  notes: string | null
  created_at: string
}

export type TechniqueCategory =
  | 'FUNDAMENTAL'
  | 'GUARD'
  | 'PASS'
  | 'SWEEP'
  | 'SUBMISSION'
  | 'ESCAPE'
  | 'TAKEDOWN'
  | 'TRANSITION'

export type TechniqueDiscipline = 'BOTH' | 'GI_ONLY' | 'NO_GI_ONLY'

export type TechniqueStatus = 'LOCKED' | 'UNLOCKED' | 'ATTEMPTED' | 'MASTERED'

export interface Technique {
  id: number
  slug: string
  name: string
  category: TechniqueCategory
  discipline: TechniqueDiscipline
  belt_required: Belt
  stripes_required: number
  description: string | null
  aliases: string[]
  prerequisite_technique_ids: number[]
  sort_order: number
  user_status: TechniqueStatus
  times_practiced: number
  last_practiced_at?: string | null
  first_practiced_at?: string | null
  mastered_at?: string | null
}

export interface MissingPrereq {
  id: number
  name: string
  times_practiced: number
  times_needed: number
}

export interface NextUnlock {
  id: number
  name: string
  missing_prereqs: MissingPrereq[]
}

export interface NextToMaster {
  id: number
  name: string
  times_practiced: number
  times_needed: number
}

export interface Progression {
  xp: number
  next_stripe_xp: number
  progress_to_next_stripe: number
  suggested_belt: Belt
  suggested_stripes: number
  gi_belt: Belt | null
  gi_stripes: number
  no_gi_belt: Belt | null
  no_gi_stripes: number
  total_techniques: number
  locked: number
  unlocked: number
  attempted: number
  mastered: number
  next_unlocks: NextUnlock[]
  next_to_master: NextToMaster[]
}

export interface SessionRewards {
  xp_gained: number
  techniques_mastered: string[]
  techniques_unlocked: string[]
  techniques_attempted_early: string[]
  new_stripe_earned: boolean
  new_stripe_count: number | null
}

export interface SessionCreateResponse {
  session: TrainingSession
  rewards: SessionRewards
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
