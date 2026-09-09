import { useState } from 'react'
import { ArrowRight, Building2, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const sectors = {
  retail: {
    name: 'Retail',
    messages: [
      { sender: 'bot', text: '¡Hola! ¿Necesitas saber si tenemos disponibilidad para hoy?', time: '09:12' },
      { sender: 'user', text: 'Sí, quiero ver opciones de entrega para mi barrio.', time: '09:12' },
      { sender: 'bot', text: 'Perfecto, te muestro los horarios y te ayudo a confirmar tu pedido.', time: '09:13' },
    ],
  },
  health: {
    name: 'Salud',
    messages: [
      { sender: 'bot', text: 'Hola, ¿deseas agendar una cita o confirmar tus datos?', time: '10:20' },
      { sender: 'user', text: 'Necesito agendar una consulta para el jueves.', time: '10:20' },
      { sender: 'bot', text: 'Listo, te puedo ofrecer la próxima disponibilidad y recordar la cita por WhatsApp.', time: '10:21' },
    ],
  },
  realty: {
    name: 'Inmobiliaria',
    messages: [
      { sender: 'bot', text: 'Estoy listo para ayudarte a encontrar propiedades según tu presupuesto.', time: '12:05' },
      { sender: 'user', text: 'Busco un departamento en zona céntrica con 2 recámaras.', time: '12:05' },
      { sender: 'bot', text: 'Te envío las opciones más cercanas y te ayudo a agendar una visita.', time: '12:06' },
    ],
  },
}

export function Demo() {
  const [active, setActive] = useState<keyof typeof sectors>('retail')
  const current = sectors[active]

  return (
    <section id="demo" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Demo interactiva"
          title="Prueba cómo responde NexaBot en tu tipo de negocio"
          description="Cada sector tiene un flujo distinto. Te mostramos cómo se adapta a la realidad de la operación comercial."
          align="center"
        />
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-4 md:p-6">
            <div className="mb-5 flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sector</p>
                <h3 className="font-display text-2xl">Selecciona</h3>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(sectors).map(([key, sector]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key as keyof typeof sectors)}
                  className={[
                    'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                    active === key
                      ? 'border-primary/40 bg-primary/10 text-white'
                      : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20',
                  ].join(' ')}
                >
                  <span className="font-medium">{sector.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[30px] border border-white/10 bg-slate-950/40 p-4 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Flujo {current.name}</span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">Respuesta inteligente</span>
            </div>

            <div className="space-y-3">
              {current.messages.map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={[
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                      message.sender === 'user'
                        ? 'bg-gradient-primary text-white'
                        : 'border border-white/10 bg-white/5 text-slate-200',
                    ].join(' ')}
                  >
                    {message.text}
                    <div className={`mt-1 text-[10px] ${message.sender === 'user' ? 'text-blue-100/80' : 'text-slate-400'}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="gradient" asChild>
                <a href="#contacto">
                  Quiero probarlo en mi empresa <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
