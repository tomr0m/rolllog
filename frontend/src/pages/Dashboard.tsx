import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import type { Belt } from '../lib/types'

const BELT_COLORS: Record<Belt, string> = {
  WHITE: '#F5F5F5',
  BLUE: '#1E40AF',
  PURPLE: '#7C3AED',
  BROWN: '#78350F',
  BLACK: '#111111',
}

function BeltBadge({ belt, stripes, label }: { belt: Belt; stripes: number; label: string }) {
  const color = BELT_COLORS[belt]
  const isWhite = belt === 'WHITE'

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">{label}</div>
      <div
        className="rounded-xl h-12 flex items-center justify-between px-4 mb-3"
        style={{ backgroundColor: color }}
      >
        <span className="font-semibold text-sm" style={{ color: isWhite ? '#1a1a1a' : '#fff' }}>
          {belt.charAt(0) + belt.slice(1).toLowerCase()} Belt
        </span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: i < stripes ? (isWhite ? '#1a1a1a' : '#fff') : 'transparent',
                borderColor: isWhite ? '#9ca3af' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>
      <div className="text-neutral-400 text-sm">
        {stripes} stripe{stripes !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between py-6 mb-8"
        >
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Roll<span className="text-neutral-400">Log</span>
          </h1>
          <Button variant="ghost" onClick={handleLogout} className="text-sm">
            Logout
          </Button>
        </motion.header>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-semibold text-white mb-1">
            Welcome back, {user.name.split(' ')[0]}
          </h2>
          <p className="text-neutral-400">Ready to roll?</p>
        </motion.div>

        {/* Belt Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
        >
          {user.practices_gi && user.gi_belt && (
            <BeltBadge belt={user.gi_belt} stripes={user.gi_stripes} label="Gi" />
          )}
          {user.practices_no_gi && user.no_gi_belt && (
            <BeltBadge belt={user.no_gi_belt} stripes={user.no_gi_stripes} label="No-Gi" />
          )}
        </motion.div>

        {/* Phase 2 placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border border-dashed border-neutral-800 rounded-2xl p-10 text-center"
        >
          <div className="text-4xl mb-3">🥋</div>
          <h3 className="text-white font-medium mb-2">Training sessions coming in Phase 2</h3>
          <p className="text-neutral-500 text-sm max-w-xs mx-auto">
            Log sessions, track techniques, and watch your game level up.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
