import { motion } from 'framer-motion'
import type { Belt } from '../lib/types'

const BELT_CONFIG: Record<Belt, { label: string; color: string; textColor: string }> = {
  WHITE:  { label: 'WHITE',  color: '#EFEFEF', textColor: '#1A1A1A' },
  BLUE:   { label: 'BLUE',   color: '#1E40AF', textColor: '#ffffff' },
  PURPLE: { label: 'PURPLE', color: '#7C3AED', textColor: '#ffffff' },
  BROWN:  { label: 'BROWN',  color: '#78350F', textColor: '#ffffff' },
  BLACK:  { label: 'BLACK',  color: '#1A1A1A', textColor: '#ffffff' },
}

const BELTS: Belt[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const DISPLAY = 'var(--font-display)'

interface BeltSelectorProps {
  belt: Belt | null
  stripes: number
  onBeltChange: (belt: Belt) => void
  onStripesChange: (stripes: number) => void
}

function BeltBar({ b, selected, stripes, onClick }: {
  b: Belt
  selected: boolean
  stripes: number
  onClick: () => void
}) {
  const cfg = BELT_CONFIG[b]
  const isWhite = b === 'WHITE'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        height: '2.75rem',
        backgroundColor: cfg.color,
        border: selected ? `2px solid ${OXBLOOD}` : `1px solid ${isWhite ? BORDER : 'transparent'}`,
        opacity: selected ? 1 : 0.6,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ fontFamily: DISPLAY, fontSize: '0.85rem', letterSpacing: '0.1em', color: cfg.textColor }}>
        {cfg.label} BELT
      </span>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: '9px',
              height: '26px',
              backgroundColor: selected && i < stripes
                ? (isWhite ? '#555' : '#f5f5f5')
                : 'transparent',
              border: `1.5px solid ${isWhite ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.35)'}`,
            }}
          />
        ))}
      </div>
      {selected && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: OXBLOOD }} />
      )}
    </motion.button>
  )
}

export default function BeltSelector({ belt, stripes, onBeltChange, onStripesChange }: BeltSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {BELTS.map(b => (
          <BeltBar
            key={b}
            b={b}
            selected={belt === b}
            stripes={stripes}
            onClick={() => onBeltChange(b)}
          />
        ))}
      </div>

      {belt && (
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.35rem' }}>
            STRIPES
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onStripesChange(n)}
                style={{
                  flex: 1,
                  height: '2.25rem',
                  fontFamily: DISPLAY,
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  background: stripes === n ? OXBLOOD : 'transparent',
                  color: stripes === n ? '#fff' : MUTED,
                  border: stripes === n ? `1px solid ${OXBLOOD}` : `1px solid ${BORDER}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
