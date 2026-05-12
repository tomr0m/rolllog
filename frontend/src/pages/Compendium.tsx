import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import NavBar from '../components/NavBar'
import { getProgression, getTechniques } from '../lib/techniquesApi'
import type {
  Belt,
  Progression,
  Technique,
  TechniqueCategory,
  TechniqueStatus,
} from '../lib/types'

const PAPER = '#EBE6DA'
const CARD = '#FAF6EF'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'
const GOLD = '#B89738'
const SERIF = 'var(--font-serif)'
const DISPLAY = 'var(--font-display)'

const BELT_COLORS: Record<Belt, string> = {
  WHITE: '#F5F1E6',
  BLUE: '#1F4FA8',
  PURPLE: '#5B2B82',
  BROWN: '#5A3A1B',
  BLACK: '#0A0A0A',
}

const BELTS: Belt[] = ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK']

const CATEGORIES: TechniqueCategory[] = [
  'FUNDAMENTAL',
  'GUARD',
  'PASS',
  'SWEEP',
  'SUBMISSION',
  'ESCAPE',
  'TAKEDOWN',
  'TRANSITION',
]

type DisciplineFilter = 'ALL' | 'GI' | 'NO_GI'
type BeltFilter = 'ALL' | Belt
type StatusFilter = 'ALL' | TechniqueStatus
type CategoryFilter = 'ALL' | TechniqueCategory

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ technique }: { technique: Technique }) {
  const isEarlyAttempt =
    technique.user_status === 'ATTEMPTED' &&
    technique.belt_required !== 'WHITE' &&
    technique.times_practiced > 0
  // (Heuristic — true "early attempt" detection happens on the backend; we
  // surface a generic ATTEMPTED badge with the right styling here.)

  const styles: Record<TechniqueStatus, { bg: string; color: string; text: string; border: string }> = {
    LOCKED: { bg: 'transparent', color: MUTED, text: 'LOCKED', border: BORDER },
    UNLOCKED: { bg: 'transparent', color: INK, text: 'AVAILABLE', border: INK },
    ATTEMPTED: { bg: OXBLOOD, color: '#fff', text: `ATTEMPTED · ${technique.times_practiced}/5`, border: OXBLOOD },
    MASTERED: { bg: GOLD, color: '#fff', text: '★  MASTERED', border: GOLD },
  }
  const s = styles[technique.user_status]
  return (
    <span
      style={{
        fontFamily: DISPLAY,
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        padding: '2px 8px',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {isEarlyAttempt && technique.user_status === 'ATTEMPTED' ? `EARLY · ${technique.times_practiced}/5` : s.text}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Technique row
// ---------------------------------------------------------------------------
function TechniqueRow({
  technique,
  byId,
}: {
  technique: Technique
  byId: Map<number, Technique>
}) {
  const [expanded, setExpanded] = useState(false)
  const locked = technique.user_status === 'LOCKED'
  const mastered = technique.user_status === 'MASTERED'

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        borderTop: `1px solid ${BORDER}`,
        padding: 'clamp(0.9rem, 2vw, 1.2rem) 0',
        cursor: 'pointer',
        opacity: locked ? 0.55 : 1,
        transition: 'opacity 0.15s, background 0.15s',
        display: 'flex',
        gap: 'clamp(0.85rem, 2vw, 1.5rem)',
        alignItems: 'flex-start',
      }}
      className="hover:bg-[#E3DDD1] -mx-2 px-2"
    >
      {/* Left status column */}
      <div style={{ flexShrink: 0, width: '110px', paddingTop: '2px' }}>
        <StatusBadge technique={technique} />
      </div>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
              color: mastered ? GOLD : INK,
              lineHeight: 1.1,
            }}
          >
            {technique.name}
          </span>
          <span style={{ fontFamily: DISPLAY, fontSize: '0.55rem', letterSpacing: '0.2em', color: MUTED }}>
            {technique.category}
            {technique.discipline === 'GI_ONLY' ? ' · GI ONLY' : technique.discipline === 'NO_GI_ONLY' ? ' · NO-GI ONLY' : ''}
          </span>
        </div>

        {technique.description && (
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.82rem', color: MUTED, marginBottom: '0.3rem' }}>
            {technique.description}
          </p>
        )}

        {(technique.times_practiced > 0 || (technique.prerequisite_technique_ids?.length ?? 0) > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1rem', marginTop: '0.25rem' }}>
            {technique.times_practiced > 0 && (
              <span style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.18em', color: OXBLOOD }}>
                {technique.times_practiced} SESSION{technique.times_practiced === 1 ? '' : 'S'}
              </span>
            )}
            {expanded && technique.prerequisite_technique_ids?.length > 0 && (
              <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.75rem', color: MUTED }}>
                Requires:{' '}
                {technique.prerequisite_technique_ids
                  .map(pid => {
                    const p = byId.get(pid)
                    if (!p) return null
                    const tag = p.user_status === 'MASTERED' ? 'mastered' : p.user_status.toLowerCase()
                    return `${p.name} (${tag})`
                  })
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat tile (progression summary)
// ---------------------------------------------------------------------------
function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ flex: '1 1 130px', borderLeft: `2px solid ${OXBLOOD}`, paddingLeft: '0.85rem' }}>
      <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.22em', color: MUTED, marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', lineHeight: 1, color: INK }}>
        {value}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Compendium() {
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [progression, setProgression] = useState<Progression | null>(null)
  const [loading, setLoading] = useState(true)

  const [discipline, setDiscipline] = useState<DisciplineFilter>('ALL')
  const [beltFilter, setBeltFilter] = useState<BeltFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL')

  useEffect(() => {
    Promise.all([getTechniques(), getProgression()])
      .then(([t, p]) => {
        setTechniques(t)
        setProgression(p)
      })
      .finally(() => setLoading(false))
  }, [])

  const byId = useMemo(() => new Map(techniques.map(t => [t.id, t])), [techniques])

  const filtered = useMemo(() => {
    return techniques.filter(t => {
      if (beltFilter !== 'ALL' && t.belt_required !== beltFilter) return false
      if (statusFilter !== 'ALL' && t.user_status !== statusFilter) return false
      if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false
      if (discipline === 'GI' && t.discipline === 'NO_GI_ONLY') return false
      if (discipline === 'NO_GI' && t.discipline === 'GI_ONLY') return false
      return true
    })
  }, [techniques, beltFilter, statusFilter, categoryFilter, discipline])

  const grouped = useMemo(() => {
    const out: Record<Belt, Record<TechniqueCategory, Technique[]>> = {
      WHITE: {} as any, BLUE: {} as any, PURPLE: {} as any, BROWN: {} as any, BLACK: {} as any,
    }
    for (const belt of BELTS) {
      for (const cat of CATEGORIES) {
        out[belt][cat] = []
      }
    }
    for (const t of filtered) {
      out[t.belt_required][t.category].push(t)
    }
    return out
  }, [filtered])

  const nextUnlockName = progression?.next_unlocks?.[0]?.name ?? '—'

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>
      <NavBar />

      <div style={{ flex: 1, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)', maxWidth: '980px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <div style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.3em', color: MUTED, marginBottom: '0.3rem' }}>
            VOLUME III — THE COMPENDIUM
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', lineHeight: 0.95, color: INK, marginBottom: '0.4rem' }}
          >
            The Compendium.
          </motion.h1>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.92rem', color: MUTED }}>
            Every technique on the path.
          </p>
        </div>

        {/* Progression summary */}
        <div style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          padding: 'clamp(1.25rem, 2.5vw, 2rem)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem 1rem', marginBottom: '1.5rem' }}>
            <StatTile label="XP" value={progression?.xp ?? 0} />
            <StatTile label="STRIPES EARNED" value={progression?.suggested_stripes ?? 0} />
            <StatTile label="MASTERED" value={progression?.mastered ?? 0} />
            <StatTile label="NEXT UNLOCK" value={nextUnlockName === '—' ? '—' : (nextUnlockName.length > 18 ? nextUnlockName.slice(0, 17) + '…' : nextUnlockName)} />
          </div>

          {/* Progress bar */}
          {progression && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.2em', color: MUTED, marginBottom: '0.4rem' }}>
                <span>PROGRESS TO STRIPE {progression.suggested_stripes + 1}</span>
                <span>{Math.round((progression.progress_to_next_stripe ?? 0) * 100)}%</span>
              </div>
              <div style={{ height: '4px', background: BORDER, position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progression.progress_to_next_stripe ?? 0) * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: OXBLOOD }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
          <FilterRow
            label="DISCIPLINE"
            value={discipline}
            onChange={v => setDiscipline(v as DisciplineFilter)}
            options={[
              ['ALL', 'ALL'],
              ['GI', 'GI'],
              ['NO_GI', 'NO-GI'],
            ]}
          />
          <FilterRow
            label="BELT"
            value={beltFilter}
            onChange={v => setBeltFilter(v as BeltFilter)}
            options={[['ALL', 'ALL'], ...BELTS.map(b => [b, b] as [string, string])]}
          />
          <FilterRow
            label="STATUS"
            value={statusFilter}
            onChange={v => setStatusFilter(v as StatusFilter)}
            options={[
              ['ALL', 'ALL'],
              ['LOCKED', 'LOCKED'],
              ['UNLOCKED', 'UNLOCKED'],
              ['ATTEMPTED', 'ATTEMPTED'],
              ['MASTERED', 'MASTERED'],
            ]}
          />
          <FilterRow
            label="CATEGORY"
            value={categoryFilter}
            onChange={v => setCategoryFilter(v as CategoryFilter)}
            options={[['ALL', 'ALL'], ...CATEGORIES.map(c => [c, c] as [string, string])]}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <div className="w-5 h-5 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', color: MUTED, textAlign: 'center', padding: '3rem 0' }}>
            No techniques match these filters.
          </p>
        ) : (
          <div>
            {BELTS.map(belt => {
              const sectionTechs = filtered.filter(t => t.belt_required === belt)
              if (sectionTechs.length === 0) return null
              return (
                <section key={belt} style={{ marginBottom: '3rem' }}>
                  {/* Belt section header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: 'clamp(40px, 8vw, 60px)',
                      height: '14px',
                      background: BELT_COLORS[belt],
                      border: belt === 'WHITE' ? `1px solid ${INK}` : 'none',
                    }} />
                    <span style={{ fontFamily: DISPLAY, fontSize: '0.78rem', letterSpacing: '0.28em', color: INK }}>
                      {belt} BELT
                    </span>
                    <span style={{ flex: 1, height: '1px', background: BORDER }} />
                    <span style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.2em', color: MUTED }}>
                      {sectionTechs.length} TECHNIQUE{sectionTechs.length === 1 ? '' : 'S'}
                    </span>
                  </div>

                  {CATEGORIES.map(cat => {
                    const items = grouped[belt][cat]
                    if (!items || items.length === 0) return null
                    return (
                      <div key={cat} style={{ marginBottom: '1.75rem' }}>
                        <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: OXBLOOD, marginBottom: '0.5rem' }}>
                          {cat}
                        </div>
                        <div style={{ borderBottom: `1px solid ${BORDER}` }}>
                          {items.map(t => (
                            <TechniqueRow key={t.id} technique={t} byId={byId} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Filter row
// ---------------------------------------------------------------------------
function FilterRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.25em', color: MUTED, minWidth: '92px' }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
        {options.map(([val, lab]) => {
          const active = value === val
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
                fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.2em',
                color: active ? OXBLOOD : MUTED,
                borderBottom: active ? `1px solid ${OXBLOOD}` : '1px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {lab}
            </button>
          )
        })}
      </div>
    </div>
  )
}
