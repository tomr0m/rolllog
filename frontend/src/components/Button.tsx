import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300',
    secondary: 'bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 active:bg-neutral-600',
    ghost: 'text-neutral-400 hover:text-white hover:bg-neutral-800',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
