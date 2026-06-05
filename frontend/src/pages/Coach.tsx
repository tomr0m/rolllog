import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/NavBar'
import { getCoachInsights } from '../lib/coachApi'
import type { CoachInsights } from '../lib/types'

const PAPER = '#EBE6DA'
const CARD = '#FAF6EF'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const AMBER = '#F59E0B'
const DEEP_GRAY = '#3A3A3A'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'JUST NOW'
  if (mins < 60) return `${mins} MINUTE${mins > 1 ? 'S' : ''} AGO`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} HOUR${hours > 1 ? 'S' : ''} AGO`
  const days = Math.floor(hours / 24)
  return `${days} DAY${days > 1 ? 'S' : ''} AGO`
}

// ---------------------------------------------------------------------------
// Insight card
// ---------------------------------------------------------------------------
function InsightCard({
  topBorder,
  label,
  title,
  body,
  pill,
  pillBg,
  delay,
}: {
  topBorder: string
  label: string
  title: string
  body: string
  pill?: string
  pillBg?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderTop: `5px solid ${topBorder}`,
        padding: 'clamp(1.5rem, 3vw, 2.25rem)',
      }}
    >
      <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.3em', color: topBorder, marginBottom: '0.75rem' }}>
        {label}
      </div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', lineHeight: 1.1, color: INK, marginBottom: pill ? '1rem' : '1.25rem' }}>
        {title}
      </h2>
      {pill && (
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: DISPLAY,
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            color: '#fff',
            background: pillBg,
            padding: '0.35rem 0.85rem',
          }}>
            {pill}
          </span>
        </div>
      )}
      <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7, color: INK }}>
        {body}
      </p>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton card (loading)
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderTop: `5px solid ${BORDER}`,
        padding: 'clamp(1.5rem, 3vw, 2.25rem)',
      }}
    >
      <div style={{ height: '0.6rem', width: '30%', background: BORDER, marginBottom: '1rem' }} />
      <div style={{ height: '1.6rem', width: '70%', background: BORDER, marginBottom: '1.25rem' }} />
      <div style={{ height: '0.95rem', width: '100%', background: BORDER, marginBottom: '0.5rem' }} />
      <div style={{ height: '0.95rem', width: '90%', background: BORDER, marginBottom: '0.5rem' }} />
      <div style={{ height: '0.95rem', width: '60%', background: BORDER }} />
    </div>
  )
}

export default function Coach() {
  const [insights, setInsights] = useState<CoachInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = async (refresh = false) => {
    setLoading(true)
    setError(false)
    try {
      const data = await getCoachInsights(refresh)
      setInsights(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(false)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>
      <NavBar />

      <div style={{ flex: 1, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)', maxWidth: '760px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.4rem' }}>
            VOLUME IV — THE COACH'S COLUMN
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: 0.95, color: INK, marginBottom: '0.5rem' }}
          >
            Coach's Notes.
          </motion.h1>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1rem', color: MUTED, marginBottom: '1.25rem' }}>
            Personalized guidance from your data.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {insights && !loading && (
              <span style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.22em', color: MUTED }}>
                LAST UPDATED: {timeAgo(insights.generated_at)}
              </span>
            )}
            <button
              onClick={() => load(true)}
              disabled={loading}
              style={{
                fontFamily: DISPLAY, fontSize: '0.68rem', letterSpacing: '0.2em',
                color: OXBLOOD, background: 'none', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', padding: 0,
                opacity: loading ? 0.5 : 1,
              }}
            >
              ↻ REFRESH INSIGHTS
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `5px solid ${OXBLOOD}`, padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.3em', color: OXBLOOD, marginBottom: '0.75rem' }}>
              UNAVAILABLE
            </div>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '1.15rem', lineHeight: 1.6, color: INK }}>
              The coach is unavailable right now. Try again later.
            </p>
          </div>
        ) : insights ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            <InsightCard
              topBorder={OXBLOOD}
              label="FOCUS"
              title={insights.focus.title}
              pill={insights.focus.technique_name}
              pillBg={OXBLOOD}
              body={insights.focus.body}
              delay={0}
            />
            <InsightCard
              topBorder={AMBER}
              label="PROGRESS"
              title={insights.close_to.title}
              pill={insights.close_to.technique_name}
              pillBg={AMBER}
              body={insights.close_to.body}
              delay={0.08}
            />
            <InsightCard
              topBorder={DEEP_GRAY}
              label="INSIGHT"
              title={insights.pattern.title}
              body={insights.pattern.body}
              delay={0.16}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
