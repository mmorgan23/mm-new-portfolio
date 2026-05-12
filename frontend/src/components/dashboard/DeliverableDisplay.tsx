import { useCallback } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DeliverableDisplayProps = {
  markdown: string | null
}

export function DeliverableDisplay({ markdown }: DeliverableDisplayProps) {
  const handleCopy = useCallback(async () => {
    if (!markdown) return
    await navigator.clipboard.writeText(markdown)
  }, [markdown])

  const handleDownload = useCallback(() => {
    if (!markdown) return
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'deliverable.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [markdown])

  if (!markdown) {
    return (
      <Card className="border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Deliverable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Final output appears here after QA approves.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex min-h-0 min-w-0 flex-col border-border/80">
      <CardHeader className="shrink-0 flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base">Deliverable</CardTitle>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            Copy
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={handleDownload}>
            Download .md
          </Button>
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-4 pb-4 pt-0">
        {/* Explicit height establishes a scrollport; max-h alone can fail inside flex/overflow-hidden cards */}
        <div className="h-[min(70vh,42rem)] w-full min-h-[14rem] touch-pan-y overflow-y-auto overflow-x-auto overscroll-y-contain rounded-md border border-border/60 bg-card/40 p-4 [scrollbar-gutter:stable]">
          <article className="markdown-body min-w-0 max-w-full space-y-3 break-words text-sm leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline [&_code]:break-all [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:text-lg [&_h2]:font-medium [&_img]:max-w-full [&_img]:h-auto [&_li]:ml-4 [&_ol]:list-decimal [&_pre]:max-h-72 [&_pre]:overflow-x-auto [&_pre]:overflow-y-auto [&_pre]:whitespace-pre [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_table]:w-full [&_table]:max-w-full [&_table]:text-sm [&_ul]:list-disc">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ alt, ...props }) => (
                  <img {...props} alt={alt ?? ''} className="h-auto max-w-full rounded-md" loading="lazy" />
                ),
              }}
            >
              {markdown}
            </Markdown>
          </article>
        </div>
      </CardContent>
    </Card>
  )
}
