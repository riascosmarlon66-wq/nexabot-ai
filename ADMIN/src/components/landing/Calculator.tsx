import { useMemo, useState } from 'react'
import { ArrowRight, Calculator as CalcIcon, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Reveal } from './Reveal'

export function Calculator() {
  const [messagesPerDay, setMessagesPerDay] = useState(120)
  const [people, setPeople] = useState(5)
  const [hours, setHours] = useState(18)
  const [leads, setLeads] = useState(30)

  const metrics = useMemo(() => {
    const conversations = messagesPerDay * 30
    const totalHours = (people * hours * 30) / 8
    const hoursSaved = Math.round((conversations * 0.35) / 2)
    const automatable = Math.min(85, Math.round((messagesPerDay / 200) * 100 + people * 6))
    const monthlyLeads = Math.round(leads * 1.3)

    return { conversations, totalHours, hoursSaved, automatable, monthlyLeads }
  }, [hours, leads, messagesPerDay, people])

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Reveal>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Calculadora</p>
              <h3 className="font-display text-3xl text-white">Cuánto puedes ahorrar con automatización</h3>
            </div>
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow md:flex">
              <CalcIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-5">
              <Slider label="Mensajes por día" value={messagesPerDay} min={20} max={500} step={10} onChange={setMessagesPerDay} />
              <Slider label="Personas atendiendo" value={people} min={1} max={20} step={1} onChange={setPeople} />
              <Slider label="Horas de atención por persona" value={hours} min={4} max={40} step={1} onChange={setHours} />
              <Slider label="Leads al mes" value={leads} min={10} max={200} step={5} onChange={setLeads} />
            </div>

            <div className="grid gap-4">
              <MetricCard title="Conversaciones por mes" value={`${metrics.conversations.toLocaleString()}`} />
              <MetricCard title="Horas ahorradas" value={`${metrics.hoursSaved}h`} />
              <MetricCard title="% automatizable" value={`${metrics.automatable}%`} />
              <MetricCard title="Leads potenciales" value={`${metrics.monthlyLeads}`} />

              <div className="rounded-[24px] border border-primary/20 bg-primary/10 p-4 text-sm text-slate-200">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold">Suposición de operación</span>
                </div>
                Calculado sobre base de automatización realista y tiempo de atención humano por conversación.
              </div>

              <Button variant="gradient" asChild className="w-full">
                <a href="#contacto">
                  Quiero analizar mi empresa <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
      />
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{title}</div>
      <div className="mt-2 font-display text-3xl text-white">{value}</div>
    </div>
  )
}
