import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import type { Belt } from '../lib/types'

const BELT_COLORS: Record<Belt, { bg: string; text: string }> = {
  WHITE:  { bg: '#F0F0F0', text: '#1a1a1a' },
  BLUE:   { bg: '#1E40AF', text: '#ffffff' },
  PURPLE: { bg: '#7C3AED', text: '#ffffff' },
  BROWN:  { bg: '#78350F', text: '#ffffff' },
  BLACK:  { bg: '#1a1a1a', text: '#ffffff' },
}

function BeltDisplay({ belt, stripes, label }: { belt: Belt; stripes: number; label: string }) {
  const { bg, text } = BELT_COLORS[belt]
  const isBlack = belt === 'BLACK'

  return (
    <div className="border border-[#262626] border-l-4 border-l-red-600 bg-[#141414]">
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{label}</p>
      </div>
      <div
        className={`mx-4 mb-3 flex items-center justify-between px-4 h-14 ${isBlack ? 'border border-[#444]' : ''}`}
        style={{ backgroundColor: bg }}
      >
        <span
          className="text-lg tracking-widest"
          style={{ fontFamily: 'var(--font-display)', color: text }}
        >
          {belt} BELT
        </span>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-9"
              style={{
                backgroundColor: i < stripes ? (belt === 'WHITE' ? '#333' : '#f5f5f5') : 'transparent',
                border: `1.5px solid ${belt === 'WHITE' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)'}`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="text-xs uppercase tracking-wider text-neutral-600 font-medium">
          {stripes} STRIPE{stripes !== 1 ? 'S' : ''}
        </p>
      </div>
    </div>
  )
}

function monthsOnMat(startDate: string | null): string | null {
  if (!startDate) return null
  const start = new Date(startDate)
  const now = new Date()
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (months < 1) return 'LESS THAN A MONTH'
  if (months < 12) return `${months} MONTH${months !== 1 ? 'S' : ''}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}Y ${rem}M` : `${years} YEAR${years !== 1 ? 'S' : ''}`
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const timeOnMat = monthsOnMat(user.start_date)
  const firstName = user.name.split(' ')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b-2 border-red-600 bg-[#0d0d0d] px-6 py-4 flex items-center justify-between"
      >
        <h1
          className="text-3xl text-white tracking-widest"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ROLLLOG
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 hidden sm:block">
            {user.name}
          </span>
          <Button variant="ghost" onClick={handleLogout} className="text-xs">
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Hero welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-600 mb-1">
            Welcome Back
          </p>
          <h2
            className="text-6xl sm:text-7xl text-white leading-none tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {firstName}
          </h2>
          <div className="w-16 h-0.5 bg-red-600 mt-3" />
        </motion.div>

        {/* Fighter card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#141414] border border-[#262626] mb-6"
        >
          {/* Card header */}
          <div className="border-b border-[#262626] px-5 py-3 flex items-center gap-3">
            <div className="w-1 h-6 bg-red-600" />
            <span
              className="text-xl text-white tracking-widest"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              FIGHTER CARD
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Name row */}
            <div className="flex items-baseline gap-4 border-b border-[#1f1f1f] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-0.5">Fighter</p>
                <p
                  className="text-3xl text-white tracking-wide"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {user.name.toUpperCase()}
                </p>
              </div>
              {timeOnMat && (
                <div className="ml-auto text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-0.5">Time on Mat</p>
                  <p
                    className="text-xl text-amber-400 tracking-wide"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {timeOnMat}
                  </p>
                </div>
              )}
            </div>

            {/* Belt displays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.practices_gi && user.gi_belt && (
                <BeltDisplay belt={user.gi_belt} stripes={user.gi_stripes} label="GI" />
              )}
              {user.practices_no_gi && user.no_gi_belt && (
                <BeltDisplay belt={user.no_gi_belt} stripes={user.no_gi_stripes} label="NO-GI" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Phase 2 placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border border-dashed border-[#2a2a2a] p-10 text-center relative overflow-hidden"
        >
          {/* Diagonal accent */}
          <div
            className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-red-600/40 to-transparent"
          />
          <p
            className="text-4xl text-[#222] mb-3 tracking-widest"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TRAINING LOG
          </p>
          <p
            className="text-lg text-neutral-600 tracking-widest mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            COMING IN PHASE 2
          </p>
          <p className="text-xs uppercase tracking-widest text-neutral-700 font-medium">
            Session logging · Techniques · XP · Progression
          </p>
          <p
            className="text-xs text-neutral-700 uppercase tracking-widest mt-4 font-bold"
          >
            Keep Rolling.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
