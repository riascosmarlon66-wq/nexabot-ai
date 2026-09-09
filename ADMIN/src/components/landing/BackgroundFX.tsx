export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_28%)]" />
      <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute right-[-8%] top-52 h-80 w-80 rounded-full bg-accent/20 blur-[140px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:80px_80px] animate-grid-pan" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,rgba(2,6,23,0.2)_64%,rgba(2,6,23,0.9)_100%)]" />
    </div>
  )
}
