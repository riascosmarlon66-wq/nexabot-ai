import { ArrowRight, BriefcaseBusiness, HeartPulse, Landmark, RadioTower, ShoppingCart, Truck } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const sectors = [
  { icon: Landmark, name: 'Servicios financieros y Fintech', description: 'Atención, clasificación de clientes, consultas, soporte y captación comercial.', capabilities: ['Clasificación', 'Soporte', 'Captación'] },
  { icon: RadioTower, name: 'Telecomunicaciones', description: 'Soporte, consultas de planes, incidencias, ventas y atención masiva.', capabilities: ['Planes', 'Incidencias', 'Ventas'] },
  { icon: HeartPulse, name: 'Salud y redes clínicas', description: 'Agendamiento, orientación inicial, recordatorios y atención administrativa.', capabilities: ['Agendamiento', 'Orientación', 'Recordatorios'] },
  { icon: Truck, name: 'Logística y transporte', description: 'Seguimiento, cotizaciones, estados de envío y atención operativa.', capabilities: ['Seguimiento', 'Cotizaciones', 'Operación'] },
  { icon: ShoppingCart, name: 'Retail y E-commerce', description: 'Catálogo, recomendaciones, pedidos, soporte y ventas.', capabilities: ['Catálogo', 'Pedidos', 'Recomendaciones'] },
  { icon: BriefcaseBusiness, name: 'Servicios B2B y tecnología', description: 'Calificación de leads, demos, reuniones, soporte y ventas empresariales.', capabilities: ['Leads', 'Demos', 'Soporte'] },
]

export function Sectors() {
  return (
    <section id="sectores" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Empresas"
          title="IA conversacional diseñada para operaciones empresariales"
          description="Automatizamos atención, ventas y procesos según el volumen, canales y operación de cada organización."
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
              <Button variant="outline-light" asChild>
                <a href="#contacto">
                  Explorar solución <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
