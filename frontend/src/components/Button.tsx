import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  fullWidth?: boolean
}

const DISPLAY = 'var(--font-display)'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'
const BORDER = '#D4CFC0'

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: '0.78rem',
    letterSpacing: '0.2em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.4 : 1,
    transition: 'all 0.18s ease',
    width: fullWidth ? '100%' : undefined,
    border: 'none',
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: OXBLOOD,
      color: '#fff',
      padding: '0.7rem 1.5rem',
    },
    secondary: {
      background: 'transparent',
      color: OXBLOOD,
      border: `1.5px solid ${OXBLOOD}`,
      padding: '0.65rem 1.5rem',
    },
    ghost: {
      background: 'transparent',
      color: MUTED,
      padding: '0.4rem 0',
      border: `1px solid ${BORDER}`,
      paddingLeft: '1rem',
      paddingRight: '1rem',
    },
  }

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      disabled={disabled || loading}
      className={`hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-transform ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
