import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full bg-[#111111] border ${
          error ? 'border-red-600' : 'border-[#262626]'
        } rounded-sm px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
