import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number | null = null
    const step = (time: number) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.round(target * eased))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    const frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, duration, target])

  return { ref, count }
}
