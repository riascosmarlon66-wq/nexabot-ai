import { MessageSquareText } from 'lucide-react'
import type { ReactNode } from 'react'

export function ChatPlay({
  title,
  messages,
  compact = false,
}: {
  title?: string
  messages: { sender: 'bot' | 'user'; text: string; time?: string }[]
  compact?: boolean
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-3 shadow-glow backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 px-2">
        <div className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
            <MessageSquareText className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">{title ?? 'NexaBot AI'}</p>
            <p className="text-[10px] text-slate-400">online ahora</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        </div>
      </div>

      <div className={`space-y-3 ${compact ? 'max-h-[260px]' : ''}`}>
        {messages.map((message, index) => (
          <div
            key={`${message.sender}-${index}`}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={[
                'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                message.sender === 'user'
                  ? 'bg-gradient-primary text-white'
                  : 'border border-white/8 bg-white/5 text-slate-200',
              ].join(' ')}
            >
              {message.text}
              {message.time ? (
                <div className={`mt-1 text-[10px] ${message.sender === 'user' ? 'text-blue-100/80' : 'text-slate-400'}`}>
                  {message.time}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        <TypingIndicator />
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="h-2.5 w-2.5 animate-typing rounded-full bg-slate-300 [animation-delay:0ms]" />
        <span className="h-2.5 w-2.5 animate-typing rounded-full bg-slate-300 [animation-delay:160ms]" />
        <span className="h-2.5 w-2.5 animate-typing rounded-full bg-slate-300 [animation-delay:320ms]" />
      </div>
    </div>
  )
}
