import { useEffect, useRef } from 'react'

export function BackgroundFX() {
  const spotlightRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    let frame = 0
    let x = window.innerWidth * 0.5
    let y = window.innerHeight * 0.25

    const renderSpotlight = () => {
      frame = 0
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spotlight-x', `${x}px`)
        spotlightRef.current.style.setProperty('--spotlight-y', `${y}px`)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (!frame) frame = requestAnimationFrame(renderSpotlight)
    }

    if (mediaQuery.matches) window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    let frame = 0

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      if (backgroundRef.current) {
        backgroundRef.current.style.setProperty('--scroll-progress', progress.toFixed(3))
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
      <div className="scroll-progress" />
      <div ref={spotlightRef} className="background-spotlight absolute inset-0" />
      <div className="background-aurora background-aurora-blue absolute inset-x-[-12%] top-[-10%] h-[42rem]" />
      <div className="background-aurora background-aurora-violet absolute inset-x-[-10%] top-[30%] h-[48rem]" />
      <div className="background-aurora background-aurora-cyan absolute inset-x-[-15%] bottom-[-12%] h-[36rem]" />
      <div className="background-aurora background-aurora-teal absolute right-[-18%] top-[56%] h-[32rem] w-[70%]" />
      <div className="background-halo background-halo-one absolute left-[-14%] top-[8%] h-[34rem] w-[34rem] rounded-full" />
      <div className="background-halo background-halo-two absolute right-[-12%] top-[30%] h-[38rem] w-[38rem] rounded-full" />
      <div className="background-halo background-halo-three absolute bottom-[-18%] left-[28%] h-[32rem] w-[32rem] rounded-full" />
      <div className="background-particles absolute inset-0" />
      <div className="background-grid absolute inset-0" />
      <div className="background-vignette absolute inset-0" />
    </div>
  )
}
