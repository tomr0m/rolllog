import { motion } from 'framer-motion'
import type { Belt } from '../lib/types'

const BELT_CONFIG: Record<Belt, { label: string; color: string; textColor: string }> = {
  WHITE:  { label: 'WHITE',  color: '#F0F0F0', textColor: '#1a1a1a' },
  BLUE:   { label: 'BLUE',   color: '#1E40AF', textColor: '#ffffff' },
  PURPLE: { label: 'PURPLE', color: '#7C3AED', textColor: '#ffffff' },
  BROWN:  { label: 'BROWN',  color: '#78350F', textColor: '#ffffff' },
  BLACK:  { label: 'BLACK',  color: '#1a1a1a', textColor: '#ffffff' },
}

const BELTS: Belt[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']

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
  const isBlack = b === 'BLACK'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full relative flex items-center justify-between px-4 h-14 transition-all ${
        selected
          ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-[#0a0a0a]'
          : 'opacity-60 hover:opacity-90'
      } ${isBlack ? 'border border-[#333]' : ''}`}
      style={{ backgroundColor: cfg.color }}
    >
      {/* Belt label */}
      <span
        className="text-sm font-bold tracking-widest"
        style={{ fontFamily: 'var(--font-display)', color: cfg.textColor, fontSize: '1rem' }}
      >
        {cfg.label} BELT
      </span>

      {/* Stripe ticks (right side, like a real BJJ belt) */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2.5 h-8 transition-all"
            style={{
              backgroundColor: selected && i < stripes
                ? (isWhite ? '#333' : '#f5f5f5')
                : 'transparent',
              border: `1.5px solid ${isWhite ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)'}`,
            }}
          />
        ))}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
      )}
    </motion.button>
  )
}

export default function BeltSelector({ belt, stripes, onBeltChange, onStripesChange }: BeltSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Belt rows */}
      <div className="flex flex-col gap-1.5">
        {BELTS.map((b) => (
          <BeltBar
            key={b}
            b={b}
            selected={belt === b}
            stripes={stripes}
            onClick={() => onBeltChange(b)}
          />
        ))}
      </div>

      {/* Stripe selector */}
      {belt && (
        <div className="mt-2">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
            Stripes
          </p>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onStripesChange(n)}
                className={`flex-1 h-10 text-sm font-bold transition-all border ${
                  stripes === n
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-transparent text-neutral-500 border-[#333] hover:border-neutral-500 hover:text-neutral-300'
                }`}
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
