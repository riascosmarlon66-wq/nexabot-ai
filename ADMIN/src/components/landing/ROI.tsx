import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

export function ROI() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="ROI"
          title="Un chatbot no es un gasto: es una forma de responder antes"
          description="Cuando tu operación responde más rápido, conviertes más oportunidades y alivias a tu equipo para que se enfoque en lo importante."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-[30px] border border-red-500/20 bg-red-500/5 p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl text-white">Sin automatización</h3>
            <TrendingDown className="h-5 w-5 text-red-300" />
          </div>
          <ul className="space-y-3 text-slate-200">
            {['Atención lenta', 'Leads sin respuesta', 'Más trabajo manual', 'Pérdida de ventas por demora'].map((item) => (
              <li key={item} className="rounded-2xl border border-red-500/10 bg-red-500/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="rounded-[30px] border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl text-white">Con automatización</h3>
            <TrendingUp className="h-5 w-5 text-emerald-300" />
          </div>
          <ul className="space-y-3 text-slate-200">
            {['Respuestas instantáneas', 'Más leads calificados', 'Procesos más claros', 'Equipo enfocado en ventas y servicio'].map((item) => (
              <li key={item} className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
        Los resultados reales dependen del volumen de conversaciones, canal y complejidad de cada flujo. El análisis técnico se hace en la etapa de diagnóstico.
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="gradient" asChild>
          <a href="#contacto">
            Quiero un chatbot para mi empresa <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  )
}
