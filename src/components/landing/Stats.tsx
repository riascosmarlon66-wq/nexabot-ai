import { useCountUp } from '../../hooks/use-count-up'

const stats = [
  { label: 'Atención 24/7', value: 24, suffix: '/7' },
  { label: 'Respuestas al instante', value: 12, suffix: 's' },
  { label: 'Leads calificados', value: 420, suffix: '+' },
  { label: 'Horas recuperadas', value: 75, suffix: '%' },
]

export function Stats() {
  return (
    <div className="mt-16 grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:grid-cols-4 md:p-6">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </div>
  )
}

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { ref, count } = useCountUp(value)

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-center">
      <div className="font-display text-3xl font-semibold tracking-[-0.08em] text-white md:text-4xl">
        {count}
        <span className="ml-1 text-base text-primary">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </div>
  )
}
