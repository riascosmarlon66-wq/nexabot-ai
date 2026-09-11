import { Menu, MessageCircleMore, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { companyConfig } from '../../lib/config'
import { Button } from '../ui/button'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-navbar sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <a href="#inicio" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-lg font-black shadow-glow">
            N
          </span>
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">{companyConfig.name}</div>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {companyConfig.navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline-light" asChild>
            <a href="#contacto">Solicitar demostración</a>
          </Button>
          <Button variant="whatsapp" asChild>
            <a href={companyConfig.whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircleMore className="h-4 w-4" /> Hablar por WhatsApp
            </a>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {companyConfig.navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-2 py-2 text-sm text-slate-200 hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid gap-2">
              <Button variant="gradient" asChild className="w-full">
                <a href="#contacto">Solicitar demostración</a>
              </Button>
              <Button variant="whatsapp" asChild className="w-full">
                <a href={companyConfig.whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircleMore className="h-4 w-4" /> Hablar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
