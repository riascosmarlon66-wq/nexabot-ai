import { ArrowRight, Check, X } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

export function Comparison() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Antes y después"
          title="De conversaciones dispersas a procesos más claros"
          description="Un agente configurado para tu operación puede apoyar consultas repetitivas y dejar a tu equipo al frente de las decisiones importantes."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="premium-card rounded-[30px] border border-red-500/20 bg-red-500/5 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-2xl text-white">Antes</h3>
            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-xs text-red-200">Manual</span>
          </div>
          <ul className="space-y-4 text-slate-200">
            {[
              'Clientes esperan por respuestas humanas durante horas.',
              'Equipo repite la misma información en todas las conversaciones.',
              'Mensajes fuera de horario se pierden o se responden tarde.',
              'Más tiempo en tareas operativas y menos en ventas.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-red-200">
                  <X className="h-4 w-4" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="premium-card rounded-[30px] border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-2xl text-white">Después</h3>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">Automatizado</span>
          </div>
          <ul className="space-y-4 text-slate-200">
            {[
              'Un punto de contacto que se adapta a los canales evaluados para tu negocio.',
              'Consultas y procesos configurados de acuerdo con tus reglas.',
              'Posibilidad de ampliar la disponibilidad según el alcance definido.',
              'Tu equipo puede enfocarse en los casos que necesitan atención humana.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200">
                  <Check className="h-4 w-4" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-8 flex justify-center">
        <a href="#soluciones" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          Ver soluciones <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
