import api from './api'
import type {
  Discipline,
  SessionCreateResponse,
  SessionStats,
  SessionsResponse,
  TrainingSession,
} from './types'

interface CreateSessionPayload {
  date: string
  discipline: Discipline
  duration_minutes: number
  techniques: string[]
  partners: string[]
  notes?: string
}

export async function createSession(payload: CreateSessionPayload): Promise<SessionCreateResponse> {
  const res = await api.post('/api/sessions', payload)
  return res.data
}

export async function getSessions(params?: {
  discipline?: Discipline
  limit?: number
  offset?: number
}): Promise<SessionsResponse> {
  const res = await api.get('/api/sessions', { params })
  return res.data
}

export async function getSessionStats(): Promise<SessionStats> {
  const res = await api.get('/api/sessions/stats')
  return res.data
}

export async function getRecentSessions(limit = 3): Promise<TrainingSession[]> {
  const res = await api.get('/api/sessions', { params: { limit } })
  return res.data.sessions
}
