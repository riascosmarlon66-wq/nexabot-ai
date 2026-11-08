import { FormEvent, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Bot, LoaderCircle, RotateCcw, Send } from 'lucide-react'

type BusinessKey = 'restaurant' | 'clinic'
type ChatMessage = { role: 'user' | 'assistant'; content: string }

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

export default function DemoChat() {
  const [business, setBusiness] = useState<BusinessKey>('restaurant')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: businesses.restaurant.greeting },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const context = useMemo(
    () =>
      messages
        .slice(-10)
        .map((item) => `${item.role === 'user' ? 'Cliente' : 'Asistente'}: ${item.content}`)
        .join('\n'),
    [messages],
  )

  const resetChat = (nextBusiness: BusinessKey = business) => {
    setMessages([{ role: 'assistant', content: businesses[nextBusiness].greeting }])
    setInput('')
    setError('')
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
    setMessages((current) => [...current, { role: 'user', content: message }])
    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/demo/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business,
          message,
          context: previousContext,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'No fue posible conectar con VEKTOR AI')
      }

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.response || 'No recibí una respuesta válida.' },
      ])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Error inesperado')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-[#020712] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,140,255,0.18),transparent_38%),radial-gradient(circle_at_85%_75%,rgba(45,212,191,0.08),transparent_32%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Volver a la página
          </a>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-200">
            Demo privada
          </span>
        </header>

        <section className="grid flex-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-cyan-400/15 bg-slate-950/55 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 grid h-36 w-36 place-items-center rounded-full border border-cyan-300/20 bg-blue-500/5 shadow-[0_0_45px_rgba(14,165,233,0.16)]">
                <div className="absolute inset-3 rounded-full border border-blue-400/10" />
                <img
                  src="/ai-robot.png"
                  alt="Avatar robot de VEKTOR AI"
                  className="relative h-32 w-32 object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.3)]"
                />
                <span className="absolute bottom-2 right-4 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </div>

              <div className="mb-1 flex items-center gap-2">
                <Bot size={18} className="text-cyan-300" />
                <h1 className="font-display text-xl font-semibold tracking-wide">VEKTOR AI</h1>
              </div>
              <p className="text-sm text-slate-400">Agente inteligente multiempresa</p>
            </div>

            <div className="mt-7">
              <label htmlFor="business" className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Contexto empresarial
              </label>
              <select
                id="business"
                value={business}
                onChange={(event) => changeBusiness(event.target.value as BusinessKey)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-3 text-sm text-white outline-none"
              >
                <option value="restaurant">Restaurante 123</option>
                <option value="clinic">Clínica Nexa</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => resetChat()}
              disabled={loading}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Limpiar conversación
            </button>

            <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-400/5 p-4 text-xs leading-5 text-slate-400">
              Esta pantalla no usa WhatsApp. Se comunica directamente con el Agent Core para probar el mismo contexto empresarial.
            </div>
          </aside>

          <div className="flex min-h-[680px] flex-col overflow-hidden rounded-3xl border border-cyan-400/15 bg-slate-950/65 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-cyan-300/20 bg-blue-500/10">
                <img src="/ai-robot.png" alt="" className="h-11 w-11 object-contain" />
              </div>
              <div>
                <div className="font-semibold">VEKTOR AI</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Activo · {businesses[business].label}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      item.role === 'user'
                        ? 'max-w-[82%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-blue-950/20'
                        : 'max-w-[82%] rounded-2xl rounded-bl-md border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm leading-6 text-slate-200'
                    }
                  >
                    {item.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm text-slate-400">
                    <LoaderCircle size={16} className="animate-spin text-cyan-300" />
                    VEKTOR AI está escribiendo...
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="border-t border-slate-800 p-4 sm:p-5">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={2000}
                  placeholder="Escribe un mensaje para VEKTOR AI..."
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-slate-950 shadow-lg shadow-blue-500/20 transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={19} />
                </button>
              </div>
              <p className="mt-2 px-1 text-[11px] text-slate-600">
                El historial de esta demo permanece solo en esta pantalla.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
