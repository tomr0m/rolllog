import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import BeltSelector from '../components/BeltSelector'
import type { Belt } from '../lib/types'
import api from '../lib/api'

type Discipline = 'gi' | 'no_gi'

interface FormState {
  disciplines: Discipline[]
  gi_belt: Belt | null
  gi_stripes: number
  no_gi_belt: Belt | null
  no_gi_stripes: number
  start_date: string
}

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

const ROMAN = ['I', 'II', 'III', 'IV']

function formatDate() {
  const d = new Date()
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.25rem' }}>
      {ROMAN.map((numeral, i) => {
        const stepNum = i + 1
        const done = stepNum < current
        const active = stepNum === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{
                fontFamily: DISPLAY,
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                color: active ? OXBLOOD : done ? `${MUTED}99` : BORDER,
                fontWeight: active ? 'bold' : 'normal',
                transition: 'color 0.2s',
              }}>
                {done ? '✓' : numeral}
              </span>
            </div>
            {i < 3 && (
              <div style={{
                flex: 1,
                height: '1px',
                background: done ? `${OXBLOOD}40` : BORDER,
                margin: '0 0.5rem',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const slideVariants = {
  enter: { opacity: 0, x: 28 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
}

function DisciplineCard({ roman, label, desc, selected, onToggle }: {
  roman: string
  label: string
  desc: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={selected ? {} : { scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      style={{
        flex: 1,
        minWidth: '140px',
        textAlign: 'left',
        padding: '1.75rem 1.25rem 1.25rem',
        background: selected ? CARD : PAPER,
        border: selected ? `2px solid ${OXBLOOD}` : `1px solid ${BORDER}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.15s ease',
      }}
    >
      {selected && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: OXBLOOD }} />
      )}

      <div style={{
        fontFamily: SERIF,
        fontWeight: 900,
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        lineHeight: 1,
        color: selected ? OXBLOOD : `${INK}18`,
        marginBottom: '0.6rem',
        transition: 'color 0.15s ease',
      }}>
        {roman}
      </div>

      <div style={{
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
        color: INK,
        marginBottom: '0.35rem',
      }}>
        {label}
      </div>

      <div style={{ height: '1px', background: selected ? `${OXBLOOD}40` : BORDER, marginBottom: '0.5rem' }} />

      <p style={{
        fontFamily: SERIF,
        fontStyle: 'italic',
        fontSize: '0.8rem',
        color: MUTED,
        lineHeight: 1.4,
        margin: 0,
      }}>
        {desc}
      </p>

      {selected && (
        <div style={{
          position: 'absolute',
          top: '0.6rem',
          right: '0.6rem',
          fontFamily: DISPLAY,
          fontSize: '0.52rem',
          letterSpacing: '0.15em',
          color: OXBLOOD,
          border: `1px solid ${OXBLOOD}`,
          padding: '2px 5px',
        }}>
          ✓ SELECTED
        </div>
      )}
    </motion.button>
  )
}

function BeltSummaryCard({ belt, stripes, label }: { belt: Belt; stripes: number; label: string }) {
  const { bg, text } = BELT_COLORS[belt]
  const isWhite = belt === 'WHITE'

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${OXBLOOD}` }}>
      <div style={{ padding: '0.5rem 1rem 0.3rem', borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.6rem', letterSpacing: '0.25em', color: MUTED }}>
          {label} BELT
        </span>
      </div>
      <div style={{ margin: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem', height: '2.75rem', backgroundColor: bg }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.82rem', letterSpacing: '0.1em', color: text }}>
          {belt} BELT
        </span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: '8px',
              height: '22px',
              backgroundColor: i < stripes ? (isWhite ? '#555' : '#f5f5f5') : 'transparent',
              border: `1.5px solid ${isWhite ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.35)'}`,
            }} />
          ))}
        </div>
      </div>
      <div style={{ padding: '0.3rem 1rem 0.5rem' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.56rem', letterSpacing: '0.15em', color: MUTED }}>
          {stripes} STRIPE{stripes !== 1 ? 'S' : ''}
        </span>
      </div>
    </div>
  )
}

function NavBar({ onBack, onNext, nextLabel = 'Next →', nextDisabled = false, nextLoading = false }: {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  nextLoading?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '0.6rem' }}>
      {onBack && (
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: DISPLAY,
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            color: MUTED,
            background: 'transparent',
            border: `1px solid ${BORDER}`,
            padding: '0.65rem 1.1rem',
            cursor: 'pointer',
          }}
        >
          ← BACK
        </motion.button>
      )}
      <motion.button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || nextLoading}
        whileHover={nextDisabled || nextLoading ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          flex: 1,
          fontFamily: DISPLAY,
          fontSize: '0.78rem',
          letterSpacing: '0.2em',
          color: '#fff',
          background: nextDisabled ? BORDER : OXBLOOD,
          border: 'none',
          padding: '0.75rem 1.5rem',
          cursor: nextDisabled || nextLoading ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        {nextLoading && (
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {nextLabel}
      </motion.button>
    </div>
  )
}

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: SERIF,
          fontWeight: 900,
          fontSize: 'clamp(2rem, 4.5vw, 3rem)',
          lineHeight: 0.95,
          color: INK,
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </motion.h1>
      <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '0.9rem', color: MUTED }}>
        {sub}
      </p>
    </div>
  )
}

export default function Onboarding() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>({
    disciplines: [],
    gi_belt: null,
    gi_stripes: 0,
    no_gi_belt: null,
    no_gi_stripes: 0,
    start_date: '',
  })

  const toggleDiscipline = (d: Discipline) =>
    setForm(f => ({
      ...f,
      disciplines: f.disciplines.includes(d)
        ? f.disciplines.filter(x => x !== d)
        : [...f.disciplines, d],
    }))

  const canProceedStep2 = () => {
    if (form.disciplines.includes('gi') && !form.gi_belt) return false
    if (form.disciplines.includes('no_gi') && !form.no_gi_belt) return false
    return true
  }

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/profile/onboarding', {
        practices_gi: form.disciplines.includes('gi'),
        gi_belt: form.disciplines.includes('gi') ? form.gi_belt : null,
        gi_stripes: form.disciplines.includes('gi') ? form.gi_stripes : 0,
        practices_no_gi: form.disciplines.includes('no_gi'),
        no_gi_belt: form.disciplines.includes('no_gi') ? form.no_gi_belt : null,
        no_gi_stripes: form.disciplines.includes('no_gi') ? form.no_gi_stripes : 0,
        start_date: form.start_date || null,
      })
      await refreshUser()
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const firstName = user?.name?.split(' ')[0] ?? 'Fighter'

  return (
    <div style={{ minHeight: '100vh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column' }}>

      {/* TOP STRIP */}
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
        <span style={{ fontFamily: DISPLAY, fontSize: '0.68rem', letterSpacing: '0.25em', color: MUTED }}>
          CHAPTER {step} OF 4
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: '0.68rem', letterSpacing: '0.2em', color: MUTED }} className="hidden sm:block">
          {formatDate()}
        </span>
      </div>

      {/* MAIN */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 5vw, 3rem)',
      }}>
        <div style={{ width: '100%', maxWidth: '660px' }}>
          <StepIndicator current={step} />

          <AnimatePresence mode="wait">

            {/* ── STEP 1: DISCIPLINE ── */}
            {step === 1 && (
              <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <StepHeading
                  title="Choose Your Discipline."
                  sub="Every fighter has their preference. What's yours?"
                />
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                  <DisciplineCard
                    roman="I"
                    label="Gi"
                    desc="The traditional path. Cloth, friction, control."
                    selected={form.disciplines.includes('gi')}
                    onToggle={() => toggleDiscipline('gi')}
                  />
                  <DisciplineCard
                    roman="II"
                    label="No-Gi"
                    desc="Slippery and fast. The modern game."
                    selected={form.disciplines.includes('no_gi')}
                    onToggle={() => toggleDiscipline('no_gi')}
                  />
                </div>
                <NavBar
                  onNext={() => setStep(2)}
                  nextDisabled={form.disciplines.length === 0}
                  nextLabel="Next: Your Belt →"
                />
              </motion.div>
            )}

            {/* ── STEP 2: BELT ── */}
            {step === 2 && (
              <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <StepHeading
                  title="Where Do You Stand?"
                  sub="Show us the journey you've taken so far."
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2rem' }}>
                  {form.disciplines.includes('gi') && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <div style={{ width: '3px', height: '0.9rem', background: OXBLOOD }} />
                        <span style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: OXBLOOD }}>GI</span>
                      </div>
                      <BeltSelector
                        belt={form.gi_belt}
                        stripes={form.gi_stripes}
                        onBeltChange={b => setForm(f => ({ ...f, gi_belt: b }))}
                        onStripesChange={s => setForm(f => ({ ...f, gi_stripes: s }))}
                      />
                    </div>
                  )}
                  {form.disciplines.includes('no_gi') && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                        <div style={{ width: '3px', height: '0.9rem', background: OXBLOOD }} />
                        <span style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: OXBLOOD }}>NO-GI</span>
                      </div>
                      <BeltSelector
                        belt={form.no_gi_belt}
                        stripes={form.no_gi_stripes}
                        onBeltChange={b => setForm(f => ({ ...f, no_gi_belt: b }))}
                        onStripesChange={s => setForm(f => ({ ...f, no_gi_stripes: s }))}
                      />
                    </div>
                  )}
                </div>
                <NavBar
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                  nextDisabled={!canProceedStep2()}
                  nextLabel="Next: History →"
                />
              </motion.div>
            )}

            {/* ── STEP 3: START DATE ── */}
            {step === 3 && (
              <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <StepHeading
                  title="The First Day."
                  sub="When did you first step on the mat?"
                />
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.4rem' }}>
                    FIRST DAY ON THE MAT
                  </div>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                      fontFamily: SERIF,
                      fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${INK}`,
                      color: INK,
                      outline: 'none',
                      padding: '4px 0 6px',
                      width: '100%',
                      colorScheme: 'light',
                    }}
                  />
                </div>
                <NavBar
                  onBack={() => setStep(2)}
                  onNext={() => setStep(4)}
                  nextLabel={form.start_date ? 'Next: Confirm →' : 'Skip →'}
                />
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: '0.78rem',
                    color: MUTED,
                    cursor: 'pointer',
                    marginTop: '0.75rem',
                    padding: 0,
                  }}
                >
                  I'd rather not say →
                </button>
              </motion.div>
            )}

            {/* ── STEP 4: CONFIRM ── */}
            {step === 4 && (
              <motion.div key="s4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
                <StepHeading
                  title={`Your Profile, ${firstName}.`}
                  sub="A summary of where you stand today."
                />

                {/* Summary card */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `3px solid ${OXBLOOD}`, marginBottom: '2rem' }}>
                  {/* Name */}
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.2rem' }}>
                      FIGHTER
                    </div>
                    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: INK }}>
                      {user?.name}
                    </div>
                  </div>

                  {/* Belt summaries */}
                  {(form.disciplines.includes('gi') && form.gi_belt) || (form.disciplines.includes('no_gi') && form.no_gi_belt) ? (
                    <div style={{ padding: '1rem 1.5rem', borderBottom: form.start_date ? `1px solid ${BORDER}` : 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {form.disciplines.includes('gi') && form.gi_belt && (
                        <BeltSummaryCard belt={form.gi_belt} stripes={form.gi_stripes} label="GI" />
                      )}
                      {form.disciplines.includes('no_gi') && form.no_gi_belt && (
                        <BeltSummaryCard belt={form.no_gi_belt} stripes={form.no_gi_stripes} label="NO-GI" />
                      )}
                    </div>
                  ) : null}

                  {/* Start date */}
                  {form.start_date && (
                    <div style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontFamily: DISPLAY, fontSize: '0.58rem', letterSpacing: '0.25em', color: MUTED, marginBottom: '0.2rem' }}>
                        TRAINING SINCE
                      </div>
                      <div style={{ fontFamily: SERIF, fontSize: '1rem', color: INK }}>
                        {new Date(form.start_date + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p style={{ fontSize: '0.7rem', color: OXBLOOD, fontFamily: SERIF, fontStyle: 'italic', borderLeft: `2px solid ${OXBLOOD}`, paddingLeft: '0.75rem', marginBottom: '1rem' }}>
                    {error}
                  </p>
                )}

                <NavBar
                  onBack={() => setStep(3)}
                  onNext={handleSubmit}
                  nextLabel="ENTER THE ARCHIVE →"
                  nextLoading={submitting}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
