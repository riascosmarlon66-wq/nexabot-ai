import { ArrowRight, MessageSquareText } from 'lucide-react'
import { Button } from '../ui/button'

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="rounded-[36px] border border-primary/20 bg-gradient-to-r from-primary/15 via-slate-950 to-accent/15 p-6 text-center shadow-glow md:p-10">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <h3 className="font-display text-3xl text-white md:text-5xl">
          Mientras lees esto, tus clientes podrían estar esperando una respuesta.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
          Una buena atención cambia la experiencia de compra y también mejora la percepción de tu marca.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button variant="gradient" size="xl" asChild>
            <a href="#contacto">
              Solicitar demostración <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline-light" size="xl" asChild>
            <a href="#contacto">
              Quiero analizar mi empresa
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
