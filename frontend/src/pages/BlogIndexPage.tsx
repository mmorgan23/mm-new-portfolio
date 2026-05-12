import { Link } from 'react-router-dom'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BlogPostMeta } from '@/lib/blog'

type Props = {
  posts: BlogPostMeta[]
}

export default function BlogIndexPage({ posts }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">Notes on agents, orchestration, and shipping reliable AI systems.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`}>
              <Card className="h-full overflow-hidden border-border/80 transition-colors hover:border-primary/40">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.imageAlt ?? ''}
                    className="aspect-[1200/420] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <CardHeader>
                  <p className="text-xs text-muted-foreground">
                    {p.date}
                    {p.readingMinutes ? ` · ${p.readingMinutes} min read` : ''}
                    {p.category ? ` · ${p.category}` : ''}
                  </p>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  {p.description ? <CardDescription>{p.description}</CardDescription> : null}
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
