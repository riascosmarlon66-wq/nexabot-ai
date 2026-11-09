import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, LoaderCircle, RotateCcw, Send, X } from 'lucide-react'

type BusinessKey = 'restaurant' | 'clinic'
type ChatMessage = { role: 'user' | 'assistant'; content: string; time: string }

const businesses: Record<BusinessKey, { label: string; greeting: string }> = {
  restaurant: {
    label: 'Restaurante 123',
    greeting: 'Hola. Soy VEKTOR AI. Estoy conectado al contexto de Restaurante 123. ¿Qué deseas consultar?',
  },
  clinic: {
    label: 'Clínica Nexa',
    greeting: 'Hola. Soy VEKTOR AI. Estoy conectado al contexto de Clínica Nexa. ¿En qué puedo ayudarte?',
  },
}

const apiBaseUrl = (import.meta.env.VITE_AGENT_API_URL || 'http://localhost:3001').replace(/\/$/, '')

function nowLabel() {
  return new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

function greetingFor(business: BusinessKey): ChatMessage {
  return { role: 'assistant', content: businesses[business].greeting, time: nowLabel() }
}

export default function DemoChat() {
  const [business, setBusiness] = useState<BusinessKey>('restaurant')
  const [messages, setMessages] = useState<ChatMessage[]>([greetingFor('restaurant')])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const context = useMemo(
    () =>
      messages
        .slice(-10)
        .map((item) => `${item.role === 'user' ? 'Cliente' : 'Asistente'}: ${item.content}`)
        .join('\n'),
    [messages],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const resetChat = (nextBusiness: BusinessKey = business) => {
    setMessages([greetingFor(nextBusiness)])
    setInput('')
    setError('')
    setCalendarOpen(false)
    inputRef.current?.focus()
  }

  const changeBusiness = (next: BusinessKey) => {
    setBusiness(next)
    resetChat(next)
  }

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || loading) return

    const previousContext = context
    setMessages((current) => [...current, { role: 'user', content: message, time: nowLabel() }])
    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/demo/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, message, context: previousContext }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'No fue posible conectar con VEKTOR AI')

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: data.response || 'No recibí una respuesta válida.',
          time: nowLabel(),
        },
      ])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Error inesperado')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const confirmAppointment = () => {
    if (!appointmentDate || !appointmentTime) return

    const dateLabel = new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date(`${appointmentDate}T12:00:00`))

    const reason = business === 'clinic' ? 'cita' : 'reserva'
    setMessages((current) => [
      ...current,
      {
        role: 'user',
        content: `Quiero agendar una ${reason} para el ${dateLabel} a las ${appointmentTime}.`,
        time: nowLabel(),
      },
      {
        role: 'assistant',
        content: `Perfecto. Dejé preparada la solicitud de ${reason} para el ${dateLabel} a las ${appointmentTime}. En esta demo aún no se guarda como cita real, pero el flujo de agenda ya quedó listo para conectarlo al sistema de reservas.`,
        time: nowLabel(),
      },
    ])
    setCalendarOpen(false)
    setAppointmentDate('')
    setAppointmentTime('')
  }

  const minDate = new Date().toISOString().slice(0, 10)

  return (
    <main className="min-h-screen bg-[#07110e] text-slate-100">
      <div className="fixed inset-0 pointer-events-none opacity-70 bg-[radial-gradient(circle_at_top,rgba(20,120,90,0.16),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.015)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.015)_50%,rgba(255,255,255,0.015)_75%,transparent_75%,transparent)] bg-[length:auto,18px_18px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 py-3 sm:px-5 lg:px-6">
        <header className="mb-3 flex items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft size={17} />
            Volver
          </a>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-200">
            Demo de conversación
          </span>
        </header>

        <section className="grid flex-1 gap-3 lg:grid-cols-[285px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-emerald-400/10 bg-[#111b17]/95 p-4 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-emerald-300/20 bg-[#17241f]">
                <img src="/ai-robot.png" alt="Avatar robot de VEKTOR AI" className="h-16 w-16 object-contain" />
                <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-[#111b17] bg-emerald-400" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold">VEKTOR AI</h1>
                <p className="text-xs text-emerald-300">en línea</p>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="business" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Empresa
              </label>
              <select
                id="business"
                value={business}
                onChange={(event) => changeBusiness(event.target.value as BusinessKey)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-700 bg-[#17211e] px-3 py-3 text-sm text-white outline-none"
              >
                <option value="restaurant">Restaurante 123</option>
                <option value="clinic">Clínica Nexa</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              <CalendarDays size={17} />
              {business === 'clinic' ? 'Agendar cita' : 'Reservar mesa'}
            </button>

            <button
              type="button"
              onClick={() => resetChat()}
              disabled={loading}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#17211e] px-4 py-3 text-sm text-slate-300 transition hover:border-emerald-400/30 hover:text-white disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Limpiar conversación
            </button>
          </aside>

          <div className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-emerald-400/10 bg-[#0b1411] shadow-2xl shadow-black/35">
            <div className="flex items-center gap-3 border-b border-white/5 bg-[#18241f] px-4 py-3">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-[#21332b]">
                <img src="/ai-robot.png" alt="" className="h-11 w-11 object-contain" />
              </div>
              <div>
                <div className="font-semibold">VEKTOR AI</div>
                <div className="text-xs text-slate-400">{businesses[business].label} · en línea</div>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 overflow-y-auto bg-[#0b1411] px-3 py-5 sm:px-5">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-[#1d2823] px-3 py-1 text-[11px] font-medium text-slate-400 shadow">
                HOY
              </div>

              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={
                      item.role === 'user'
                        ? 'max-w-[82%] rounded-xl rounded-tr-sm bg-[#005c4b] px-3.5 py-2.5 text-[14px] leading-5 text-slate-100 shadow'
                        : 'max-w-[82%] rounded-xl rounded-tl-sm bg-[#202c27] px-3.5 py-2.5 text-[14px] leading-5 text-slate-100 shadow'
                    }
                  >
                    <div>{item.content}</div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                      <span>{item.time}</span>
                      {item.role === 'user' && <Check size={12} className="text-sky-300" />}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-xl rounded-tl-sm bg-[#202c27] px-3.5 py-2.5 text-sm text-slate-400 shadow">
                    <LoaderCircle size={15} className="animate-spin text-emerald-300" />
                    escribiendo...
                  </div>
                </div>
              )}

              {error && (
                <div className="mx-auto max-w-xl rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/5 bg-[#18241f] p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarOpen(true)}
                  aria-label="Abrir calendario"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-emerald-300"
                >
                  <CalendarDays size={20} />
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={2000}
                  placeholder="Escribe un mensaje"
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-full border border-white/5 bg-[#24332d] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/30 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500 text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      {calendarOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-400/15 bg-[#111b17] p-5 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CalendarDays size={19} />
                  <span className="text-sm font-semibold">
                    {business === 'clinic' ? 'Agendar cita' : 'Reservar mesa'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{businesses[business].label}</p>
              </div>
              <button type="button" onClick={() => setCalendarOpen(false)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <label className="mb-2 block text-xs font-medium text-slate-400">Fecha</label>
            <input
              type="date"
              min={minDate}
              value={appointmentDate}
              onChange={(event) => setAppointmentDate(event.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-700 bg-[#1b2923] px-3 py-3 text-sm text-white"
            />

            <label className="mb-2 block text-xs font-medium text-slate-400">Hora</label>
            <select
              value={appointmentTime}
              onChange={(event) => setAppointmentTime(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#1b2923] px-3 py-3 text-sm text-white"
            >
              <option value="">Selecciona una hora</option>
              {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={confirmAppointment}
              disabled={!appointmentDate || !appointmentTime}
              className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirmar {business === 'clinic' ? 'cita' : 'reserva'}
            </button>

            <p className="mt-3 text-center text-[11px] leading-4 text-slate-600">
              Demo visual: todavía no crea una cita real en Supabase.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
