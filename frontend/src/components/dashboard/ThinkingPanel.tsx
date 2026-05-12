import { useEffect, useRef } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type ThinkingLine = {
  agent: string
  text: string
  ts: string
}

type ThinkingPanelProps = {
  lines: ThinkingLine[]
}

export function ThinkingPanel({ lines }: ThinkingPanelProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <Card className="min-w-0 border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Reasoning stream</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0">
        <div
          ref={viewportRef}
          className="h-[min(28dvh,200px)] min-h-[140px] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1 [scrollbar-gutter:stable] sm:h-[min(26vh,220px)] md:h-[min(28vh,240px)]"
        >
          <ul className="space-y-2 text-sm">
            {lines.length === 0 ? (
              <li className="text-muted-foreground">Thinking updates appear here as agents work.</li>
            ) : (
              lines.map((line, i) => (
                <li key={`${line.ts}-${i}`} className="min-w-0 break-words">
                  <p className="text-xs font-medium text-primary">{line.agent}</p>
                  <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">{line.text}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
