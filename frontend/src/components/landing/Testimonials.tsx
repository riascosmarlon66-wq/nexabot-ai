import { Quote } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const testimonials = [
  {
    name: 'María López',
    role: 'Directora de atención',
    quote: '“Este contenido es demostrativo y ayuda a visualizar cómo un chatbot puede mejorar la respuesta comercial.”',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Gerente comercial',
    quote: '“La automatización permite responder más rápido, filtrar mejor y vender sin perder oportunidades.”',
  },
  {
    name: 'Ana García',
    role: 'Dueña de negocio',
    quote: '“Con esta estrategia, el equipo puede enfocarse en cerrar clientes y mejorar la experiencia general.”',
  },
]

export function Testimonials() {
  return (
    <section id="testimonios" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Casos de uso"
          title="Historias de empresas que quieren crecer con respuesta inmediata"
          description="Los testimonios de esta sección están marcados como demostrativos y listos para reemplazar por clientes reales."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.06}>
            <div className="premium-card rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <Quote className="quote-mark mb-4 h-7 w-7 text-primary" />
              <p className="mb-6 text-sm leading-7 text-slate-200">{item.quote}</p>
              <div>
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-sm text-slate-400">{item.role}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
