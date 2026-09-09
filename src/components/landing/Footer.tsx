import { Mail, MapPin, MessageCircleMore } from 'lucide-react'
import { companyConfig } from '../../lib/config'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="mb-4 flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary font-black">N</span>
            <span className="font-display text-xl">{companyConfig.name}</span>
          </div>
          <p className="max-w-xs text-sm leading-6 text-slate-300">{companyConfig.tagline}</p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-white">Navegación</h4>
          <div className="grid gap-2 text-sm text-slate-300">
            {companyConfig.navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-white">Contacto</h4>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {companyConfig.email}</div>
            <div className="flex items-center gap-2"><MessageCircleMore className="h-4 w-4 text-primary" /> {companyConfig.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> México</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-400">
        © 2026 {companyConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  )
}
