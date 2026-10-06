import { motion, useReducedMotion } from 'framer-motion'

/* Clean scroll reveal: fade + 18px rise, once, no bounce. */
export default function Reveal({ children, delay = 0, y = 18, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div
  if (reduce) return <div className={className}>{children}</div>
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </Tag>
  )
}
