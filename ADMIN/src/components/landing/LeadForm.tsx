import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
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

export function LeadForm() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setForm(initialForm)
  }

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Contacto</p>
            <h3 className="font-display text-3xl text-white md:text-5xl">Solicita una estrategia personalizada</h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Cuéntanos qué quieres automatizar y te ayudamos a definir la mejor solución para tu empresa.
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
            <select
              value={form.sector}
              onChange={(event) => handleChange('sector', event.target.value)}
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white"
            >
              <option value="">Sector</option>
              <option value="retail">Retail</option>
              <option value="salud">Salud</option>
              <option value="inmobiliaria">Inmobiliaria</option>
              <option value="servicios">Servicios</option>
              <option value="ecommerce">E-commerce</option>
            </select>
            <input
              value={form.clients}
              onChange={(event) => handleChange('clients', event.target.value)}
              placeholder="Número de clientes"
              className="md:col-span-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
            />
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
              placeholder="Qué quieres automatizar"
              className="md:col-span-2 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500"
              required
            />

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="gradient" size="xl" className="w-full sm:w-auto">
                Solicitar cotización <ArrowRight className="h-4 w-4" />
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
