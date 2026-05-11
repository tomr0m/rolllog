import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  heading: string
  tagline?: string
}

const PAPER = '#EBE6DA'
const CARD = '#FAF6EF'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const DISPLAY = 'var(--font-display)'
const SERIF = 'var(--font-serif)'

function formatDate() {
  const d = new Date()
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function AuthLayout({ children, heading, tagline }: AuthLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>
      {/* Top strip */}
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
        <span style={{ fontFamily: DISPLAY, fontSize: '0.7rem', letterSpacing: '0.2em', color: MUTED }}>
          {formatDate()}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          {tagline && (
            <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.75rem' }}>
              {tagline.toUpperCase()}
            </div>
          )}

          <div style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderTop: `3px solid ${OXBLOOD}`,
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          }}>
            <h2 style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              lineHeight: 0.95,
              color: INK,
              marginBottom: '0.4rem',
            }}>
              {heading}
            </h2>
            <div style={{ height: '1px', background: `${INK}25`, marginBottom: '1.75rem' }} />
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
