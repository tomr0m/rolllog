import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Belt } from '../lib/types'

const PAPER = '#EBE6DA'
const CARD = '#FAF6EF'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'

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
  { num: '01', title: 'Training Log' },
  { num: '02', title: 'Technique Tree' },
  { num: '03', title: 'Progress Stats' },
  { num: '04', title: 'AI Coach' },
]

function formatDate() {
  const d = new Date()
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
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
        <span style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.25em', color: MUTED }}>{label} BELT</span>
      </div>
      <div style={{ margin: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.6rem', height: '2.5rem', backgroundColor: bg }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.8rem', letterSpacing: '0.1em', color: text }}>{belt} BELT</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: '8px',
              height: '20px',
              backgroundColor: i < stripes ? (isWhite ? '#555' : '#f5f5f5') : 'transparent',
              border: `1.5px solid ${isWhite ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.35)'}`,
            }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '0.25rem 0.75rem 0.4rem' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.15em', color: MUTED }}>
          {stripes} STRIPE{stripes !== 1 ? 'S' : ''}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const timeOnMat = monthsOnMat(user.start_date)
  const firstName = user.name.split(' ')[0]

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>

      {/* TOP BAR */}
      <div style={{
        flexShrink: 0,
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2px solid ${INK}`,
        paddingLeft: 'clamp(1.25rem, 3vw, 2.5rem)',
        paddingRight: 'clamp(1.25rem, 3vw, 2.5rem)',
      }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.85rem', letterSpacing: '0.25em' }}>ROLLLOG</span>
        <div style={{ flex: 1, height: '1px', background: OXBLOOD, margin: '0 clamp(1rem, 3vw, 2.5rem)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.2em', color: MUTED }} className="hidden sm:block">
            {user.name.toUpperCase()}
          </span>
          <button
            onClick={handleLogout}
            style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.2em', color: MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="hover:text-[#1A1A1A] transition-colors"
          >
            SIGN OUT
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)', maxWidth: '900px', margin: '0 auto', width: '100%' }}>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.4rem' }}>
            ISSUE 01 — YOUR JOURNEY
          </div>
          <div style={{ height: '1px', width: '3rem', background: OXBLOOD, marginBottom: '0.75rem' }} />
          <h1 style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 0.9,
            color: INK,
            marginBottom: '0.75rem',
          }}>
            {['Welcome', 'back,', `${firstName}.`].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
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

        {/* PROFILE CARD — two columns */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `3px solid ${OXBLOOD}`, marginBottom: 'clamp(2rem, 4vw, 3rem)' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>

            {/* LEFT — fighter details */}
            <div style={{ flex: '1 1 280px', padding: 'clamp(1.25rem, 3vw, 2rem)', borderRight: `1px solid ${BORDER}` }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.35rem' }}>
                THE FIGHTER
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: INK, marginBottom: '1.25rem', lineHeight: 1 }}>
                {user.name}
              </div>

              {/* Belt displays */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: timeOnMat ? '1.25rem' : 0 }}>
                {user.practices_gi && user.gi_belt && (
                  <BeltDisplay belt={user.gi_belt} stripes={user.gi_stripes} label="GI" />
                )}
                {user.practices_no_gi && user.no_gi_belt && (
                  <BeltDisplay belt={user.no_gi_belt} stripes={user.no_gi_stripes} label="NO-GI" />
                )}
              </div>

              {timeOnMat && (
                <div>
                  <div style={{ height: '1px', background: BORDER, marginBottom: '0.75rem' }} />
                  <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.15rem' }}>
                    TIME ON MAT
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', letterSpacing: '0.1em', color: OXBLOOD }}>
                    {timeOnMat}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — quote of the day */}
            <div style={{ flex: '1 1 240px', padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.75rem' }}>
                QUOTE OF THE DAY
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: '3px', flexShrink: 0, background: OXBLOOD, alignSelf: 'stretch', borderRadius: '1px' }} />
                <div>
                  <blockquote style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)',
                    lineHeight: 1.4,
                    color: INK,
                    marginBottom: '0.6rem',
                  }}>
                    "{quote.text}"
                  </blockquote>
                  <div style={{ fontFamily: DISPLAY, fontSize: '0.72rem', letterSpacing: '0.15em', color: MUTED }}>
                    — {quote.author}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* COMING SOON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.5rem' }}>
            COMING IN ISSUE 02
          </div>
          <div style={{ height: '1px', background: BORDER, marginBottom: '1rem' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
            {COMING_SOON.map(item => (
              <div
                key={item.num}
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  padding: '1.25rem 1rem',
                  position: 'relative',
                  opacity: 0.65,
                  cursor: 'default',
                }}
                className="group hover:opacity-80 transition-opacity"
              >
                <div style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.1em', color: OXBLOOD, marginBottom: '0.3rem' }}>
                  {item.num}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: '0.9rem', color: INK }}>
                  {item.title}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  fontFamily: DISPLAY,
                  fontSize: '0.45rem',
                  letterSpacing: '0.15em',
                  color: OXBLOOD,
                  border: `1px solid ${OXBLOOD}`,
                  padding: '1px 4px',
                  opacity: 0.7,
                }}>
                  SOON
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div style={{
        flexShrink: 0,
        borderTop: `1px solid ${BORDER}`,
        padding: '0.75rem clamp(1.25rem, 3vw, 2.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.3em', color: MUTED }}>
          PAGE I
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.2em', color: MUTED }} className="hidden sm:block">
          ROLLLOG • A JOURNAL OF MOVEMENT • EST. 2026
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.2em', color: MUTED }}>
          {formatDate()}
        </span>
      </div>
    </div>
  )
}
