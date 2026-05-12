import { getApiConfigWarning } from '@/lib/env'

export function ProductionApiBanner() {
  const warning = getApiConfigWarning()
  if (!warning) return null

  return (
    <div
      role="alert"
      className="border-b border-amber-500/40 bg-amber-500/10 px-3 py-3 text-center text-sm text-amber-100 sm:px-6"
    >
      <p className="mx-auto max-w-3xl font-medium">{warning}</p>
      <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-amber-100/90">
        In Vercel: Project → Settings → Environment Variables → set{' '}
        <code className="rounded bg-black/30 px-1 py-0.5 font-mono text-[0.8rem]">VITE_API_URL</code> to your public
        FastAPI origin (example: <code className="font-mono text-[0.8rem]">https://your-api.up.railway.app</code>), then
        trigger a new deployment. Keep{' '}
        <code className="rounded bg-black/30 px-1 py-0.5 font-mono text-[0.8rem]">CLAUDE_API_KEY</code> on Railway or
        Render only, not in Vercel.
      </p>
    </div>
  )
}
