export type Belt = 'WHITE' | 'BLUE' | 'PURPLE' | 'BROWN' | 'BLACK'

export interface User {
  id: number
  email: string
  name: string
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
