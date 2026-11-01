import { ArrowRight, Building2, BriefcaseBusiness, Store } from 'lucide-react'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const sectors = [
  { icon: Store, name: 'Negocio pequeño', description: 'Restaurantes, tiendas, peluquerías y comercios locales: el agente puede ayudar con consultas, pedidos, citas y tareas repetitivas.', capabilities: ['Consultas', 'Pedidos', 'Reservas'] },
  { icon: BriefcaseBusiness, name: 'Negocio en crecimiento', description: 'Para equipos con más clientes, catálogos y solicitudes que buscan organizar cotizaciones, agenda y seguimiento.', capabilities: ['Cotizaciones', 'Agenda', 'Seguimiento'] },
  { icon: Building2, name: 'Empresa', description: 'Para operaciones con varios equipos, reglas y procesos. Las conexiones con sistemas internos se evalúan para cada caso.', capabilities: ['Departamentos', 'Procesos', 'Sistemas'] },
]

export function Sectors() {
  return (
    <section id="sectores" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Crece contigo"
          title="Un mismo agente. Más posibilidades a medida que creces."
          description="El agente se configura según tu negocio, sector y operación: no son tres productos distintos, sino una solución adaptable."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sectors.map((sector, index) => (
          <Reveal key={sector.name} delay={index * 0.05}>
            <div className="premium-card group rounded-[30px] border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.018] p-6 shadow-[0_18px_60px_rgba(2,6,23,0.18)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_70px_rgba(30,64,175,0.2)]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <sector.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">{sector.name}</h3>
              <p className="mb-5 text-sm leading-6 text-slate-300">{sector.description}</p>
              <div className="mb-5 flex flex-wrap gap-2">
                {sector.capabilities.map((item) => (
                  <span key={item} className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
                    {item}
                  </span>
                ))}
              </div>
              <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">
                Hablemos de tu operación <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
