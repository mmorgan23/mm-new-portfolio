import { Link, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { buttonVariants } from '@/components/ui/button'
import { getBlogPost } from '@/lib/blog'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getBlogPost(slug)

  if (!post) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className={buttonVariants({ variant: 'outline' })}>
          Back to blog
        </Link>
      </div>
    )
  }

  const { meta, body } = post

  return (
    <article className="mx-auto min-w-0 max-w-3xl space-y-6">
      <div className="min-w-0">
        <Link
          to="/blog"
          className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-4 min-h-10 touch-manipulation px-0' })}
        >
          ← Blog
        </Link>
        <p className="text-sm text-muted-foreground">
          {meta.date}
          {meta.readingMinutes != null ? ` · ${meta.readingMinutes} min read` : ''}
          {meta.category ? ` · ${meta.category}` : ''}
        </p>
        <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{meta.title}</h1>
        {meta.description ? (
          <p className="mt-3 text-pretty text-base text-muted-foreground sm:text-lg">{meta.description}</p>
        ) : null}
      </div>
      {meta.image ? (
        <figure className="overflow-hidden rounded-xl border border-border bg-muted/20">
          <img
            src={meta.image}
            alt={meta.imageAlt ?? ''}
            className="aspect-[1200/630] w-full object-cover"
            loading="eager"
            decoding="async"
          />
          {meta.imageAlt ? (
            <figcaption className="sr-only">{meta.imageAlt}</figcaption>
          ) : null}
        </figure>
      ) : null}
      <div className="markdown-body min-w-0 space-y-4 border-t border-border pt-6 text-sm leading-relaxed break-words [&_a]:break-words [&_a]:text-primary [&_a]:underline [&_code]:break-all [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold sm:[&_h2]:text-xl [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:ml-4 [&_ol]:list-decimal [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-xs sm:[&_pre]:text-sm [&_ul]:list-disc">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ alt, ...props }) => (
              <img
                {...props}
                alt={alt ?? ''}
                className="my-4 h-auto max-w-full rounded-lg border border-border/60"
                loading="lazy"
                decoding="async"
              />
            ),
          }}
        >
          {body}
        </Markdown>
      </div>
    </article>
  )
}
