import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AgentName, AgentStatus } from '@/types'
import type { AgentRow } from '@/hooks/useTask'

const ORDER: AgentName[] = ['COO', 'Research Agent', 'Content Agent', 'QA Agent']

function statusVariant(status: AgentStatus) {
  if (status === 'ERROR') return 'destructive' as const
  if (status === 'WORKING') return 'default' as const
  if (status === 'WAITING') return 'secondary' as const
  if (status === 'COMPLETE') return 'outline' as const
  return 'ghost' as const
}

function formatTs(iso: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

type AgentStatusBoardProps = {
  agents: Record<AgentName, AgentRow>
}

export function AgentStatusBoard({ agents }: AgentStatusBoardProps) {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Agent status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ORDER.map((name) => {
          const row = agents[name]
          return (
            <div
              key={name}
              className="isolate min-w-0 overflow-hidden rounded-lg border border-border/60 bg-muted/20 p-3"
            >
              {/* Grid keeps label and badge in separate columns so rapid status updates never overlap text */}
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1">
                <p className="min-w-0 break-words font-medium leading-snug text-foreground [overflow-wrap:anywhere]">
                  {name}
                </p>
                <Badge variant={statusVariant(row.status)} className="max-w-full shrink-0 justify-self-end">
                  {row.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Last update: {formatTs(row.updatedAt)}</p>
              <div className="mt-2 max-h-48 min-h-[3rem] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-md border border-border/50 bg-background/40 px-2.5 py-2 [scrollbar-gutter:stable]">
                <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                  {row.details || '—'}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
