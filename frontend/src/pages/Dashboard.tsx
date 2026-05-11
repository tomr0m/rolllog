import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import { getRecentSessions, getSessionStats } from '../lib/sessionsApi'
import type { Belt, SessionStats, TrainingSession } from '../lib/types'

const PAPER = '#EBE6DA'
const CARD = '#FAF6EF'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const BELT_COLORS: Record<Belt, { bg: string; text: string }> = {
  WHITE:  { bg: '#EFEFEF', text: '#1A1A1A' },
  BLUE:   { bg: '#1E40AF', text: '#fff' },
  PURPLE: { bg: '#7C3AED', text: '#fff' },
  BROWN:  { bg: '#78350F', text: '#fff' },
  BLACK:  { bg: '#1A1A1A', text: '#fff' },
}

const QUOTES = [
  { text: 'If size mattered, the elephant would be king of the jungle.', author: 'HÉLIO GRACIE' },
  { text: 'Flow with the go.', author: 'RICKSON GRACIE' },
  { text: 'Simple is beautiful.', author: 'ROGER GRACIE' },
  { text: 'Position before submission.', author: 'JOHN DANAHER' },
  { text: 'Train hard. Train smart.', author: 'MARCELO GARCIA' },
  { text: 'I am the GOAT.', author: 'GORDON RYAN' },
]

const COMING_SOON = [
  { num: '01', title: 'Training Log', live: true },
  { num: '02', title: 'Technique Tree', live: false },
  { num: '03', title: 'Progress Stats', live: false },
  { num: '04', title: 'AI Coach', live: false },
]

function formatDate() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function monthsOnMat(startDate: string | null): string | null {
  if (!startDate) return null
  const start = new Date(startDate)
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (months < 1) return 'LESS THAN A MONTH'
  if (months < 12) return `${months} MONTH${months !== 1 ? 'S' : ''}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}Y ${rem}M` : `${years} YEAR${years !== 1 ? 'S' : ''}`
}

function BeltDisplay({ belt, stripes, label }: { belt: Belt; stripes: number; label: string }) {
  const { bg, text } = BELT_COLORS[belt]
  const isWhite = belt === 'WHITE'
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${OXBLOOD}` }}>
      <div style={{ padding: '0.4rem 0.75rem 0.25rem', borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.56rem', letterSpacing: '0.25em', color: MUTED }}>{label} BELT</span>
      </div>
      <div style={{ margin: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.6rem', height: '2.5rem', backgroundColor: bg }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.78rem', letterSpacing: '0.1em', color: text }}>{belt} BELT</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: '7px', height: '20px', backgroundColor: i < stripes ? (isWhite ? '#555' : '#f5f5f5') : 'transparent', border: `1.5px solid ${isWhite ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.35)'}` }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '0.25rem 0.75rem 0.4rem' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.15em', color: MUTED }}>{stripes} STRIPE{stripes !== 1 ? 'S' : ''}</span>
      </div>
    </div>
  )
}

function StatBlock({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ flex: '1 1 0', padding: 'clamp(1rem, 2vw, 1.5rem)', textAlign: 'center', borderRight: `1px solid ${BORDER}` }} className="last:border-r-0">
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, color: INK, marginBottom: '0.35rem' }}>
        {value}
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.2em', color: MUTED }}>
        {label}
      </div>
    </div>
  )
}

function RecentSessionRow({ session }: { session: TrainingSession }) {
  const d = new Date(session.date + 'T00:00:00')
  return (
    <Link
      to="/log"
      style={{ textDecoration: 'none', display: 'block', borderTop: `1px solid ${BORDER}`, padding: '0.75rem 0' }}
      className="hover:bg-[#E3DDD1] -mx-1 px-1 transition-colors"
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.2rem' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.56rem', letterSpacing: '0.2em', color: OXBLOOD }}>
          {session.discipline === 'GI' ? 'GI' : 'NO-GI'}
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.78rem', letterSpacing: '0.1em', color: INK }}>
          {String(d.getDate()).padStart(2, '0')} {MONTHS[d.getMonth()]} {d.getFullYear()}
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.08em', color: MUTED }}>
          {session.duration_minutes} MIN
        </span>
      </div>
      {session.techniques.length > 0 && (
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.78rem', color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session.techniques.join(' · ')}
        </p>
      )}
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

  const [stats, setStats] = useState<SessionStats | null>(null)
  const [recent, setRecent] = useState<TrainingSession[]>([])

  useEffect(() => {
    getSessionStats().then(setStats).catch(() => {})
    getRecentSessions(3).then(setRecent).catch(() => {})
  }, [])

  if (!user) return null
  const timeOnMat = monthsOnMat(user.start_date)
  const firstName = user.name.split(' ')[0]

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>
      <NavBar />

      <div style={{ flex: 1, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.4rem' }}>ISSUE 01 — YOUR JOURNEY</div>
          <div style={{ height: '1px', width: '3rem', background: OXBLOOD, marginBottom: '0.75rem' }} />
          <h1 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 0.9, color: INK, marginBottom: '0.75rem' }}>
            {['Welcome', 'back,', `${firstName}.`].map((word, i) => (
              <motion.span
                key={word + i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: i === 2 ? 'block' : 'inline', color: i === 2 ? OXBLOOD : INK, marginRight: i < 2 ? '0.2em' : 0 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.95rem', color: MUTED }}>
            Your training journal awaits.
          </p>
        </motion.div>

        {/* LOG CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          <Link
            to="/log/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: DISPLAY, fontSize: '0.82rem', letterSpacing: '0.2em',
              color: '#fff', background: OXBLOOD,
              padding: '0.75rem 1.75rem', textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            className="hover:opacity-90"
          >
            LOG TODAY'S SESSION →
          </Link>
        </motion.div>

        {/* STATS */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.5rem' }}>BY THE NUMBERS</div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, display: 'flex', flexWrap: 'wrap' }}>
              <StatBlock value={stats.sessions_this_month} label="SESSIONS THIS MONTH" />
              <StatBlock value={stats.hours_this_month} label="HOURS THIS MONTH" />
              <StatBlock value={stats.total_sessions} label="TOTAL SESSIONS" />
              <StatBlock value={stats.current_streak_days > 0 ? stats.current_streak_days : '—'} label="DAY STREAK" />
            </div>
          </motion.div>
        )}

        {/* PROFILE + QUOTE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `3px solid ${OXBLOOD}`, marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Left */}
            <div style={{ flex: '1 1 280px', padding: 'clamp(1.25rem, 3vw, 2rem)', borderRight: `1px solid ${BORDER}` }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.35rem' }}>THE FIGHTER</div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: INK, marginBottom: '1.25rem', lineHeight: 1 }}>
                {user.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: timeOnMat ? '1.25rem' : 0 }}>
                {user.practices_gi && user.gi_belt && <BeltDisplay belt={user.gi_belt} stripes={user.gi_stripes} label="GI" />}
                {user.practices_no_gi && user.no_gi_belt && <BeltDisplay belt={user.no_gi_belt} stripes={user.no_gi_stripes} label="NO-GI" />}
              </div>
              {timeOnMat && (
                <div>
                  <div style={{ height: '1px', background: BORDER, marginBottom: '0.75rem' }} />
                  <div style={{ fontFamily: DISPLAY, fontSize: '0.56rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.15rem' }}>TIME ON MAT</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.1em', color: OXBLOOD }}>{timeOnMat}</div>
                </div>
              )}
            </div>

            {/* Right — quote */}
            <div style={{ flex: '1 1 240px', padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '0.56rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.75rem' }}>QUOTE OF THE DAY</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: '3px', flexShrink: 0, background: OXBLOOD, borderRadius: '1px', alignSelf: 'stretch' }} />
                <div>
                  <blockquote style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(0.88rem, 1.6vw, 1.1rem)', lineHeight: 1.4, color: INK, marginBottom: '0.6rem' }}>
                    "{quote.text}"
                  </blockquote>
                  <div style={{ fontFamily: DISPLAY, fontSize: '0.7rem', letterSpacing: '0.15em', color: MUTED }}>— {quote.author}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RECENT SESSIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.5rem' }}>RECENT ENTRIES</div>
          <div style={{ height: '1px', background: BORDER, marginBottom: 0 }} />
          {recent.length === 0 ? (
            <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
              <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.9rem', color: MUTED }}>No sessions yet.</p>
            </div>
          ) : (
            <div style={{ borderBottom: `1px solid ${BORDER}` }}>
              {recent.map(s => <RecentSessionRow key={s.id} session={s} />)}
            </div>
          )}
          <div style={{ paddingTop: '0.75rem' }}>
            <Link
              to="/log"
              style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.2em', color: OXBLOOD, textDecoration: 'none', borderBottom: `1px solid ${OXBLOOD}`, paddingBottom: '1px' }}
            >
              VIEW FULL ARCHIVE →
            </Link>
          </div>
        </motion.div>

        {/* COMING SOON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.5rem' }}>COMING IN ISSUE 02</div>
          <div style={{ height: '1px', background: BORDER, marginBottom: '1rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
            {COMING_SOON.map(item => (
              <div
                key={item.num}
                style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  padding: '1.25rem 1rem', position: 'relative',
                  opacity: item.live ? 1 : 0.6,
                }}
                className={item.live ? '' : 'hover:opacity-80 transition-opacity'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.1em', color: OXBLOOD }}>{item.num}</span>
                  {item.live && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: '0.9rem', color: INK }}>{item.title}</div>
                {!item.live && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontFamily: DISPLAY, fontSize: '0.45rem', letterSpacing: '0.15em', color: OXBLOOD, border: `1px solid ${OXBLOOD}`, padding: '1px 4px', opacity: 0.7 }}>
                    SOON
                  </div>
                )}
                {item.live && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontFamily: DISPLAY, fontSize: '0.45rem', letterSpacing: '0.15em', color: '#22c55e', border: '1px solid #22c55e', padding: '1px 4px' }}>
                    LIVE
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${BORDER}`, padding: '0.75rem clamp(1.25rem, 3vw, 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.3em', color: MUTED }}>PAGE I</span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.2em', color: MUTED }} className="hidden sm:block">ROLLLOG • A JOURNAL OF MOVEMENT • EST. 2026</span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.52rem', letterSpacing: '0.2em', color: MUTED }}>{formatDate()}</span>
      </div>
    </div>
  )
}
