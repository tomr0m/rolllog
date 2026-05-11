import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  heading: string
  tagline?: string
}

export default function AuthLayout({ children, heading, tagline }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo block */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl text-white tracking-widest leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ROLLLOG
          </h1>
          {/* Red slash underline */}
          <div className="relative mt-2 mx-auto w-32 h-0.5 bg-red-600">
            <div className="absolute -right-3 -top-1 w-3 h-3 bg-red-600 skew-x-12" />
          </div>
          {tagline && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
              {tagline}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-[#1F1F1F] border border-[#262626] border-t-4 border-t-red-600 p-8">
          <h2
            className="text-3xl text-white tracking-wider mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {heading}
          </h2>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
