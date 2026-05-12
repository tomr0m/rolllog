import { AnimatePresence, motion } from 'framer-motion'
import type { SessionRewards } from '../lib/types'

const PAPER = '#FAF6EF'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const GOLD = '#B89738'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'

interface Props {
  visible: boolean
  rewards: SessionRewards | null
  onClose: () => void
}

export default function SessionRewardModal({ visible, rewards, onClose }: Props) {
  return (
    <AnimatePresence>
      {visible && rewards && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(20,18,14,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 300,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: PAPER,
              border: `1px solid ${BORDER}`,
              maxWidth: '480px',
              width: '100%',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.4rem' }}>
              ENTRY LOGGED
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1, color: INK, marginBottom: '0.5rem' }}>
              Entry Logged.
            </h2>
            <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.85rem', color: MUTED, marginBottom: '1.5rem' }}>
              The mat remembers.
            </p>

            {/* XP gained */}
            <div style={{ borderTop: `2px solid ${OXBLOOD}`, padding: '1rem 0', marginBottom: '0.5rem' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.25rem' }}>
                XP EARNED
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1, color: OXBLOOD }}>
                +{rewards.xp_gained}
              </div>
            </div>

            {/* New stripe */}
            {rewards.new_stripe_earned && (
              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: '#fff', border: `2px solid ${GOLD}` }}>
                <div style={{ fontFamily: DISPLAY, fontSize: '0.7rem', letterSpacing: '0.3em', color: GOLD, textAlign: 'center' }}>
                  ★ NEW STRIPE EARNED ★
                </div>
                <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.8rem', color: MUTED, textAlign: 'center', marginTop: '0.3rem' }}>
                  Stripe {rewards.new_stripe_count} on the app ledger.
                </p>
              </div>
            )}

            {/* Mastered */}
            {rewards.techniques_mastered.length > 0 && (
              <RewardList
                label="MASTERED"
                accent={GOLD}
                items={rewards.techniques_mastered}
                bullet="★"
              />
            )}

            {/* Unlocked */}
            {rewards.techniques_unlocked.length > 0 && (
              <RewardList
                label="UNLOCKED"
                accent={INK}
                items={rewards.techniques_unlocked}
                bullet="↑"
              />
            )}

            {/* Early attempts */}
            {rewards.techniques_attempted_early.length > 0 && (
              <RewardList
                label="EARLY ATTEMPT"
                accent={OXBLOOD}
                items={rewards.techniques_attempted_early}
                bullet="•"
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  fontFamily: DISPLAY, fontSize: '0.78rem', letterSpacing: '0.22em',
                  color: '#fff', background: OXBLOOD,
                  border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer',
                }}
              >
                CONTINUE →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function RewardList({
  label,
  accent,
  items,
  bullet,
}: {
  label: string
  accent: string
  items: string[]
  bullet: string
}) {
  return (
    <div style={{ marginTop: '1rem', borderTop: `1px solid ${BORDER}`, paddingTop: '0.85rem' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.25em', color: accent, marginBottom: '0.4rem' }}>
        {label}
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            fontFamily: SERIF,
            fontSize: '0.92rem',
            color: INK,
            paddingLeft: '0.5rem',
            marginBottom: '0.2rem',
          }}
        >
          <span style={{ color: accent, marginRight: '0.5rem' }}>{bullet}</span>
          {it}
        </div>
      ))}
    </div>
  )
}
