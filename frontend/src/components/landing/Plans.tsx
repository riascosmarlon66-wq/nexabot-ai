import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const plans = [
  {
    name: 'Esencial',
    description: 'Para negocios que quieren empezar con un proceso prioritario y alcance definido.',
    popular: false,
    features: ['Un proceso inicial', 'Conocimiento del negocio', 'Alcance acordado', 'Revisión de resultados'],
  },
  {
    name: 'Crecimiento',
    description: 'Para equipos que necesitan ampliar procesos y organizar un mayor volumen de solicitudes.',
    popular: true,
    features: ['Más procesos configurables', 'Flujos personalizados', 'Evaluación de conexiones', 'Ajustes según alcance'],
  },
  {
    name: 'Empresa',
    description: 'Para operaciones con distintos equipos, procesos y necesidades de integración.',
    popular: false,
    features: ['Alcance por operación', 'Procesos por equipo', 'Integraciones por viabilidad', 'Plan de evolución'],
  },
]

export function Plans() {
  return (
    <section id="planes" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Planes"
          title="Elige la opción que mejor encaja con tu operación"
          description="El alcance se define según procesos, volumen, sistemas y viabilidad técnica. No hay precios ni integraciones asumidos de antemano."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 0.06}>
            <div
              className={[
                'premium-card flex h-full flex-col rounded-[30px] border p-6',
                plan.popular
                  ? 'plan-featured shimmer-surface border-primary/40 bg-gradient-to-b from-primary/10 to-transparent shadow-glow'
                  : 'border-white/10 bg-white/[0.03]',
              ].join(' ')}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-2xl text-white">{plan.name}</h3>
                {plan.popular ? (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-primary">
                    Configurable
                  </span>
                ) : null}
              </div>

              <p className="mb-6 text-sm leading-6 text-slate-300">{plan.description}</p>

              <div className="mb-6 rounded-[22px] border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Alcance según tu operación</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button variant={plan.popular ? 'gradient' : 'outline-light'} asChild className="w-full">
                  <a href="#contacto">
                    Solicitar cotización <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
