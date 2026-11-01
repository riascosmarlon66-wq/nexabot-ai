import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'
import { createLead } from '../../services/lead.service'
import type { Lead, LeadContext } from '../../features/demo-agent/demo.types'

const emptyForm: Lead = {
  name: '',
  company: '',
  email: '',
  phone: '',
  sector: '',
  volume: '',
  channel: 'WhatsApp',
  automation: '',
}

function createInitialForm(leadContext: LeadContext | null): Lead {
  if (!leadContext) return emptyForm

  const matchingSector = sectorOptions.find(
    (option) =>
      option.value.toLowerCase() === leadContext.sector.toLowerCase() ||
      option.label.toLowerCase() === leadContext.sector.toLowerCase(),
  )

  return {
    ...emptyForm,
    sector: matchingSector?.value ?? leadContext.sector,
    channel: leadContext.channel === 'Página web' ? 'Web' : leadContext.channel,
    automation: leadContext.process,
  }
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

export function LeadForm({ leadContext }: { leadContext: LeadContext | null }) {
  const [form, setForm] = useState(() => createInitialForm(leadContext))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | 'validation'
    message: string
  } | null>(null)
  const [sectorOpen, setSectorOpen] = useState(false)
  const sectorRef = useRef<HTMLDivElement>(null)
  const submitInProgress = useRef(false)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!sectorRef.current?.contains(event.target as Node)) {
        setSectorOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleChange = (field: keyof Lead, value: string) => {
    setSubmitStatus(null)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting || submitInProgress.current) return

    if (Object.values(form).some((value) => !value.trim())) {
      setSubmitStatus({
        type: 'validation',
        message: 'Completa todos los campos requeridos.',
      })
      if (!form.sector.trim()) {
        setSectorOpen(true)
        sectorRef.current?.querySelector('button')?.focus()
      }
      return
    }

    submitInProgress.current = true
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await createLead({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        sector: form.sector.trim(),
        volume: form.volume.trim(),
        channel: form.channel.trim(),
        automation: form.automation.trim(),
      })
      setForm(emptyForm)
      setSectorOpen(false)
      setSubmitStatus({
        type: 'success',
        message: 'Solicitud enviada correctamente. Nos pondremos en contacto contigo.',
      })
    } catch (error) {
      console.error('Error al enviar la solicitud de contacto:', error)
      setSubmitStatus({
        type: 'error',
        message: 'No pudimos enviar tu solicitud. Inténtalo nuevamente.',
      })
    } finally {
      submitInProgress.current = false
      setIsSubmitting(false)
    }
  }

  const selectedSector = sectorOptions.find((option) => option.value === form.sector)

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <div className="premium-card grid gap-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Contacto</p>
            <h3 className="font-display text-3xl text-white md:text-5xl">Evalúa el potencial de automatización de tu empresa</h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Cuéntanos cómo opera tu equipo y diseñaremos una propuesta de automatización adaptada a tus canales, volumen y objetivos.
            </p>
          </div>

          <form onSubmit={handleLeadSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="sr-only" htmlFor="lead-name">Nombre completo</label>
            <input
              id="lead-name"
              name="name"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Nombre completo"
              autoComplete="name"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <label className="sr-only" htmlFor="lead-company">Empresa</label>
            <input
              id="lead-company"
              name="company"
              value={form.company}
              onChange={(event) => handleChange('company', event.target.value)}
              placeholder="Empresa"
              autoComplete="organization"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <label className="sr-only" htmlFor="lead-email">Correo electrónico</label>
            <input
              id="lead-email"
              name="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              type="email"
              placeholder="Correo electrónico"
              autoComplete="email"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <label className="sr-only" htmlFor="lead-phone">Teléfono</label>
            <input
              id="lead-phone"
              name="phone"
              value={form.phone}
              onChange={(event) => handleChange('phone', event.target.value)}
              type="tel"
              placeholder="Teléfono"
              autoComplete="tel"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />
            <div ref={sectorRef} className="relative md:col-span-1">
              <button
                type="button"
                aria-label="Sector de la empresa"
                className="sector-trigger flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left text-white"
                aria-haspopup="listbox"
                aria-expanded={sectorOpen}
                aria-controls="lead-sector-options"
                onClick={() => setSectorOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSectorOpen(false)
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSectorOpen((open) => !open)
                  }
                }}
              >
                <span className={form.sector ? 'text-white' : 'text-slate-500'}>
                  {form.sector ? selectedSector?.label ?? form.sector : 'Sector'}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {sectorOpen ? (
                <div id="lead-sector-options" className="sector-menu absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-64 max-w-full overflow-y-auto rounded-2xl border border-blue-400/20 bg-slate-950/95 p-1.5 shadow-[0_20px_50px_rgba(2,6,23,0.65)] backdrop-blur-xl" role="listbox" aria-label="Sector">
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
            <label className="sr-only" htmlFor="lead-clients">Volumen mensual de conversaciones</label>
            <select
              id="lead-clients"
              name="volume"
              value={form.volume}
              onChange={(event) => handleChange('volume', event.target.value)}
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white"
              required
            >
              <option value="">Volumen mensual de conversaciones</option>
              {conversationVolumes.map((volume) => <option key={volume} value={volume}>{volume}</option>)}
            </select>
            <label className="sr-only" htmlFor="lead-channel">Canal de uso</label>
            <select
              id="lead-channel"
              name="channel"
              value={form.channel}
              onChange={(event) => handleChange('channel', event.target.value)}
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white"
              required
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Web">Página web</option>
              <option value="Ambos">Ambos</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Otro">Otro</option>
            </select>
            <label className="sr-only" htmlFor="lead-automation">Proceso que quieres automatizar</label>
            <input
              id="lead-automation"
              name="automation"
              value={form.automation}
              onChange={(event) => handleChange('automation', event.target.value)}
              placeholder="Describe el proceso que quieres automatizar"
              className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="gradient" size="xl" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Solicitar evaluación'} <ArrowRight className="h-4 w-4" />
              </Button>

              {submitStatus ? (
                <div
                  role={submitStatus.type === 'success' ? 'status' : 'alert'}
                  className={`inline-flex items-center gap-2 text-sm ${
                    submitStatus.type === 'success' ? 'text-emerald-300' : 'text-slate-300'
                  }`}
                >
                  {submitStatus.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {submitStatus.message}
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  )
}
