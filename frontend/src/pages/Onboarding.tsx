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

const STEP_COUNT = 4

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full flex-1 transition-all duration-300 ${
            i < current ? 'bg-white' : i === current - 1 ? 'bg-white' : 'bg-neutral-700'
          }`}
        />
      ))}
    </div>
  )
}

const variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
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

  const toggleDiscipline = (d: Discipline) => {
    setForm((f) => ({
      ...f,
      disciplines: f.disciplines.includes(d)
        ? f.disciplines.filter((x) => x !== d)
        : [...f.disciplines, d],
    }))
  }

  const canProceedStep1 = form.disciplines.length > 0

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

  const DisciplineCard = ({ id, label, desc }: { id: Discipline; label: string; desc: string }) => {
    const selected = form.disciplines.includes(id)
    return (
      <button
        type="button"
        onClick={() => toggleDiscipline(id)}
        className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
          selected
            ? 'border-white bg-neutral-800'
            : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-medium">{label}</div>
            <div className="text-neutral-400 text-sm mt-0.5">{desc}</div>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              selected ? 'border-white bg-white' : 'border-neutral-600'
            }`}
          >
            {selected && <div className="w-2 h-2 rounded-full bg-black" />}
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Roll<span className="text-neutral-400">Log</span>
          </h1>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <StepIndicator current={step} total={STEP_COUNT} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="text-xl font-semibold text-white mb-1">How do you train?</h2>
                <p className="text-neutral-400 text-sm mb-6">Select all that apply — each track is tracked separately.</p>
                <div className="flex flex-col gap-3 mb-6">
                  <DisciplineCard id="gi" label="Gi" desc="Traditional kimono training" />
                  <DisciplineCard id="no_gi" label="No-Gi" desc="Shorts and rashguard training" />
                </div>
                <Button fullWidth onClick={() => setStep(2)} disabled={!canProceedStep1}>
                  Continue →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="text-xl font-semibold text-white mb-1">Your rank</h2>
                <p className="text-neutral-400 text-sm mb-6">Select your belt and stripes for each discipline.</p>

                <div className="flex flex-col gap-6">
                  {form.disciplines.includes('gi') && (
                    <div>
                      <div className="text-sm font-medium text-neutral-300 mb-3">Gi</div>
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
                      <div className="text-sm font-medium text-neutral-300 mb-3">No-Gi</div>
                      <BeltSelector
                        belt={form.no_gi_belt}
                        stripes={form.no_gi_stripes}
                        onBeltChange={(b) => setForm((f) => ({ ...f, no_gi_belt: b }))}
                        onStripesChange={(s) => setForm((f) => ({ ...f, no_gi_stripes: s }))}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                  <Button fullWidth onClick={() => setStep(3)} disabled={!canProceedStep2()}>
                    Continue →
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="text-xl font-semibold text-white mb-1">When did you start?</h2>
                <p className="text-neutral-400 text-sm mb-6">Optional — helps track your overall journey.</p>

                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-sm font-medium text-neutral-300">Start date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500/30 transition-colors scheme-dark"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                  <Button fullWidth onClick={() => setStep(4)}>
                    {form.start_date ? 'Continue →' : 'Skip →'}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                <h2 className="text-xl font-semibold text-white mb-1">All set, {user?.name?.split(' ')[0]}!</h2>
                <p className="text-neutral-400 text-sm mb-6">Here's a summary of your profile.</p>

                <div className="flex flex-col gap-3 mb-6">
                  {form.disciplines.includes('gi') && form.gi_belt && (
                    <div className="bg-neutral-800 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Gi</div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-md border border-white/10"
                          style={{ backgroundColor: beltColor(form.gi_belt) }}
                        />
                        <div>
                          <div className="text-white font-medium capitalize">{form.gi_belt.toLowerCase()} belt</div>
                          <div className="text-neutral-400 text-sm">{form.gi_stripes} stripe{form.gi_stripes !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {form.disciplines.includes('no_gi') && form.no_gi_belt && (
                    <div className="bg-neutral-800 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">No-Gi</div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-md border border-white/10"
                          style={{ backgroundColor: beltColor(form.no_gi_belt) }}
                        />
                        <div>
                          <div className="text-white font-medium capitalize">{form.no_gi_belt.toLowerCase()} belt</div>
                          <div className="text-neutral-400 text-sm">{form.no_gi_stripes} stripe{form.no_gi_stripes !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {form.start_date && (
                    <div className="bg-neutral-800 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Training since</div>
                      <div className="text-white">{new Date(form.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep(3)}>← Back</Button>
                  <Button fullWidth loading={loading} onClick={handleSubmit}>
                    Start training →
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function beltColor(belt: Belt): string {
  const map: Record<Belt, string> = {
    WHITE: '#F5F5F5',
    BLUE: '#1E40AF',
    PURPLE: '#7C3AED',
    BROWN: '#78350F',
    BLACK: '#111111',
  }
  return map[belt]
}
