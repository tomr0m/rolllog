import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import TagInput from '../components/TagInput'
import TechniqueTagInput, { type SelectedTechnique } from '../components/TechniqueTagInput'
import SessionRewardModal from '../components/SessionRewardModal'
import { createSession } from '../lib/sessionsApi'
import { getTechniques } from '../lib/techniquesApi'
import type { Discipline, SessionRewards, Technique } from '../lib/types'

const PAPER = '#EBE6DA'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} MINUTES`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} HOUR${h > 1 ? 'S' : ''} ${m} MIN` : `${h} HOUR${h > 1 ? 'S' : ''}`
}

export default function LogSession() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [catalog, setCatalog] = useState<Technique[]>([])
  const [rewardModalVisible, setRewardModalVisible] = useState(false)
  const [rewards, setRewards] = useState<SessionRewards | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    date: today,
    discipline: (user?.practices_gi ? 'GI' : 'NO_GI') as Discipline,
    duration_minutes: 90,
    techniques: [] as SelectedTechnique[],
    partners: [] as string[],
    notes: '',
  })

  const [dateFocused, setDateFocused] = useState(false)
  const [durationFocused, setDurationFocused] = useState(false)
  const [notesFocused, setNotesFocused] = useState(false)

  const canSubmit = form.duration_minutes >= 5 && form.duration_minutes <= 600

  useEffect(() => {
    getTechniques().then(setCatalog).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError('')
    setSubmitting(true)
    try {
      const result = await createSession({
        date: form.date,
        discipline: form.discipline,
        duration_minutes: form.duration_minutes,
        techniques: form.techniques.map(t => t.raw),
        partners: form.partners,
        notes: form.notes.trim() || undefined,
      })
      setRewards(result.rewards)
      setRewardModalVisible(true)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setRewardModalVisible(false)
    navigate('/log', { replace: true })
  }

  const showGi = user?.practices_gi
  const showNoGi = user?.practices_no_gi

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <SessionRewardModal visible={rewardModalVisible} rewards={rewards} onClose={handleModalClose} />

      <div style={{ flex: 1, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)', maxWidth: '640px', margin: '0 auto', width: '100%' }}>

        {/* Page header */}
        <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.4rem' }}>
            JOURNAL ENTRY
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 0.95, color: INK, marginBottom: '0.5rem' }}
          >
            A New Entry.
          </motion.h1>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.9rem', color: MUTED }}>
            Tell us about today's roll.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>

          {/* DATE */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.4rem' }}>DATE</div>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              max={today}
              onFocus={() => setDateFocused(true)}
              onBlur={() => setDateFocused(false)}
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${dateFocused ? OXBLOOD : INK}`,
                color: INK,
                outline: 'none',
                padding: '4px 0 6px',
                width: '100%',
                colorScheme: 'light',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* DISCIPLINE */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.75rem' }}>DISCIPLINE</div>
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              {showGi && (
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, discipline: 'GI' }))}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: SERIF, fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    color: form.discipline === 'GI' ? OXBLOOD : `${MUTED}70`,
                    transition: 'color 0.15s',
                  }}
                >
                  Gi
                  {form.discipline === 'GI' && (
                    <span style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.15em', color: OXBLOOD, border: `1px solid ${OXBLOOD}`, padding: '1px 5px' }}>
                      ✓
                    </span>
                  )}
                </button>
              )}
              {showNoGi && (
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, discipline: 'NO_GI' }))}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontFamily: SERIF, fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    color: form.discipline === 'NO_GI' ? OXBLOOD : `${MUTED}70`,
                    transition: 'color 0.15s',
                  }}
                >
                  No-Gi
                  {form.discipline === 'NO_GI' && (
                    <span style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.15em', color: OXBLOOD, border: `1px solid ${OXBLOOD}`, padding: '1px 5px' }}>
                      ✓
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* DURATION */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.4rem' }}>TIME ON THE MAT</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <input
                type="number"
                value={form.duration_minutes}
                onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 0 }))}
                min={5}
                max={600}
                onFocus={() => setDurationFocused(true)}
                onBlur={() => setDurationFocused(false)}
                style={{
                  fontFamily: SERIF, fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  background: 'transparent', border: 'none',
                  borderBottom: `2px solid ${durationFocused ? OXBLOOD : INK}`,
                  color: INK, outline: 'none', padding: '4px 0 6px',
                  width: '7rem', transition: 'border-color 0.2s', colorScheme: 'light',
                }}
              />
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.85rem', color: MUTED }}>minutes</span>
            </div>
            {form.duration_minutes >= 60 && (
              <p style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.2em', color: OXBLOOD, marginTop: '0.3rem' }}>
                = {formatDuration(form.duration_minutes)}
              </p>
            )}
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.72rem', color: MUTED, marginTop: '0.2rem' }}>
              Most sessions are 60–90 minutes.
            </p>
          </div>

          {/* TECHNIQUES — hybrid autocomplete + custom */}
          <TechniqueTagInput
            catalog={catalog}
            value={form.techniques}
            onChange={techniques => setForm(f => ({ ...f, techniques }))}
            maxTags={30}
          />

          {/* PARTNERS */}
          <TagInput
            label="ROLLING PARTNERS"
            value={form.partners}
            onChange={tags => setForm(f => ({ ...f, partners: tags }))}
            placeholder="David, Yossi…"
            helper="Who did you roll with today?"
            maxTags={20}
          />

          {/* NOTES */}
          <div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline', marginBottom: '0.4rem' }}>
              <span style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED }}>NOTES</span>
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.62rem', color: `${MUTED}88` }}>(optional)</span>
            </div>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              onFocus={() => setNotesFocused(true)}
              onBlur={() => setNotesFocused(false)}
              rows={4}
              placeholder="How did it feel? Anything to remember?"
              style={{
                width: '100%', boxSizing: 'border-box',
                fontFamily: SERIF, fontSize: '0.95rem',
                background: 'transparent', border: 'none',
                borderBottom: `2px solid ${notesFocused ? OXBLOOD : INK}`,
                color: INK, outline: 'none',
                padding: '4px 0 6px', resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
              className="placeholder:text-[#737373]/50"
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.7rem', color: OXBLOOD, fontFamily: SERIF, fontStyle: 'italic', borderLeft: `2px solid ${OXBLOOD}`, paddingLeft: '0.75rem' }}>
              {error}
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <motion.button
              type="button"
              onClick={() => navigate('/log')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{
                fontFamily: DISPLAY, fontSize: '0.72rem', letterSpacing: '0.15em',
                color: MUTED, background: 'transparent', border: `1px solid ${BORDER}`,
                padding: '0.7rem 1.25rem', cursor: 'pointer',
              }}
            >
              DISCARD
            </motion.button>
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              whileHover={!canSubmit || submitting ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, fontFamily: DISPLAY, fontSize: '0.8rem', letterSpacing: '0.2em',
                color: '#fff', background: !canSubmit ? BORDER : OXBLOOD,
                border: 'none', padding: '0.75rem 1.5rem',
                cursor: !canSubmit || submitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'background 0.15s',
              }}
            >
              {submitting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              SAVE ENTRY →
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  )
}
