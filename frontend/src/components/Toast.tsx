import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const OXBLOOD = '#8B1A1A'
const DISPLAY = 'var(--font-display)'

interface ToastProps {
  message: string
  visible: boolean
  onHide: () => void
}

export default function Toast({ message, visible, onHide }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 2200)
      return () => clearTimeout(timer)
    }
  }, [visible, onHide])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1.5rem',
            fontFamily: DISPLAY,
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            color: OXBLOOD,
            background: '#FAF6EF',
            border: `1px solid ${OXBLOOD}`,
            padding: '0.45rem 1rem',
            zIndex: 200,
            pointerEvents: 'none',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
