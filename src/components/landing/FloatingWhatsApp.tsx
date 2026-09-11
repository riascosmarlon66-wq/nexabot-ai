import { MessageCircleMore } from 'lucide-react'
import { companyConfig } from '../../lib/config'

export function FloatingWhatsApp() {
  return (
    <a
      href={companyConfig.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-[0_0_28px_rgba(16,185,129,0.35)] transition hover:scale-[1.02]"
      aria-label="Hablar con un asesor"
    >
      <MessageCircleMore className="h-5 w-5" />
      <span className="hidden sm:inline">Hablar con un asesor</span>
    </a>
  )
}
