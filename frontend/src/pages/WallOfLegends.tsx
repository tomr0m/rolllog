import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import LegendCard from '../components/LegendCard'
import {
  HelioSilhouette,
  RicksonSilhouette,
  RogerSilhouette,
  DanaherSilhouette,
  MarceloSilhouette,
  GordonSilhouette,
} from '../components/Silhouettes'
import api from '../lib/api'

const LEGENDS = [
  {
    name: 'HELIO GRACIE',
    quote: 'If size mattered, the elephant would be king of the jungle.',
    Silhouette: HelioSilhouette,
  },
  {
    name: 'RICKSON GRACIE',
    quote: 'Flow with the go.',
    Silhouette: RicksonSilhouette,
  },
  {
    name: 'ROGER GRACIE',
    quote: 'Simple is beautiful.',
    Silhouette: RogerSilhouette,
  },
  {
    name: 'JOHN DANAHER',
    quote: 'Position before submission.',
    Silhouette: DanaherSilhouette,
  },
  {
    name: 'MARCELO GARCIA',
    quote: 'Train hard. Train smart.',
    Silhouette: MarceloSilhouette,
  },
  {
    name: 'GORDON RYAN',
    quote: 'I am the GOAT.',
    Silhouette: GordonSilhouette,
  },
]

export default function WallOfLegends() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  // Redirect already-authenticated users
  useEffect(() => {
    if (!loading && user) {
      navigate(user.onboarding_done ? '/dashboard' : '/onboarding', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Enter at least 2 characters')
      return
    }
    if (trimmed.length > 50) {
      setError('Name must be 50 characters or fewer')
      return
    }
    setError('')
    setSubmitting(true)

    try {
      const res = await api.post('/api/auth/quick-start', { name: trimmed })
      login(res.data.access_token, res.data.user)
      // Cinematic fade-to-black before navigation
      setFadeOut(true)
      setTimeout(() => navigate('/onboarding', { replace: true }), 600)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] overflow-hidden relative">

      {/* ── Fade-to-black overlay on submit ── */}
      <AnimatePresence>
        {fadeOut && (
          <motion.div
            className="fixed inset-0 bg-black z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

      {/* ── Top corners ── */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-5 pt-4 z-10 pointer-events-none">
        <div>
          <h1
            className="text-2xl text-white tracking-widest leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ROLLLOG
          </h1>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-8 h-px bg-red-600" />
            <div className="w-2 h-2 bg-red-600 skew-x-12" />
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-700 mt-1">
          Track Your Roll
        </span>
      </div>

      {/* ── Legend Grid ── */}
      <div
        className="flex-1 grid grid-cols-2 md:grid-cols-3"
        style={{
          gap: '1px',
          background: 'rgba(180,0,0,0.15)',
        }}
      >
        {LEGENDS.map((legend, i) => (
          <LegendCard
            key={legend.name}
            name={legend.name}
            quote={legend.quote}
            Silhouette={legend.Silhouette}
            index={i}
          />
        ))}
      </div>

      {/* ── Bottom input bar ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
        className="shrink-0 h-20 bg-[#0A0A0A] border-t-2 border-red-600 flex items-center justify-center px-4 relative"
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 w-full max-w-xl"
        >
          <div className="flex-1 flex flex-col">
            <label
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-600 mb-0.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Enter Your Fighter Name
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                placeholder="e.g. Ilan Keselman"
                maxLength={50}
                autoComplete="off"
                autoFocus
                disabled={submitting}
                className="w-full bg-transparent border-b border-neutral-800 focus:border-red-600 text-white text-lg font-medium placeholder:text-neutral-700 focus:outline-none transition-colors pb-0.5 pr-2 disabled:opacity-50"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
              />
              {/* Animated red underline on focus */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-red-600 transition-all duration-300 peer-focus:w-full" />
            </div>
            {error && (
              <p className="text-[10px] text-red-500 font-medium mt-0.5 absolute -bottom-4">{error}</p>
            )}
          </div>

          {/* BEGIN button */}
          <motion.button
            type="submit"
            disabled={submitting || name.trim().length < 2}
            whileHover={{ scale: submitting ? 1 : 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest px-5 py-2 text-sm transition-colors"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.15em' }}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>...</span>
              </span>
            ) : 'BEGIN →'}
          </motion.button>
        </form>

        {/* Classic login link — subtle, bottom-right */}
        <a
          href="/login/classic"
          className="absolute right-4 bottom-1.5 text-[9px] uppercase tracking-widest text-neutral-700 hover:text-neutral-500 transition-colors"
        >
          Classic Login
        </a>
      </motion.div>
    </div>
  )
}
