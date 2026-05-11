import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const DISPLAY = 'var(--font-display)'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const isActive = (path: string) => location.pathname === path

  return (
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
      <Link
        to="/dashboard"
        style={{ fontFamily: DISPLAY, fontSize: '0.85rem', letterSpacing: '0.25em', color: INK, textDecoration: 'none' }}
      >
        ROLLLOG
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 2rem)' }}>
        {[
          { to: '/dashboard', label: 'JOURNAL' },
          { to: '/log', label: 'LOG' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontFamily: DISPLAY,
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              color: isActive(to) ? INK : MUTED,
              textDecoration: 'none',
              borderBottom: isActive(to) ? `1px solid ${OXBLOOD}` : '1px solid transparent',
              paddingBottom: '1px',
              transition: 'all 0.15s ease',
            }}
          >
            {label}
          </Link>
        ))}
        <Link
          to="/log/new"
          style={{
            fontFamily: DISPLAY,
            fontSize: '0.68rem',
            letterSpacing: '0.2em',
            color: OXBLOOD,
            textDecoration: 'none',
            borderBottom: isActive('/log/new') ? `1px solid ${OXBLOOD}` : '1px solid transparent',
            paddingBottom: '1px',
          }}
        >
          NEW SESSION
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span
          style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.18em', color: MUTED }}
          className="hidden sm:block"
        >
          {user?.name?.toUpperCase()}
        </span>
        <button
          onClick={handleLogout}
          style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.18em', color: MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          className="hover:text-[#1A1A1A] transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  )
}
