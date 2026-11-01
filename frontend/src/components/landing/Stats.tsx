import { ArrowUpRight, Building2, Settings2 } from 'lucide-react'

const stats = [
  { icon: Settings2, label: 'Capacidades según tus procesos' },
  { icon: Building2, label: 'Se adapta al tamaño de tu negocio' },
  { icon: ArrowUpRight, label: 'Puede crecer junto a tu operación' },
]

export function Stats() {
  return (
    <div className="mt-16 grid gap-3 rounded-[28px] border border-white/10 bg-white/[0.025] p-3 backdrop-blur-xl md:grid-cols-3 md:p-4">
      {stats.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center justify-center gap-3 rounded-2xl px-4 py-4 text-sm text-slate-300">
          <Icon className="h-5 w-5 shrink-0 text-primary" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
