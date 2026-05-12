import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type HistoryItem = {
  id: string
  summary: string
  description: string
  completedAt: string
}

const MAX = 5

type TaskHistoryContextValue = {
  items: HistoryItem[]
  pushCompleted: (description: string) => void
}

const TaskHistoryContext = createContext<TaskHistoryContextValue | null>(null)

function summarize(description: string) {
  const t = description.trim()
  if (t.length <= 72) return t
  return `${t.slice(0, 69)}…`
}

export function TaskHistoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>([])

  const pushCompleted = useCallback((description: string) => {
    const id = crypto.randomUUID()
    const summary = summarize(description)
    const completedAt = new Date().toISOString()
    setItems((prev) => {
      const next: HistoryItem = {
        id,
        summary,
        description,
        completedAt,
      }
      return [next, ...prev].slice(0, MAX)
    })
  }, [])

  const value = useMemo(
    () => ({
      items,
      pushCompleted,
    }),
    [items, pushCompleted],
  )

  return <TaskHistoryContext.Provider value={value}>{children}</TaskHistoryContext.Provider>
}

export function useTaskHistory() {
  const ctx = useContext(TaskHistoryContext)
  if (!ctx) {
    throw new Error('useTaskHistory must be used within TaskHistoryProvider')
  }
  return ctx
}
