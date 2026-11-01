import { ArrowRight, ClipboardList, LayoutDashboard, Rocket } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const steps = [
  { icon: ClipboardList, title: 'Entendemos tu operación', text: 'Identificamos tus objetivos, canales y oportunidades de automatización.' },
  { icon: LayoutDashboard, title: 'Diseñamos tu agente', text: 'Definimos flujos, tono y posibles conexiones según tu operación y viabilidad.' },
  { icon: Rocket, title: 'Lanzamos y mejoramos', text: 'Probamos escenarios reales y optimizamos el agente junto a tu equipo.' },
]

export function Process() {
  return (
    <section id="proceso" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Cómo funciona"
          title="Nosotros hacemos la implementación por ti"
          description="Te acompañamos desde el análisis hasta la optimización continua para que no tengas que coordinar cada detalle."
          align="center"
        />
      </Reveal>

      <div className="process-flow grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.05}>
            <div className="premium-card relative rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="process-node flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-6 text-slate-300">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="gradient" asChild>
          <a href="#contacto">
            Quiero analizar mi empresa <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  )
}
