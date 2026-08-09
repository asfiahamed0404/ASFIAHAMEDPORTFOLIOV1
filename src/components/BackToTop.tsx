import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function BackToTop() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = Boolean(useReducedMotion())

  useEffect(() => {
    let animationFrame: number | null = null

    const updateProgress = () => {
      animationFrame = null
      const scrollTop = window.scrollY
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollableHeight > 0
        ? Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100))
        : 0

      setProgress((current) => Math.abs(current - nextProgress) < 0.1 ? current : nextProgress)
      setVisible((current) => {
        const nextVisible = scrollTop > 300
        return current === nextVisible ? current : nextVisible
      })
    }

    const requestUpdate = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.button
          type="button"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.82, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 10 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          onClick={() => window.scrollTo({
            top: 0,
            behavior: shouldReduceMotion ? 'auto' : 'smooth',
          })}
          aria-label="Back to top"
          className="pp-back-to-top"
        >
          <svg className="pp-back-to-top-progress" viewBox="0 0 48 48" aria-hidden="true">
            <circle className="pp-back-to-top-track" cx="24" cy="24" r={RADIUS} />
            <circle
              className="pp-back-to-top-value"
              cx="24"
              cy="24"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <ArrowUp size={18} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
