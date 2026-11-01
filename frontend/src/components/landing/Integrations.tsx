import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const connectionOptions = ['Web', 'WhatsApp', 'Otros canales']
const businessSystems = ['Catálogo', 'Agenda', 'CRM', 'Inventario', 'Sistemas internos', 'Operación']

export function Integrations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Integraciones"
          title="Conectado a la forma en que trabaja tu empresa"
          description="Un agente, configurado con el conocimiento y las reglas de tu negocio. Los canales y sistemas se evalúan según disponibilidad y compatibilidad."
          align="center"
        />
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h3 className="mb-5 font-display text-2xl text-white">Qué incluye la implementación</h3>
            <ul className="space-y-4 text-slate-200">
              {[
                'Configuración del flujo de acuerdo con tus prioridades y procesos.',
                'Evaluación de los canales donde tus clientes ya te contactan.',
                'Personalización del tono, lenguaje y mensajes de la empresa.',
                'Definición de cuándo conviene derivar una conversación a una persona.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-start">
              <Button variant="gradient" asChild>
                <a href="#contacto">
                  Solicitar cotización <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="network-panel premium-card rounded-[30px] border border-white/10 bg-slate-950/40 p-6">
            <div className="mb-6 flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-primary" />
              <p className="font-medium">Puntos de conexión posibles</p>
            </div>

            <p className="mb-3 text-xs leading-5 text-slate-400">
              No son productos separados ni conexiones garantizadas; se definen durante el análisis técnico.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {connectionOptions.map((tech) => (
                <div
                  key={tech}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center text-sm text-slate-200"
                >
                  {tech}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Información y sistemas a evaluar</p>
              <div className="flex flex-wrap gap-2">
                {businessSystems.map((system) => (
                  <span key={system} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">{system}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-8 grid gap-6 rounded-[30px] border border-white/10 bg-white/[0.025] p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center md:p-8">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="h-4 w-4" /> Control en tus manos
            </span>
            <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">
              La IA trabaja con tus reglas.
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Define qué puede resolver el agente y cuándo debe involucrar a tu equipo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Revisión humana', text: 'Derivación cuando hace falta.' },
              { title: 'Conocimiento aprobado', text: 'Respuestas alineadas a tu marca.' },
              { title: 'Mejora continua', text: 'Ajustes según resultados reales.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-slate-950/50 p-4">
                <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
