import { ArrowRight, Building2, CarFront, HeartPulse, ShoppingBag, Store, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const sectors = [
  { icon: Store, name: 'Retail', description: 'Ventas, disponibilidad y seguimiento de pedidos en tiempo real.', capabilities: ['Catálogo', 'Pedidos', 'Promociones'] },
  { icon: HeartPulse, name: 'Salud', description: 'Agendado, recordatorios y respuesta de dudas clínicas esenciales.', capabilities: ['Citas', 'Recordatorios', 'Preconsulta'] },
  { icon: Building2, name: 'Inmobiliarias', description: 'Contacto inicial, visitas y clasificación de leads calificados.', capabilities: ['Visitas', 'Prospección', 'Seguimiento'] },
  { icon: CarFront, name: 'Automotriz', description: 'Captura de leads, cotizaciones y coordinación de prueba de manejo.', capabilities: ['Cotizaciones', 'Seguimiento', 'Agendado'] },
  { icon: ShoppingBag, name: 'E-commerce', description: 'Resuelve dudas de compra y aumenta la tasa de cierre por chat.', capabilities: ['Recomendaciones', 'Pedidos', 'Soporte'] },
  { icon: TrendingUp, name: 'Servicios B2B', description: 'Califica oportunidades y acelera la respuesta comercial.', capabilities: ['Leads', 'Agendado', 'Cobertura'] },
]

export function Sectors() {
  return (
    <section id="sectores" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Empresas"
          title="Un chatbot adaptado a tu negocio"
          description="No todas las empresas operan igual. Por eso diseñamos cada flujo para la forma real de vender y atender."
          align="center"
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sectors.map((sector, index) => (
          <Reveal key={sector.name} delay={index * 0.05}>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
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
                  Quiero este enfoque <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
