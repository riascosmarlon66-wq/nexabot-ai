import { Bot, Mail, MapPin, MessageCircleMore } from 'lucide-react'
import { companyConfig } from '../../lib/config'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr_1fr] md:px-6">
        <div>
          <div className="mb-4 flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary"><Bot className="h-5 w-5" /></span>
            <span className="font-display text-xl">{companyConfig.name}</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">{companyConfig.tagline}</p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">Explora</h4>
          <div className="grid gap-3 text-sm text-slate-400">
            {companyConfig.navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">Hablemos</h4>
          <div className="space-y-3 text-sm text-slate-400">
            <a href={companyConfig.contact.emailUrl} className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> {companyConfig.contact.email}
            </a>
            <a href={companyConfig.contact.phoneUrl} className="flex items-center gap-2">
              <MessageCircleMore className="h-4 w-4 text-primary" /> {companyConfig.contact.phone}
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {companyConfig.contact.location}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] py-5 text-center text-xs text-slate-500">
        © 2026 {companyConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  )
}
