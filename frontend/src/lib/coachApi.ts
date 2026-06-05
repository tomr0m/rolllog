import api from './api'
import type { CoachInsights, CoachStatus } from './types'

export async function getCoachInsights(refresh = false): Promise<CoachInsights> {
  const res = await api.get('/api/coach/insights', {
    params: refresh ? { refresh: true } : undefined,
  })
  return res.data
}

export async function getCoachStatus(): Promise<CoachStatus> {
  const res = await api.get('/api/coach/status')
  return res.data
}
