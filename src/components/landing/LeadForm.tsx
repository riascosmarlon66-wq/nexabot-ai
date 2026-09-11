import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'

const initialForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  sector: '',
  clients: '',
  channel: 'WhatsApp',
  automation: '',
}

const sectorOptions = [
  { value: 'fintech', label: 'Servicios financieros y Fintech' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'telecomunicaciones', label: 'Telecomunicaciones' },
  { value: 'salud', label: 'Salud y redes clínicas' },
  { value: 'inmobiliaria-construccion', label: 'Inmobiliarias y constructoras' },
  { value: 'logistica-transporte', label: 'Logística y transporte' },
  { value: 'retail-omnicanal', label: 'Retail y comercio omnicanal' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'hoteleria-turismo', label: 'Hotelería y turismo' },
  { value: 'educacion', label: 'Educación' },
  { value: 'software-tecnologia', label: 'Software y tecnología' },
  { value: 'servicios-profesionales-b2b', label: 'Servicios profesionales B2B' },
  { value: 'manufactura', label: 'Manufactura' },
  { value: 'automotriz', label: 'Automotriz' },
  { value: 'otro', label: 'Otro sector' },
]

const conversationVolumes = [
  'Menos de 1.000',
  '1.000 - 5.000',
  '5.000 - 20.000',
  '20.000 - 100.000',
  'Más de 100.000',
]

export function LeadForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sectorOpen, setSectorOpen] = useState(false)
  const sectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!sectorRef.current?.contains(event.target as Node)) {
        setSectorOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
    setSectorOpen(false)
  }

  const selectedSector = sectorOptions.find((option) => option.value === form.sector)

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <div className="premium-card grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Contacto</p>
            <h3 className="font-display text-3xl text-white md:text-5xl">Evalúa el potencial de automatización de tu empresa</h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Cuéntanos cómo opera tu equipo y diseñaremos una propuesta de automatización adaptada a tus canales, volumen y objetivos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Nombre completo"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <input
              value={form.company}
              onChange={(event) => handleChange('company', event.target.value)}
              placeholder="Empresa"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <input
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              type="email"
              placeholder="Correo electrónico"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <input
              value={form.phone}
              onChange={(event) => handleChange('phone', event.target.value)}
              placeholder="Teléfono"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
            />
            <div ref={sectorRef} className="relative md:col-span-1">
              <button
                type="button"
                className="sector-trigger flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left text-white"
                aria-haspopup="listbox"
                aria-expanded={sectorOpen}
                onClick={() => setSectorOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSectorOpen(false)
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSectorOpen((open) => !open)
                  }
                }}
              >
                <span className={selectedSector ? 'text-white' : 'text-slate-500'}>
                  {selectedSector?.label ?? 'Sector'}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {sectorOpen ? (
                <div className="sector-menu absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-64 max-w-full overflow-y-auto rounded-2xl border border-blue-400/20 bg-slate-950/95 p-1.5 shadow-[0_20px_50px_rgba(2,6,23,0.65)] backdrop-blur-xl" role="listbox" aria-label="Sector">
                  {sectorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={form.sector === option.value}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        form.sector === option.value
                          ? 'bg-primary/20 text-blue-100'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => {
                        handleChange('sector', option.value)
                        setSectorOpen(false)
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <select
              value={form.clients}
              onChange={(event) => handleChange('clients', event.target.value)}
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white"
            >
              <option value="">Volumen mensual de conversaciones</option>
              {conversationVolumes.map((volume) => <option key={volume} value={volume}>{volume}</option>)}
            </select>
            <select
              value={form.channel}
              onChange={(event) => handleChange('channel', event.target.value)}
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Web">Web</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Otro">Otro</option>
            </select>
            <input
              value={form.automation}
              onChange={(event) => handleChange('automation', event.target.value)}
              placeholder="Describe el proceso que quieres automatizar"
              className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="gradient" size="xl" className="w-full sm:w-auto">
                Solicitar evaluación <ArrowRight className="h-4 w-4" />
              </Button>

              {submitted ? (
                <div className="inline-flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> Enviado correctamente
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  )
}
