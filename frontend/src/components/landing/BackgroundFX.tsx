import { useEffect, useRef } from 'react'

export function BackgroundFX() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      if (backgroundRef.current) {
        backgroundRef.current.style.setProperty('--scroll-progress', progress.toFixed(3))
        backgroundRef.current.style.setProperty('--scroll-depth', `${Math.round(window.scrollY * 0.08)}px`)
      }
      frame = 0
    }

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={backgroundRef} className="site-background pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="background-ambient absolute inset-0" />
    <div className="background-spotlight absolute inset-0" />
    <div className="scroll-progress" />
    <div className="background-vignette absolute inset-0" />
    </div>
  )
}
