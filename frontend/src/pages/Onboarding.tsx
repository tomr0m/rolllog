import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import BeltSelector from '../components/BeltSelector'
import Button from '../components/Button'
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

const STEP_LABELS = ['YOUR GAME', 'YOUR BELT', 'YOUR HISTORY', 'CONFIRM']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all ${
                  active
                    ? 'bg-red-600 text-white'
                    : done
                    ? 'bg-red-900 text-red-400'
                    : 'bg-[#1a1a1a] text-neutral-600 border border-[#333]'
                }`}
                style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}
              >
                {done ? '✓' : num}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider mt-1 hidden sm:block ${
                  active ? 'text-red-500' : done ? 'text-red-900' : 'text-neutral-700'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 transition-all ${
                  done ? 'bg-red-800' : 'bg-[#262626]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

const slideVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
}

function DisciplineCard({
  label,
  desc,
  icon,
  selected,
  onToggle,
}: {
  label: string
  desc: string
  icon: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-5 border-2 transition-all relative overflow-hidden ${
        selected
          ? 'border-red-600 bg-[#1a0a0a]'
          : 'border-[#262626] bg-[#141414] hover:border-[#333]'
      }`}
    >
      {selected && (
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
      )}
      <div className="flex items-start justify-between">
        <div className="pl-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{icon}</span>
            <span
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}
            >
              {label}
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">{desc}</p>
        </div>
        <div
          className={`w-5 h-5 shrink-0 mt-1 border-2 flex items-center justify-center transition-all ${
            selected ? 'border-red-600 bg-red-600' : 'border-[#444]'
          }`}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </motion.button>
  )
}

function BeltSummaryBar({ belt, stripes, label }: { belt: Belt; stripes: number; label: string }) {
  const colors: Record<Belt, { bg: string; text: string }> = {
    WHITE:  { bg: '#F0F0F0', text: '#1a1a1a' },
    BLUE:   { bg: '#1E40AF', text: '#fff' },
    PURPLE: { bg: '#7C3AED', text: '#fff' },
    BROWN:  { bg: '#78350F', text: '#fff' },
    BLACK:  { bg: '#1a1a1a', text: '#fff' },
  }
  const { bg, text } = colors[belt]

  return (
    <div className="border border-[#262626] border-l-4 border-l-red-600 bg-[#141414] p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">{label}</p>
      <div className="flex items-center justify-between px-3 h-10" style={{ backgroundColor: bg }}>
        <span
          className="text-sm font-bold tracking-widest"
          style={{ fontFamily: 'var(--font-display)', color: text, fontSize: '0.9rem' }}
        >
          {belt} BELT
        </span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2.5 h-7"
              style={{
                backgroundColor: i < stripes ? (belt === 'WHITE' ? '#333' : '#f5f5f5') : 'transparent',
                border: `1.5px solid ${belt === 'WHITE' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'}`,
              }}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-neutral-600 mt-1.5 uppercase tracking-wider font-medium">
        {stripes} STRIPE{stripes !== 1 ? 'S' : ''}
      </p>
    </div>
  )
}

export default function Onboarding() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
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
    setForm((f) => ({
      ...f,
      disciplines: f.disciplines.includes(d)
        ? f.disciplines.filter((x) => x !== d)
        : [...f.disciplines, d],
    }))

  const canProceedStep2 = () => {
    if (form.disciplines.includes('gi') && !form.gi_belt) return false
    if (form.disciplines.includes('no_gi') && !form.no_gi_belt) return false
    return true
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong')
      setLoading(false)
    }
  }

  const firstName = user?.name?.split(' ')[0]?.toUpperCase() ?? 'FIGHTER'

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl text-white tracking-widest"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ROLLLOG
          </h1>
          <div className="mx-auto mt-1.5 w-24 h-0.5 bg-red-600" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#141414] border border-[#262626] border-t-4 border-t-red-600 p-6 sm:p-8"
        >
          <StepIndicator current={step} />

          <AnimatePresence mode="wait">

            {/* ── STEP 1: DISCIPLINE ── */}
            {step === 1 && (
              <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                <h2
                  className="text-3xl text-white mb-1 tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  WHAT'S YOUR GAME?
                </h2>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-medium">
                  Select all that apply — each track is separate
                </p>
                <div className="flex flex-col gap-3 mb-6">
                  <DisciplineCard
                    label="GI"
                    desc="Kimono / traditional training"
                    icon="🥋"
                    selected={form.disciplines.includes('gi')}
                    onToggle={() => toggleDiscipline('gi')}
                  />
                  <DisciplineCard
                    label="NO-GI"
                    desc="Shorts and rashguard training"
                    icon="🩳"
                    selected={form.disciplines.includes('no_gi')}
                    onToggle={() => toggleDiscipline('no_gi')}
                  />
                </div>
                <Button
                  fullWidth
                  onClick={() => setStep(2)}
                  disabled={form.disciplines.length === 0}
                >
                  Next: Your Belt →
                </Button>
              </motion.div>
            )}

            {/* ── STEP 2: BELT ── */}
            {step === 2 && (
              <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                <h2
                  className="text-3xl text-white mb-1 tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  WHAT'S YOUR BELT?
                </h2>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-medium">
                  Select belt + stripes for each discipline
                </p>

                <div className="flex flex-col gap-6">
                  {form.disciplines.includes('gi') && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
                        — GI
                      </p>
                      <BeltSelector
                        belt={form.gi_belt}
                        stripes={form.gi_stripes}
                        onBeltChange={(b) => setForm((f) => ({ ...f, gi_belt: b }))}
                        onStripesChange={(s) => setForm((f) => ({ ...f, gi_stripes: s }))}
                      />
                    </div>
                  )}
                  {form.disciplines.includes('no_gi') && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
                        — NO-GI
                      </p>
                      <BeltSelector
                        belt={form.no_gi_belt}
                        stripes={form.no_gi_stripes}
                        onBeltChange={(b) => setForm((f) => ({ ...f, no_gi_belt: b }))}
                        onStripesChange={(s) => setForm((f) => ({ ...f, no_gi_stripes: s }))}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                  <Button fullWidth onClick={() => setStep(3)} disabled={!canProceedStep2()}>
                    Next: History →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: START DATE ── */}
            {step === 3 && (
              <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                <h2
                  className="text-3xl text-white mb-1 tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  WHEN DID YOU START ROLLING?
                </h2>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-medium">
                  Optional — when did you first step on the mat?
                </p>

                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    First Day on the Mat
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#111111] border border-[#262626] rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-colors scheme-dark"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                  <Button fullWidth onClick={() => setStep(4)}>
                    {form.start_date ? 'Next: Confirm →' : 'Skip →'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: CONFIRM ── */}
            {step === 4 && (
              <motion.div key="s4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                <h2
                  className="text-3xl text-white mb-1 tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  READY TO ROLL, {firstName}.
                </h2>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-6 font-medium">
                  Your fighter profile — confirm before entering
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  {form.disciplines.includes('gi') && form.gi_belt && (
                    <BeltSummaryBar belt={form.gi_belt} stripes={form.gi_stripes} label="GI" />
                  )}
                  {form.disciplines.includes('no_gi') && form.no_gi_belt && (
                    <BeltSummaryBar belt={form.no_gi_belt} stripes={form.no_gi_stripes} label="NO-GI" />
                  )}
                  {form.start_date && (
                    <div className="border border-[#262626] border-l-4 border-l-red-600 bg-[#141414] p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Training Since
                      </p>
                      <p
                        className="text-white text-xl tracking-wide"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {new Date(form.start_date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        }).toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium border-l-2 border-red-600 pl-3 mb-4">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(3)}>← Back</Button>
                  <Button fullWidth loading={loading} onClick={handleSubmit}>
                    Hit the Mat →
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
