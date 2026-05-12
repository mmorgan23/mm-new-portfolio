import { getApiBaseUrl } from '@/lib/env'

export type CreateTaskResponse = {
  task_id: string
  ws_path: string
}

export async function createTask(description: string): Promise<CreateTaskResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<CreateTaskResponse>
}

export type TaskSnapshot = {
  task_id: string
  description: string
  agents: Record<string, { status: string; details: string; updated_at: string }>
  messages: Array<{
    from_agent: string
    to_agent: string
    body: string
    created_at: string
  }>
  thinking_log: Array<{ agent: string; text: string; created_at: string }>
  deliverable: string | null
  terminal: boolean
}

export async function getTask(taskId: string): Promise<TaskSnapshot> {
  const res = await fetch(`${getApiBaseUrl()}/api/tasks/${encodeURIComponent(taskId)}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<TaskSnapshot>
}
