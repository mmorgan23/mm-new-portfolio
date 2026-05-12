import { useEffect, useRef } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export type CommLine = {
  from: string
  to: string
  body: string
  ts: string
}

type CommunicationLogProps = {
  messages: CommLine[]
}

function formatTs(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString()
  } catch {
    return iso
  }
}

export function CommunicationLog({ messages }: CommunicationLogProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <Card className="min-w-0 border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Agent communication</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0">
        <div
          ref={viewportRef}
          className="h-[min(32dvh,220px)] min-h-[160px] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1 [scrollbar-gutter:stable] sm:h-[min(36dvh,280px)] md:h-[min(40vh,320px)]"
        >
          <ul className="space-y-3 text-sm">
            {messages.length === 0 ? (
              <li className="text-muted-foreground">No messages yet.</li>
            ) : (
              messages.map((m, i) => (
                <li key={`${m.ts}-${i}`} className="min-w-0 break-words">
                  <p className="text-xs text-muted-foreground">
                    {formatTs(m.ts)} · {m.from} → {m.to}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-foreground">{m.body}</p>
                  {i < messages.length - 1 ? <Separator className="mt-3" /> : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
