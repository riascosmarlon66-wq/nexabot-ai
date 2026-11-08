import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

export function RobotAssistant() {
  const reduceMotion = useReducedMotion()
  const [greeting, setGreeting] = useState(false)
  const greetingTimeout = useRef<number | null>(null)

  const triggerGreeting = useCallback(() => {
    if (reduceMotion || greetingTimeout.current !== null) return

    setGreeting(true)
    greetingTimeout.current = window.setTimeout(() => {
      setGreeting(false)
      greetingTimeout.current = null
    }, 2200)
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return

    const greetingInterval = window.setInterval(triggerGreeting, 12000)
    return () => {
      window.clearInterval(greetingInterval)
      if (greetingTimeout.current !== null) {
        window.clearTimeout(greetingTimeout.current)
        greetingTimeout.current = null
      }
    }
  }, [reduceMotion, triggerGreeting])

  return (
    <div className="hero-mascot vektor-mascot">
      <div className="vektor-orbit vektor-orbit-one" aria-hidden="true" />
      <div className="vektor-orbit vektor-orbit-two" aria-hidden="true" />
      <div className="vektor-star vektor-star-one" aria-hidden="true" />
      <div className="vektor-star vektor-star-two" aria-hidden="true" />
      {/* Burbuja */}
      <motion.div
        className="mascot-message"
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -4, 0],
              }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="mascot-message-dot" />
        {greeting ? "¡Hola! Soy Vektor 👋" : "Tu agente está listo"}
      </motion.div>

      {/* Glow detrás del robot */}
      <motion.div
        aria-hidden="true"
        className="robot-glow"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.07, 1],
                opacity: [0.35, 0.55, 0.35],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Robot nuevo */}
      <motion.button
        type="button"
        className="robot-interactive"
        aria-label="Saludar a Vektor, el asistente de inteligencia artificial"
        onClick={triggerGreeting}
        animate={
          reduceMotion
            ? undefined
            : greeting
              ? {
                  y: [0, -6, -2, -5, 0],
                  rotate: [0, -2, 2, -1, 0],
                  scale: [1, 1.01, 1, 1.01, 1],
                }
              : {
                  y: [0, -18, 0],
                  rotate: [0, 2, -2, 0],
                }
        }
        whileHover={
          reduceMotion
            ? undefined
            : {
                scale: 1.035,
              }
        }
        whileTap={
          reduceMotion
            ? undefined
            : {
                scale: 0.97,
              }
        }
        transition={
          greeting
            ? {
                duration: 1.4,
                ease: "easeInOut",
              }
            : {
                y: {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 5.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        <img
          src="/ai-robot.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="mascot-robot"
        />
        <span className="robot-eye-blink robot-eye-blink-left" aria-hidden="true" />
        <span className="robot-eye-blink robot-eye-blink-right" aria-hidden="true" />
      </motion.button>

      {/* Estado inferior */}
      <motion.div
        className="robot-status"
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, 3, 0],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="robot-status-icon">✓</span>

        <span>
          <strong>VEKTOR AI activo</strong>
          <small>Pregunta, agenda o automatiza.</small>
        </span>
      </motion.div>
    </div>
  );
}