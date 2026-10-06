import { useEffect, useRef, useState } from 'react'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/* Smoothly interpolated live value. Target re-randomizes on an interval;
   display eases toward it on a fast tick so readouts glide instead of jump.
   Static when reduce is true. */
export function useLiveValue({ base, jitter = 1, min = -Infinity, max = Infinity, interval = 1600, ease = 0.18, reduce = false }) {
  const [display, setDisplay] = useState(base)
  const target = useRef(base)
  useEffect(() => {
    if (reduce) {
      target.current = base
      setDisplay(base)
      return
    }
    const drift = setInterval(() => {
      target.current = clamp(target.current + (Math.random() - 0.5) * jitter, min, max)
    }, interval)
    const glide = setInterval(() => {
      setDisplay((d) => {
        const n = d + (target.current - d) * ease
        return Math.abs(n - target.current) < 0.004 ? target.current : n
      })
    }, 80)
    return () => {
      clearInterval(drift)
      clearInterval(glide)
    }
  }, [base, jitter, min, max, interval, ease, reduce])
  return display
}

/* Cycles 0..length-1 on an interval. Frozen at 0 when reduce is true. */
export function useCycle(length, interval = 2000, reduce = false) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (reduce || length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % length), interval)
    return () => clearInterval(t)
  }, [length, interval, reduce])
  return idx
}

/* Periodic anomaly flag: true for `duration` ms every `period` ms.
   Always false when reduce is true. */
export function useAnomaly(period = 9000, duration = 2600, reduce = false) {
  const [hot, setHot] = useState(false)
  useEffect(() => {
    if (reduce) return
    let off
    const on = setInterval(() => {
      setHot(true)
      off = setTimeout(() => setHot(false), duration)
    }, period)
    return () => {
      clearInterval(on)
      clearTimeout(off)
    }
  }, [period, duration, reduce])
  return hot
}

/* Crossfade controller for swapping visualizations.
   Returns [shownId, phase] where phase is 'in' | 'out'.
   Swap happens 220ms after the id changes; instant when reduce. */
export function useSwap(id, reduce = false) {
  const [shown, setShown] = useState(id)
  const [phase, setPhase] = useState('in')
  useEffect(() => {
    if (id === shown) return
    if (reduce) {
      setShown(id)
      setPhase('in')
      return
    }
    setPhase('out')
    const t = setTimeout(() => {
      setShown(id)
      setPhase('in')
    }, 220)
    return () => clearTimeout(t)
  }, [id, shown, reduce])
  return [shown, phase]
}
