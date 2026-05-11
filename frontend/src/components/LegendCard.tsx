import { motion } from 'framer-motion'
import type { ComponentType } from 'react'

interface LegendCardProps {
  name: string
  quote: string
  Silhouette: ComponentType
  index: number
}

export default function LegendCard({ name, quote, Silhouette, index }: LegendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="relative overflow-hidden bg-[#0A0A0A] cursor-default group h-full"
    >
      {/* Silhouette — fills card, centered */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pt-8 pb-28">
        <Silhouette />
      </div>

      {/* Hover: blood red overlay */}
      <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/12 transition-all duration-400 pointer-events-none" />

      {/* Bottom gradient — fades silhouette into text zone */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0A0A0A 60%, transparent)' }}
      />

      {/* Text — name + quote */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        {/* Red bar slides in on hover */}
        <div className="h-0.5 w-0 group-hover:w-full bg-red-600 transition-all duration-300 mb-2" />

        <h3
          className="text-white group-hover:text-red-500 transition-colors duration-200 leading-none mb-1.5"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
            letterSpacing: '0.06em',
          }}
        >
          {name}
        </h3>
        <p
          className="text-[#737373] italic leading-snug"
          style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}
        >
          "{quote}"
        </p>
      </div>
    </motion.div>
  )
}
