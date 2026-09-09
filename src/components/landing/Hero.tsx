import { ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react'
import { companyConfig } from '../../lib/config'
import { Button } from '../ui/button'
import { ChatPlay } from './ChatPlay'
import { Reveal } from './Reveal'
import { Stats } from './Stats'

const exampleMessages = [
  { sender: 'bot', text: '¡Hola! 😊 Estoy aquí para ayudarte a responder clientes y cerrar más ventas.', time: '9:42' },
  { sender: 'user', text: 'Necesitamos atender más leads sin sumar personal.', time: '9:42' },
  { sender: 'bot', text: 'Perfecto. Podemos automatizar atención y reservas en WhatsApp, web y redes.', time: '9:43' },
  { sender: 'user', text: '¿Cuánto tardaría en implementarse?', time: '9:43' },
]

export function Hero() {
  return (
    <section id="inicio" className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-6 lg:pb-24 lg:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/90">
            <Sparkles className="h-3.5 w-3.5" />
            IA para ventas y atención
          </div>

          <div className="space-y-5">
            <h1 className="max-w-xl font-display text-4xl font-semibold leading-[0.95] tracking-[-0.08em] text-white md:text-6xl">
              Tu empresa puede atender a todos sin perder clientes.
            </h1>
            <p className="max-w-xl text-lg text-slate-300 md:text-xl">
              {companyConfig.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="gradient" size="xl" asChild>
              <a href="#contacto">
                Solicitar demostración <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline-light" size="xl" asChild>
              <a href={companyConfig.whatsappUrl} target="_blank" rel="noreferrer">
                <Play className="h-4 w-4" /> Hablar con un asesor
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {['Atención 24/7', 'Cobertura múltiple', 'Integración rápida'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-2xl" />
          <div className="relative">
            <ChatPlay title="Asistente de ventas" messages={exampleMessages} />
          </div>
        </Reveal>
      </div>

      <Stats />
    </section>
  )
}
