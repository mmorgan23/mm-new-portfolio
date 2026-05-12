import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const EXAMPLES = [
  'Write a blog post about AI agent orchestration patterns',
  'Create a project plan for a website redesign',
  'Analyze a software architecture and provide recommendations',
  'Generate a technical specification for a feature',
  'Create an onboarding guide for new team members',
]

type TaskFormProps = {
  onSubmit: (text: string) => void
  disabled?: boolean
  initialValue?: string
}

export function TaskForm({ onSubmit, disabled, initialValue = '' }: TaskFormProps) {
  const [text, setText] = useState(initialValue)

  return (
    <div className="space-y-4">
      <label htmlFor="task-input" className="text-sm font-medium text-foreground">
        What would you like the agents to do?
      </label>
      <Textarea
        id="task-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Describe the outcome you want…"
        disabled={disabled}
        className="resize-y text-base"
      />
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Examples</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {EXAMPLES.map((ex) => (
            <Button
              key={ex}
              type="button"
              variant="outline"
              size="xs"
              disabled={disabled}
              onClick={() => setText(ex)}
              className="h-auto min-h-10 w-full touch-manipulation justify-start whitespace-normal py-2.5 text-left text-xs leading-snug sm:w-auto sm:min-h-8 sm:max-w-[20rem] sm:py-1.5"
            >
              {ex.length > 48 ? `${ex.slice(0, 45)}…` : ex}
            </Button>
          ))}
        </div>
      </div>
      <Button type="button" disabled={disabled} onClick={() => onSubmit(text)} className="w-full sm:w-auto">
        Submit to COO
      </Button>
    </div>
  )
}
