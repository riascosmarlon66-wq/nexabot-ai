import { ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react'
import { companyConfig } from '../../lib/config'
import { Button } from '../ui/button'
import { ChatPlay } from './ChatPlay'
import { Reveal } from './Reveal'
import { RobotAssistant } from './RobotAssistant'
import { Stats } from './Stats'

const exampleMessages: {
  sender: 'bot' | 'user'
  text: string
  time?: string
}[] = [
  { sender: 'bot', text: '¡Hola! Soy el agente de tu negocio. ¿Qué necesitas hoy?', time: '9:42' },
  { sender: 'user', text: 'Necesitamos atender más leads sin sumar personal.', time: '9:42' },
  { sender: 'bot', text: 'Puedo ayudarte a responder consultas y organizar oportunidades.', time: '9:43' },
  { sender: 'user', text: '¿Cuánto tardaría en implementarse?', time: '9:43' },
]

export function Hero() {
  return (
    <section id="inicio" className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-6 lg:pb-24 lg:pt-16">
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-12">
        <Reveal className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/90">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-gradient">IA</span> para <span className="text-gradient">ventas</span> y atención
          </div>

          <div className="space-y-5">
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-white md:text-6xl">
              Un agente de IA. Todo tu negocio en movimiento.
            </h1>
            <p className="max-w-xl text-lg text-slate-300 md:text-xl">
              Con VEKTOR AI tu empresa tiene un solo agente inteligente, personalizado con tus procesos y conectado a los canales que necesitas. Atiende, organiza y convierte conversaciones en oportunidades.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="gradient" size="xl" asChild>
              <a href="#contacto">
                Solicitar demostración <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline-light" size="xl" asChild>
              <a href={companyConfig.contact.whatsappUrl} target="_blank" rel="noreferrer">
                <Play className="h-4 w-4" /> Hablar con un asesor
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {['Un agente por empresa', 'Tu equipo conserva el control', 'Canales según integración'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative min-w-0">
          <div className="hero-visual vektor-hero-visual">
            <RobotAssistant />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mx-auto mt-10 w-full max-w-xl">
        <ChatPlay title="VEKTOR AI en acción" messages={exampleMessages} />
      </Reveal>

      <Stats />
    </section>
  )
}
