import { ArrowRight, BarChart3, Briefcase, Building2, Clock3, MessageSquareText, TrendingUp } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const benefits = [
  {
    icon: MessageSquareText,
    title: 'Ventas más consistentes',
    text: 'Cada consulta recibe respuesta inmediata, sin depender de una sola persona.',
  },
  {
    icon: Clock3,
    title: 'Atención sin límite de horario',
    text: 'Cubre citas, dudas y seguimiento incluso fuera del horario comercial.',
  },
  {
    icon: BarChart3,
    title: 'Ahorro operativo real',
    text: 'Menos trabajo manual y menos presión sobre el equipo en tareas repetitivas.',
  },
  {
    icon: TrendingUp,
    title: 'Velocidad de cierre',
    text: 'El lead recibe la respuesta correcta en segundos y avanza hacia la compra.',
  },
  {
    icon: Building2,
    title: 'Crecimiento escalable',
    text: 'Tu atención crece con la empresa sin contratar más personal para tareas básicas.',
  },
  {
    icon: Briefcase,
    title: 'Información más útil',
    text: 'Recopila datos relevantes sobre dudas, intenciones y oportunidades a partir de cada conversación.',
  },
]

export function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Beneficios"
          title="Todo lo que mejora cuando tu empresa responde antes"
          description="Un chatbot bien diseñado no reemplaza a tu equipo; lo acompaña para que puedan vender mejor y atender con más claridad."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit, index) => (
          <Reveal key={benefit.title} delay={index * 0.06}>
            <div className="group flex h-full flex-col rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 transition hover:border-primary/30 hover:bg-white/[0.06]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{benefit.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{benefit.text}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Ver más <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
