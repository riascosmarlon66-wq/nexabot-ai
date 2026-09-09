import { ArrowRight, CheckCircle2, Megaphone, MessageSquareText, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const technologies = ['WhatsApp', 'Instagram', 'Meta', 'Google', 'HubSpot', 'Calendly', 'Stripe', 'Notion', 'Zapier', 'Webchat', 'CRM', 'Chatbot']

export function Integrations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Integraciones"
          title="No vendemos un chatbot genérico"
          description="Diseñamos flujos para tu operación real, con canales, reglas y procesos que ya usas en tu empresa."
          align="center"
        />
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h3 className="mb-5 font-display text-2xl text-white">Qué incluye la implementación</h3>
            <ul className="space-y-4 text-slate-200">
              {[
                'Configuración del flujo según tu proceso real de venta y atención.',
                'Conexión con canales donde tus clientes ya te contactan.',
                'Personalización del tono, lenguaje y mensajes de la empresa.',
                'Asignación de handoff a personas cuando hace falta intervención humana.',
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
          <div className="rounded-[30px] border border-white/10 bg-slate-950/40 p-6">
            <div className="mb-6 flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-primary" />
              <p className="font-medium">Integraciones comunes</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {technologies.map((tech, index) => (
                <div
                  key={tech}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center text-sm text-slate-200"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {tech}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { icon: MessageSquareText, label: 'Atención', value: '24/7' },
                { icon: Megaphone, label: 'Ventas', value: 'Más leads' },
                { icon: ShieldCheck, label: 'Control', value: 'Seguro' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <item.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                  <div className="mt-1 font-display text-xl text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
