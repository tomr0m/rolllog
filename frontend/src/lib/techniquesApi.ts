import api from './api'
import type { Progression, Technique } from './types'

export async function getTechniques(): Promise<Technique[]> {
  const res = await api.get('/api/techniques')
  return res.data.techniques
}

export async function getTechnique(id: number): Promise<Technique> {
  const res = await api.get(`/api/techniques/${id}`)
  return res.data
}

export async function getProgression(): Promise<Progression> {
  const res = await api.get('/api/progression')
  return res.data
}
