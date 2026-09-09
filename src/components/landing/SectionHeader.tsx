type SectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeaderProps) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={`mb-10 flex flex-col gap-3 ${alignment}`}>
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary/90">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.06em] text-white md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base text-slate-300 md:text-lg">{description}</p>
      ) : null}
    </div>
  )
}
