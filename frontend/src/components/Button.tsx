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
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-px active:translate-y-0 active:bg-red-800 shadow-[0_4px_24px_rgba(220,38,38,0.25)]',
    secondary:
      'bg-transparent text-red-500 border-2 border-red-600 hover:bg-red-600 hover:text-white',
    ghost:
      'bg-transparent text-neutral-400 hover:text-red-500',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
