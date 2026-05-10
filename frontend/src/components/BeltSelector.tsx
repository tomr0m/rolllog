import type { Belt } from '../lib/types'

const BELT_CONFIG: Record<Belt, { label: string; color: string; textColor: string }> = {
  WHITE:  { label: 'White',  color: '#F5F5F5', textColor: '#1a1a1a' },
  BLUE:   { label: 'Blue',   color: '#1E40AF', textColor: '#ffffff' },
  PURPLE: { label: 'Purple', color: '#7C3AED', textColor: '#ffffff' },
  BROWN:  { label: 'Brown',  color: '#78350F', textColor: '#ffffff' },
  BLACK:  { label: 'Black',  color: '#111111', textColor: '#ffffff' },
}

const BELTS: Belt[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']

interface BeltSelectorProps {
  belt: Belt | null
  stripes: number
  onBeltChange: (belt: Belt) => void
  onStripesChange: (stripes: number) => void
}

function StripePip({ filled, beltColor }: { filled: boolean; beltColor: string }) {
  const isWhite = beltColor === '#F5F5F5'
  return (
    <div
      className="w-3 h-3 rounded-full border-2 transition-all"
      style={{
        backgroundColor: filled ? (isWhite ? '#1a1a1a' : '#F5F5F5') : 'transparent',
        borderColor: isWhite ? '#9ca3af' : 'rgba(255,255,255,0.5)',
      }}
    />
  )
}

export default function BeltSelector({ belt, stripes, onBeltChange, onStripesChange }: BeltSelectorProps) {
  const selected = belt ? BELT_CONFIG[belt] : null

  return (
    <div className="flex flex-col gap-4">
      {/* Belt color grid */}
      <div className="flex gap-2 flex-wrap">
        {BELTS.map((b) => {
          const cfg = BELT_CONFIG[b]
          const isSelected = belt === b
          return (
            <button
              key={b}
              type="button"
              onClick={() => onBeltChange(b)}
              className={`flex-1 min-w-18 rounded-lg py-2.5 text-xs font-semibold transition-all border-2 ${
                isSelected ? 'border-white scale-105 shadow-lg' : 'border-transparent hover:border-white/30'
              }`}
              style={{ backgroundColor: cfg.color, color: cfg.textColor }}
            >
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Belt preview bar */}
      {selected && (
        <div
          className="rounded-lg h-10 flex items-center justify-end pr-3 gap-1.5 transition-all duration-300"
          style={{ backgroundColor: selected.color }}
        >
          {[0, 1, 2, 3].map((i) => (
            <StripePip key={i} filled={i < stripes} beltColor={selected.color} />
          ))}
        </div>
      )}

      {/* Stripe selector */}
      {belt && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-400">Stripes</label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onStripesChange(n)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all border ${
                  stripes === n
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500'
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
