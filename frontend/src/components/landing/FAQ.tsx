import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { SectionHeader } from './SectionHeader'

const faqs = [
  { question: '¿Cuánto tarda una implementación?', answer: 'El tiempo depende del alcance, los procesos y las conexiones necesarias. Se define una ruta de trabajo después del diagnóstico.' },
  { question: '¿Necesito cambiar mi equipo?', answer: 'No. El agente se configura para apoyar tareas y conversaciones definidas; tu equipo conserva el control y atiende los casos que requieren criterio humano.' },
  { question: '¿Puede atender por WhatsApp?', answer: 'WhatsApp puede evaluarse como punto de conexión. Su disponibilidad depende de los requisitos del negocio y de la integración técnica correspondiente.' },
  { question: '¿Puedo usarlo en mi web?', answer: 'La web puede ser un punto de entrada a evaluar. El alcance y la forma de conexión se acuerdan según tu sitio y tus necesidades.' },
  { question: '¿Cómo se personaliza para mi negocio?', answer: 'Se diseña según tus objetivos, FAQs, tono de marca, horarios, disponibilidad y procesos reales.' },
  { question: '¿Qué tipo de tareas puede automatizar?', answer: 'Puede configurarse para apoyar consultas, pedidos, reservas, cotizaciones, seguimiento y soporte, según los procesos y sistemas disponibles.' },
  { question: '¿Puede distinguir entre cliente y caso complejo?', answer: 'Sí. El flujo puede detectar cuándo requiere intervención humana y derivar la conversación al equipo adecuado.' },
  { question: '¿Qué pasa con los datos?', answer: 'Se pueden tomar decisiones de almacenamiento y privacidad según la política de la empresa y el canal de uso.' },
  { question: '¿Necesito una integración previa?', answer: 'No necesariamente. La posibilidad de conectar catálogos, agendas u otros sistemas se evalúa para cada operación y depende de su compatibilidad.' },
  { question: '¿Me sirve si tengo pocas ventas?', answer: 'Sí. Incluso con un volumen moderado, un chatbot ayuda a responder más rápido y mejorar la tasa de conversión.' },
  { question: '¿Es difícil mantenerlo?', answer: 'No. La actualización de información y mejoras se hacen con supervisión y ajustes periódicos.' },
  { question: '¿Qué es lo siguiente?', answer: 'Lo ideal es hacer un diagnóstico para definir el flujo más valioso y luego empezar con un piloto manejable.' },
]

export function FAQ() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:px-6">
      <SectionHeader
        eyebrow="FAQ"
        title="Preguntas frecuentes sobre VEKTOR AI"
        description="Estas respuestas te ayudan a entender cómo funciona la estrategia y qué esperar en una primera implementación."
        align="center"
      />

      <Accordion.Root type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <Accordion.Item key={faq.question} value={`item-${index}`} className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4">
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-white">
                <span>{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pb-4 text-sm leading-7 text-slate-300">{faq.answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
