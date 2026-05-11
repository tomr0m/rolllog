import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from '../components/NavBar'
import { getSessions } from '../lib/sessionsApi'
import type { Discipline, TrainingSession } from '../lib/types'

const PAPER = '#EBE6DA'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const LIMIT = 50

type Filter = 'ALL' | Discipline

function SessionRow({ session }: { session: TrainingSession }) {
  const [expanded, setExpanded] = useState(false)
  const d = new Date(session.date + 'T00:00:00')
  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        borderTop: `1px solid ${BORDER}`,
        padding: 'clamp(0.9rem, 2vw, 1.4rem) 0',
        display: 'flex',
        gap: 'clamp(1rem, 3vw, 1.75rem)',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
      className="hover:bg-[#E3DDD1] -mx-2 px-2"
    >
      {/* Date column */}
      <div style={{ flexShrink: 0, width: '3rem', textAlign: 'right' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)', lineHeight: 1, color: INK }}>{day}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.1em', color: MUTED }}>{month}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.08em', color: `${MUTED}80` }}>{year}</div>
      </div>

      {/* Hairline */}
      <div style={{ width: '1px', background: BORDER, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.2em', color: OXBLOOD }}>
            {session.discipline === 'GI' ? 'GI SESSION' : 'NO-GI SESSION'}
          </span>
          <span style={{ fontFamily: DISPLAY, fontSize: '0.95rem', letterSpacing: '0.08em', color: INK }}>
            {session.duration_minutes} MIN
          </span>
        </div>

        {session.techniques.length > 0 && (
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.83rem', color: INK, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {session.techniques.join(' · ')}
          </p>
        )}

        {session.partners.length > 0 && (
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.76rem', color: MUTED, marginBottom: '0.2rem' }}>
            Rolled with — {session.partners.join(', ')}
          </p>
        )}

        {session.notes && !expanded && (
          <p style={{ fontFamily: SERIF, fontSize: '0.76rem', color: `${MUTED}cc`, marginTop: '0.2rem' }}>
            {session.notes.length > 100 ? session.notes.slice(0, 100) + '…' : session.notes}
          </p>
        )}

        <AnimatePresence>
          {expanded && session.notes && (
            <motion.p
              key="notes"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ fontFamily: SERIF, fontSize: '0.83rem', color: MUTED, marginTop: '0.4rem', overflow: 'hidden' }}
            >
              {session.notes}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function TrainingLog() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [offset, setOffset] = useState(0)

  const fetchSessions = useCallback(async (disc: Filter, off: number, replace: boolean) => {
    replace ? setLoading(true) : setLoadingMore(true)
    try {
      const res = await getSessions({
        discipline: disc === 'ALL' ? undefined : disc,
        limit: LIMIT,
        offset: off,
      })
      setSessions(prev => replace ? res.sessions : [...prev, ...res.sessions])
      setTotal(res.total)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    setOffset(0)
    fetchSessions(filter, 0, true)
  }, [filter, fetchSessions])

  const loadMore = () => {
    const next = offset + LIMIT
    setOffset(next)
    fetchSessions(filter, next, false)
  }

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>
      <NavBar />

      <div style={{ flex: 1, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)', maxWidth: '780px', margin: '0 auto', width: '100%' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.3rem' }}>THE ARCHIVE</div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 0.95, color: INK, marginBottom: '0.4rem' }}
            >
              Your Training Log.
            </motion.h1>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.88rem', color: MUTED }}>
              Every roll, every lesson.
            </p>
          </div>

          {/* Filter toggles */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {(['ALL', 'GI', 'NO_GI'] as Filter[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.2em',
                  color: filter === f ? OXBLOOD : MUTED,
                  borderBottom: filter === f ? `1px solid ${OXBLOOD}` : '1px solid transparent',
                  padding: '2px 0', transition: 'all 0.15s',
                }}
              >
                {f === 'NO_GI' ? 'NO-GI' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="w-5 h-5 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.1rem', color: MUTED, marginBottom: '1rem' }}>
              No entries yet.
            </p>
            <Link
              to="/log/new"
              style={{ fontFamily: DISPLAY, fontSize: '0.68rem', letterSpacing: '0.2em', color: OXBLOOD, textDecoration: 'none', borderBottom: `1px solid ${OXBLOOD}`, paddingBottom: '1px' }}
            >
              Log your first roll →
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ borderBottom: `1px solid ${BORDER}` }}>
              {sessions.map(s => <SessionRow key={s.id} session={s} />)}
            </div>

            {sessions.length < total && (
              <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: DISPLAY, fontSize: '0.68rem', letterSpacing: '0.2em',
                    color: OXBLOOD, borderBottom: `1px solid ${OXBLOOD}`,
                    paddingBottom: '1px', opacity: loadingMore ? 0.5 : 1,
                  }}
                >
                  {loadingMore ? 'LOADING…' : 'LOAD MORE'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
