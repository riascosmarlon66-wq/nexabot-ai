import { CalendarDays, HeartHandshake, MessageSquareText, ShoppingBag, Sparkles, Tags } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const benefits = [
  {
    icon: MessageSquareText,
    title: 'Entiende',
    text: 'Comprende qué necesita cada cliente y hace las preguntas adecuadas.',
  },
  {
    icon: Sparkles,
    title: 'Recomienda',
    text: 'Puede consultar información de tus productos y servicios para orientar opciones.',
  },
  {
    icon: Tags,
    title: 'Cotiza',
    text: 'Se configura para recopilar datos y preparar cotizaciones con tus reglas.',
  },
  {
    icon: ShoppingBag,
    title: 'Vende',
    text: 'Acompaña la decisión con respuestas claras sobre productos y servicios.',
  },
  {
    icon: CalendarDays,
    title: 'Agenda',
    text: 'Puede gestionar citas o reservas según disponibilidad y sistemas conectados.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompaña',
    text: 'Apoya consultas posteriores a la compra y deriva los casos que requieren a tu equipo.',
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Beneficios"
          title="De una conversación a una acción útil"
          description="Configura un mismo agente para entender, recomendar y ayudar a tus clientes, con capacidades e integraciones definidas para tu operación."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit, index) => (
          <Reveal key={benefit.title} delay={index * 0.06}>
            <div className="premium-card group flex h-full flex-col rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 transition hover:border-primary/30 hover:bg-white/[0.06]">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{benefit.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{benefit.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
