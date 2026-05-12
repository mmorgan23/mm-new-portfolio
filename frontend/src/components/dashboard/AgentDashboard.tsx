import { useCallback, useState } from 'react'

import { AgentStatusBoard } from '@/components/dashboard/AgentStatusBoard'
import { CommunicationLog } from '@/components/dashboard/CommunicationLog'
import { DeliverableDisplay } from '@/components/dashboard/DeliverableDisplay'
import { TaskForm } from '@/components/dashboard/TaskForm'
import { ThinkingPanel } from '@/components/dashboard/ThinkingPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTaskHistory } from '@/context/TaskHistoryContext'
import { useTask } from '@/hooks/useTask'

export function AgentDashboard() {
  const { items, pushCompleted } = useTaskHistory()
  const [formSeed, setFormSeed] = useState('')
  const [formKey, setFormKey] = useState(0)
  const onComplete = useCallback(
    (description: string) => {
      pushCompleted(description)
    },
    [pushCompleted],
  )
  const task = useTask(onComplete)

  const busy = task.submitting || task.connectWs

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">Agent dashboard</h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
          Submit a task to Mel (COO). The team streams status, handoffs, and reasoning over WebSockets while Research,
          Content, and QA collaborate on a deliverable you can export.
        </p>
      </div>

      {task.globalError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {task.globalError}
        </div>
      ) : null}

      <div className="grid min-w-0 gap-8 lg:grid-cols-2">
        <div className="min-w-0 space-y-6">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-lg">Task</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm
                key={formKey}
                onSubmit={task.submit}
                disabled={busy}
                initialValue={formSeed}
              />
            </CardContent>
          </Card>
          <AgentStatusBoard agents={task.agents} />
        </div>

        <div className="min-w-0 space-y-6">
          <CommunicationLog messages={task.messages} />
          <ThinkingPanel lines={task.thinking} />
          <DeliverableDisplay markdown={task.deliverable} />
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <h2 className="text-lg font-semibold">Recent tasks</h2>
          <span className="text-xs text-muted-foreground">Stored in this session only</span>
        </div>
        <Separator />
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Completed tasks will show here for quick reuse.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:py-2"
              >
                <p className="min-w-0 flex-1 break-words text-sm text-foreground">{it.summary}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10 w-full shrink-0 touch-manipulation sm:min-h-8 sm:w-auto"
                  onClick={() => {
                    setFormSeed(it.description)
                    setFormKey((k) => k + 1)
                  }}
                >
                  Prefill form
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
