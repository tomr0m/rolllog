import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const QUOTES = [
  { text: 'If size mattered, the elephant would be king of the jungle.', author: 'HÉLIO GRACIE' },
  { text: 'Flow with the go.', author: 'RICKSON GRACIE' },
  { text: 'Simple is beautiful.', author: 'ROGER GRACIE' },
  { text: 'Position before submission.', author: 'JOHN DANAHER' },
  { text: 'Train hard. Train smart.', author: 'MARCELO GARCIA' },
  { text: 'I am the GOAT.', author: 'GORDON RYAN' },
]

const TOC = [
  { num: '01', title: 'Your First Roll' },
  { num: '02', title: 'The Technique Tree' },
  { num: '03', title: 'Belts & Brotherhood' },
  { num: '04', title: 'The Long Road' },
]

const HEADLINE = [
  { text: 'THE', oxblood: false },
  { text: 'ART OF', oxblood: false },
  { text: 'ROLLING.', oxblood: true },
]

const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'
const SANS = 'var(--font-sans)'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const PAPER = '#EBE6DA'

function formatDate() {
  const d = new Date()
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function WallOfLegends() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      navigate(user.onboarding_done ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(i => (i + 1) % QUOTES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) { setError('Enter at least 2 characters'); return }
    if (trimmed.length > 50) { setError('Name must be 50 characters or fewer'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/api/auth/quick-start', { name: trimmed })
      login(res.data.access_token, res.data.user)
      setFadeOut(true)
      setTimeout(() => navigate('/onboarding', { replace: true }), 600)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', background: PAPER, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-5 h-5 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      style={{ height: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
    >
      {/* Page-turn fade overlay */}
      <AnimatePresence>
        {fadeOut && (
          <motion.div
            style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

      {/* ── TOP STRIP ── */}
      <div
        style={{
          flexShrink: 0,
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `2px solid ${INK}`,
          paddingLeft: 'clamp(1.25rem, 3vw, 2.5rem)',
          paddingRight: 'clamp(1.25rem, 3vw, 2.5rem)',
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: '0.85rem', letterSpacing: '0.25em' }}>ROLLLOG</span>
        <div style={{ flex: 1, height: '1px', background: OXBLOOD, margin: '0 clamp(1rem, 3vw, 2.5rem)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: '0.75rem', letterSpacing: '0.2em' }}>{formatDate()}</span>
          <span style={{ fontFamily: SANS, fontSize: '0.52rem', letterSpacing: '0.15em', color: MUTED }}>PRICE: ONE ROLL</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }} className="flex-col md:flex-row">

        {/* LEFT COLUMN */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            borderRight: `1px solid ${INK}22`,
            padding: 'clamp(1.25rem, 3vw, 2.5rem)',
          }}
          className="w-full md:w-[35%] border-b md:border-b-0"
        >
          <div style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.3em', color: MUTED }}>
            VOLUME I — ISSUE 01
          </div>
          <div style={{ height: '1px', width: '2.5rem', background: OXBLOOD, margin: '0.6rem 0' }} />
          <div style={{ fontFamily: DISPLAY, fontSize: '0.65rem', letterSpacing: '0.25em', color: INK }}>
            A JOURNAL OF MOVEMENT
          </div>
          <div style={{ flex: 1 }} className="hidden md:block" />
          <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.25em', color: MUTED }} className="hidden md:block">
            EST. 2026 / RIO DE JANEIRO
          </div>
        </div>

        {/* MAIN COLUMN */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(1.25rem, 3vw, 2.75rem)',
          }}
        >
          {/* Headline */}
          <div style={{ marginBottom: 'clamp(1rem, 2vw, 1.75rem)' }}>
            {HEADLINE.map((line, i) => (
              <motion.div
                key={line.text}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'block',
                  fontFamily: SERIF,
                  fontWeight: 900,
                  lineHeight: 0.88,
                  fontSize: 'clamp(3.5rem, 8vw, 9rem)',
                  letterSpacing: '-0.015em',
                  color: line.oxblood ? OXBLOOD : INK,
                }}
              >
                {line.text}
              </motion.div>
            ))}
          </div>

          {/* Rule */}
          <div style={{ height: '1px', background: `${INK}30`, marginBottom: 'clamp(0.6rem, 1.2vw, 1rem)' }} />

          {/* Italic subtitle */}
          <p style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
            color: MUTED,
            marginBottom: 'clamp(1.25rem, 2.5vw, 2.25rem)',
          }}>
            A combat sports journal for the modern practitioner.
          </p>

          {/* Pull quote */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: 'clamp(1.25rem, 2.5vw, 2.25rem)' }}>
            <div style={{ width: '4px', flexShrink: 0, background: OXBLOOD, minHeight: '7rem', borderRadius: '2px' }} />
            <div style={{ flex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <blockquote style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1rem, 2vw, 1.7rem)',
                    lineHeight: 1.3,
                    color: INK,
                    marginBottom: '0.5rem',
                  }}>
                    "{QUOTES[quoteIdx].text}"
                  </blockquote>
                  <div style={{ fontFamily: DISPLAY, fontSize: '0.8rem', letterSpacing: '0.15em', color: MUTED }}>
                    — {QUOTES[quoteIdx].author}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Ornamental divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1rem, 2vw, 1.75rem)' }}>
            <div style={{ flex: 1, height: '1px', background: `${INK}20` }} />
            <span style={{ color: OXBLOOD, fontSize: '0.7rem' }}>★</span>
            <div style={{ flex: 1, height: '1px', background: `${INK}20` }} />
          </div>

          {/* Table of contents */}
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '0.7rem', letterSpacing: '0.3em', color: INK, marginBottom: '0.6rem' }}>
              IN THIS ISSUE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {TOC.map(item => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: '0.68rem', letterSpacing: '0.1em', color: OXBLOOD, minWidth: '1.5rem' }}>
                    {item.num}
                  </span>
                  <span style={{ color: MUTED, fontSize: '0.75rem' }}>—</span>
                  <span style={{ fontFamily: SERIF, fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', color: INK }}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM INPUT BAR ── */}
      <div
        style={{
          flexShrink: 0,
          borderTop: `2px solid ${INK}`,
          paddingLeft: 'clamp(1.25rem, 3vw, 2.5rem)',
          paddingRight: 'clamp(1.25rem, 3vw, 2.5rem)',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(0.75rem, 3vw, 2rem)', paddingTop: '1rem', paddingBottom: '0.5rem' }}
        >
          {/* Label */}
          <div
            className="hidden sm:block"
            style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED, flexShrink: 0, paddingBottom: '6px', lineHeight: 1.4 }}
          >
            ENTER YOUR<br />NAME, FIGHTER
          </div>

          {/* Input */}
          <div style={{ flex: 1 }}>
            <div
              className="sm:hidden"
              style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.25rem' }}
            >
              ENTER YOUR NAME, FIGHTER
            </div>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="e.g. Ilan Keselman"
              maxLength={50}
              autoComplete="off"
              autoFocus
              disabled={submitting}
              style={{
                display: 'block',
                width: '100%',
                fontFamily: SERIF,
                fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${inputFocused ? OXBLOOD : INK}`,
                color: INK,
                outline: 'none',
                padding: '4px 0 6px',
                transition: 'border-color 0.22s ease',
                letterSpacing: '0.01em',
                opacity: submitting ? 0.5 : 1,
              }}
              className="placeholder:text-[#737373]/50"
            />
            {error && (
              <p style={{ fontSize: '0.65rem', color: OXBLOOD, marginTop: '3px', fontFamily: SANS, fontStyle: 'italic' }}>
                {error}
              </p>
            )}
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={submitting || name.trim().length < 2}
            whileHover={submitting || name.trim().length < 2 ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group"
            style={{
              flexShrink: 0,
              fontFamily: DISPLAY,
              fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
              letterSpacing: '0.12em',
              color: OXBLOOD,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              paddingBottom: '6px',
              opacity: submitting || name.trim().length < 2 ? 0.4 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-[#8B1A1A]/30 border-t-[#8B1A1A] rounded-full animate-spin inline-block" />
            ) : (
              <>
                BEGIN
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 ml-0.5">
                  →
                </span>
              </>
            )}
          </motion.button>
        </form>

        {/* Bottom meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.6rem' }}>
          <span style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.3em', color: MUTED }}>PAGE I</span>
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.68rem', color: MUTED }}>
            no password required — just your fighter name
          </span>
          <a
            href="/login/classic"
            className="hover:text-[#1A1A1A] transition-colors"
            style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.2em', color: MUTED }}
          >
            CLASSIC LOGIN
          </a>
        </div>
      </div>
    </div>
  )
}
