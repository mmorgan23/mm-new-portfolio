function trimSlash(s: string) {
  return s.replace(/\/+$/, '')
}

function isLocalApiHostname(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]'
}

export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
  return trimSlash(raw)
}

/**
 * When the SPA is a production build but still targets localhost, the live site cannot reach the API.
 * Returns a user-facing message, or null when OK / dev build.
 */
export function getApiConfigWarning(): string | null {
  if (!import.meta.env.PROD) return null

  let apiUrl: URL
  try {
    apiUrl = new URL(getApiBaseUrl())
  } catch {
    return 'VITE_API_URL is not a valid URL. Set it in Vercel (HTTPS API origin, no trailing slash) and redeploy.'
  }

  if (isLocalApiHostname(apiUrl.hostname)) {
    return `This site is built for production but VITE_API_URL still points at ${getApiBaseUrl()}. The browser cannot reach your laptop from the internet.`
  }

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && apiUrl.protocol === 'http:') {
    return `VITE_API_URL uses HTTP (${getApiBaseUrl()}) while this page is HTTPS. Use an HTTPS API URL or the browser may block requests (mixed content).`
  }

  return null
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
