import { ArrowRight, CalendarDays, ClipboardList, FileText, Headset, HeartHandshake, MessageSquareText, PackageCheck, ReceiptText, RotateCcw, TicketCheck } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const actions = [
  {
    icon: ClipboardList,
    title: 'Pedidos',
    text: 'Puede confirmar solicitudes y registrar pedidos si se conecta con el sistema del negocio.',
  },
  {
    icon: CalendarDays,
    title: 'Reservas y citas',
    text: 'Puede consultar disponibilidad y coordinar horarios con las herramientas acordadas.',
  },
  {
    icon: FileText,
    title: 'Cotizaciones',
    text: 'Recopila requisitos y prepara un resumen siguiendo las reglas definidas por tu empresa.',
  },
  {
    icon: Headset,
    title: 'Soporte y postventa',
    text: 'Orienta consultas y puede derivar solicitudes, garantías o casos a una persona.',
  },
  {
    icon: TicketCheck,
    title: 'Quejas y reclamos',
    text: 'Puede clasificar el motivo, seguir protocolos y escalar el caso al equipo responsable.',
  },
  {
    icon: PackageCheck,
    title: 'Pedidos y entregas',
    text: 'Con sistemas compatibles, puede ayudar a consultar el estado de una solicitud o envío.',
  },
  {
    icon: ReceiptText,
    title: 'Información comercial',
    text: 'Responde sobre productos, servicios, políticas y condiciones que definas.',
  },
  {
    icon: RotateCcw,
    title: 'Seguimiento',
    text: 'Puede apoyar recordatorios, renovaciones y seguimiento comercial configurado.',
  },
  {
    icon: HeartHandshake,
    title: 'Fidelización',
    text: 'Ayuda a mantener la conversación con recomendaciones y contactos oportunos.',
  },
  {
    icon: MessageSquareText,
    title: 'Atención inicial',
    text: 'Entiende la consulta, recoge datos relevantes y dirige cada caso al siguiente paso.',
  },
]

export function Solutions() {
  return (
    <section id="soluciones" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Soluciones"
          title="No solo conversa. Puede ejecutar procesos."
          description="Un agente conectado a tus datos, reglas y sistemas puede llevar cada conversación hacia una acción concreta. Las capacidades dependen de la configuración e integración de tu empresa."
          align="center"
        />
      </Reveal>

      <div className="mb-8 grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-4 sm:items-center md:p-6">
        {[
          { label: 'Cliente', value: 'Explica lo que necesita' },
          { label: 'Agente IA', value: 'Entiende y coordina' },
          { label: 'Datos + reglas', value: 'Información del negocio' },
          { label: 'Acción', value: 'Pedido · cita · ticket' },
        ].map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">0{index + 1}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white">{step.label}</p>
              <p className="mt-1 text-xs text-slate-400">{step.value}</p>
            </div>
            {index < 3 ? <ArrowRight className="ml-auto hidden h-4 w-4 text-slate-600 sm:block" /> : null}
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {actions.map((action, index) => (
          <Reveal key={action.title} delay={index * 0.035}>
            <div className="premium-card h-full rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-primary/25">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{action.title}</h3>
              <p className="text-xs leading-5 text-slate-400">{action.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
