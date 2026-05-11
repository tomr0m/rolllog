import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const DISPLAY = 'var(--font-display)'
const SERIF = 'var(--font-serif)'
const INK = '#1A1A1A'
const OXBLOOD = '#8B1A1A'
const MUTED = '#737373'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {label && (
          <label style={{ fontFamily: DISPLAY, fontSize: '0.62rem', letterSpacing: '0.25em', color: MUTED }}>
            {label.toUpperCase()}
          </label>
        )}
        <input
          ref={ref}
          onFocus={e => { setFocused(true); onFocus?.(e) }}
          onBlur={e => { setFocused(false); onBlur?.(e) }}
          style={{
            fontFamily: SERIF,
            fontSize: '1.05rem',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${error ? OXBLOOD : focused ? OXBLOOD : INK}`,
            color: INK,
            outline: 'none',
            padding: '4px 0 6px',
            width: '100%',
            transition: 'border-color 0.22s ease',
            colorScheme: 'light',
            ...style,
          }}
          className={`placeholder:text-[#737373]/50 disabled:opacity-50 ${className}`}
          {...props}
        />
        {error && (
          <p style={{ fontSize: '0.65rem', color: OXBLOOD, fontFamily: SERIF, fontStyle: 'italic' }}>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
