import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, MessageCircle, Send, Sparkles } from 'lucide-react'
import { sendMessageToAgent } from '../../services/agent.service'
import { Button } from '../../components/ui/button'
import { Reveal } from '../../components/landing/Reveal'
import { SectionHeader } from '../../components/landing/SectionHeader'
import {
  DEMO_CHANNELS,
  DEMO_COMPLETION_MESSAGE,
  DEMO_QUESTIONS,
} from './demo.constants'
import type { DemoMessage, DemoStep, LeadContext } from './demo.types'

const initialMessages: DemoMessage[] = [
  {
    sender: 'nova',
    text: 'Hola, soy Nova. Te haré tres preguntas breves para conocer tu negocio.',
  },
  { sender: 'nova', text: DEMO_QUESTIONS.sector },
]

const nextStep: Record<Exclude<DemoStep, 'complete'>, DemoStep> = {
  sector: 'process',
  process: 'channel',
  channel: 'complete',
}

export function DemoAgent({
  onContinue,
}: {
  onContinue: (context: LeadContext) => void
}) {
  const [step, setStep] = useState<DemoStep>('sector')
  const [answers, setAnswers] = useState<Partial<LeadContext>>({})
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [agentError, setAgentError] = useState('')
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const submitAnswer = async (answer: string) => {
    if (step === 'complete' || isTyping || !answer.trim()) return

    const field = step
    const currentAnswers = { ...answers, [field]: answer.trim() }
    setAnswers(currentAnswers)
    setMessages((current) => [...current, { sender: 'visitor', text: answer.trim() }])
    setDraft('')
    setAgentError('')
    setIsTyping(true)

    try {
      const agentContext = [
        `Esta es la respuesta ${Object.keys(currentAnswers).length} de 3 del visitante.`,
        `Tipo de empresa: ${currentAnswers.sector ?? ''}`,
        `Proceso a automatizar: ${currentAnswers.process ?? ''}`,
        `Canal elegido: ${currentAnswers.channel ?? ''}`,
        `Respuesta más reciente: ${answer.trim()}`,
        'Responde brevemente, no hagas preguntas adicionales. La interfaz controla las siguientes preguntas.',
      ].join('\n')
      const response = await sendMessageToAgent(agentContext, 'demo')
      setMessages((current) => [...current, { sender: 'nova', text: response.response }])
    } catch (error) {
      console.error('No se pudo conectar con Agent Core:', error)
      setAgentError('No se pudo conectar con Nova. Puedes continuar con el flujo guiado.')
    } finally {
      const followingStep = nextStep[field]
      setStep(followingStep)
      if (followingStep === 'complete') {
        setMessages((current) => [
          ...current,
          { sender: 'nova', text: DEMO_COMPLETION_MESSAGE },
        ])
      } else {
        setMessages((current) => [
          ...current,
          { sender: 'nova', text: DEMO_QUESTIONS[followingStep] },
        ])
      }
      setIsTyping(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitAnswer(draft)
  }

  const handleContinue = () => {
    if (!answers.sector || !answers.process || !answers.channel) return
    onContinue({
      sector: answers.sector,
      process: answers.process,
      channel: answers.channel,
    })
    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isComplete = step === 'complete'

  return (
    <section id="demo" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Demo interactiva"
          title="Conoce a Nova, tu agente comercial"
          description="Responde tres preguntas para orientar una solución a las necesidades de tu empresa."
          align="center"
        />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="premium-card mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-slate-950/40 p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 px-1 pb-4">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Nova</p>
                <p className="text-xs text-slate-400">Agente comercial</p>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {isComplete ? 'Completado' : `Pregunta ${Object.keys(answers).length + 1} de 3`}
            </span>
          </div>

          <div ref={messageListRef} className="max-h-[420px] space-y-3 overflow-y-auto px-1" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex ${message.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    message.sender === 'visitor'
                      ? 'bg-gradient-primary text-white'
                      : 'border border-white/10 bg-white/5 text-slate-200',
                  ].join(' ')}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping ? (
              <div className="flex justify-start" aria-label="Nova está respondiendo">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="h-2 w-2 animate-typing rounded-full bg-slate-300" />
                  <span className="h-2 w-2 animate-typing rounded-full bg-slate-300 [animation-delay:160ms]" />
                  <span className="h-2 w-2 animate-typing rounded-full bg-slate-300 [animation-delay:320ms]" />
                </div>
              </div>
            ) : null}
          </div>

          {agentError ? (
            <p className="mt-4 text-sm text-amber-300" role="status">{agentError}</p>
          ) : null}

          {!isComplete ? (
            step === 'channel' ? (
              <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {DEMO_CHANNELS.map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    disabled={isTyping}
                    onClick={() => void submitAnswer(channel)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 transition hover:border-primary/50 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {channel}
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                <label className="sr-only" htmlFor="nova-answer">Tu respuesta</label>
                <input
                  id="nova-answer"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={step === 'sector' ? 'Escribe el tipo de negocio' : 'Describe el proceso'}
                  disabled={isTyping}
                  required
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isTyping || !draft.trim()}
                  aria-label="Enviar respuesta"
                  className="rounded-xl bg-gradient-primary p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )
          ) : (
            <div className="mt-5 flex justify-center border-t border-white/10 pt-5">
              <Button variant="gradient" onClick={handleContinue}>
                <MessageCircle className="h-4 w-4" />
                Continuar con el proceso
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
