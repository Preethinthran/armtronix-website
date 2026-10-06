import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import './ScrollProgress.css'

export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  if (reduce) return null
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
