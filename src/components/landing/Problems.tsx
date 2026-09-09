import { AlertCircle, ArrowUpRight, BriefcaseBusiness, Clock3, MessageSquareText, ShieldCheck, Users } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const problems = [
  { icon: MessageSquareText, title: 'Mensajes perdidos', text: 'Las preguntas sin respuesta hacen que el cliente se vaya a la competencia.' },
  { icon: Clock3, title: 'Tiempo de espera', text: 'Los clientes esperan minutos o horas y se desmotivan antes de comprar.' },
  { icon: Users, title: 'Ventas caídas', text: 'Sin atención inmediata, cada lead valioso se convierte en una oportunidad perdida.' },
  { icon: BriefcaseBusiness, title: 'Operación manual', text: 'Tu equipo dedica horas a repetir respuestas que podrían automatizarse.' },
  { icon: ShieldCheck, title: 'Falta de control', text: 'No sabes cuál es el porcentaje real de conversaciones que se resuelven.' },
  { icon: AlertCircle, title: 'Competencia más rápida', text: 'Tus clientes pagan la espera con un clic en otra empresa.' },
]

export function Problems() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Problemas reales"
          title="¿Cuántos clientes está perdiendo tu empresa hoy?"
          description="Muchas empresas pierden ventas porque la atención no sigue el ritmo de las conversaciones, sobre todo en WhatsApp, web y redes sociales."
          align="center"
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {problems.map((problem, index) => (
          <Reveal key={problem.title} delay={index * 0.06}>
            <div className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.06]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/25 text-primary">
                <problem.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{problem.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{problem.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 rounded-[28px] border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 p-6 text-center md:p-8">
          <p className="text-lg text-slate-100 md:text-2xl">
            Cada minuto sin respuesta es un cliente que sigue esperando y una venta que se aleja.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Impacto directo en ventas <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
