function trimSlash(s: string) {
  return s.replace(/\/+$/, '')
}

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
  return trimSlash(raw)
}

export function wsUrlForTask(taskId: string): string {
  const base = getApiBaseUrl()
  const u = new URL(base)
  u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
  u.pathname = `/ws/tasks/${encodeURIComponent(taskId)}`
  u.search = ''
  u.hash = ''
  return u.toString()
}
