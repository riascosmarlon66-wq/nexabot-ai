import { ArrowRight, MessageSquareText, ShieldCheck, Sparkles, Store, Ticket } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const solutions = [
  {
    icon: MessageSquareText,
    title: 'WhatsApp Business',
    text: 'Respuestas automáticas, ventas y seguimiento en el canal preferido por tus clientes.',
    cta: 'Quiero un chatbot para WhatsApp',
  },
  {
    icon: Store,
    title: 'Bot de ventas',
    text: 'Guía al cliente, filtra leads y convierte dudas en propuestas más rápido.',
    cta: 'Quiero vender más',
  },
  {
    icon: ShieldCheck,
    title: 'Atención al cliente',
    text: 'Resuelve dudas frecuentes, entrega información y deriva casos complejos al humano.',
    cta: 'Necesito atender mejor',
  },
  {
    icon: Ticket,
    title: 'Reservas y agendado',
    text: 'Agenda citas, confirma disponibilidad y reduce la fricción en cada solicitud.',
    cta: 'Quiero automatizar reservas',
  },
  {
    icon: Sparkles,
    title: 'Web y landing page',
    text: 'Capta más leads desde la página y responde de forma inmediata sin perder oportunidades.',
    cta: 'Quiero captar más leads',
  },
]

export function Solutions() {
  return (
    <section id="soluciones" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Soluciones"
          title="Un chatbot para cada etapa de tu operación"
          description="Crea experiencias útiles para ventas, atención y agendado, sin complicarte la operación ni invertir en más personal."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {solutions.map((solution, index) => (
          <Reveal key={solution.title} delay={index * 0.05}>
            <div className="flex h-full flex-col rounded-[30px] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.05]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <solution.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{solution.title}</h3>
              <p className="mb-5 text-sm leading-6 text-slate-300">{solution.text}</p>
              <Button variant="outline-light" asChild className="mt-auto">
                <a href="#contacto">{solution.cta} <ArrowRight className="h-4 w-4" /></a>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
