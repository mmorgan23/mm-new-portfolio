const rawModules = import.meta.glob<string>('../../../blog_content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export type BlogPostMeta = {
  slug: string
  title: string
  date: string
  category?: string
  readingMinutes?: number
  description?: string
  /** Path under `public/` (e.g. `/blog/foo.jpg`) or full URL */
  image?: string
  imageAlt?: string
}

export type BlogPost = {
  meta: BlogPostMeta
  body: string
}

function parseYamlScalar(raw: string): string | number {
  const s = raw.trim()
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1)
  }
  const n = Number(s)
  if (!Number.isNaN(n) && s !== '') return n
  return s
}

function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/)
  if (!match) return { data: {}, body: content }
  const data: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    if (!key) continue
    data[key] = parseYamlScalar(line.slice(idx + 1))
  }
  return { data, body: match[2] }
}

function slugFromPath(path: string) {
  const base = path.split('/').pop() ?? ''
  return base.replace(/\.md$/i, '')
}

export function listBlogMeta(): BlogPostMeta[] {
  const items: BlogPostMeta[] = []
  for (const [path, raw] of Object.entries(rawModules)) {
    const slug = slugFromPath(path)
    const { data, body } = parseFrontmatter(raw)
    const title = String(data.title ?? slug)
    const date = String(data.date ?? '')
    const category = data.category != null ? String(data.category) : undefined
    const readingMinutes =
      typeof data.readingTime === 'number'
        ? data.readingTime
        : typeof data.readingMinutes === 'number'
          ? data.readingMinutes
          : undefined
    const description =
      data.description != null
        ? String(data.description)
        : body.trim().split('\n').find(Boolean)?.slice(0, 140)
    const image = data.image != null ? String(data.image) : undefined
    const imageAlt =
      data.imageAlt != null
        ? String(data.imageAlt)
        : data.image_alt != null
          ? String(data.image_alt)
          : undefined
    items.push({ slug, title, date, category, readingMinutes, description, image, imageAlt })
  }
  return items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function getBlogPost(slug: string): BlogPost | null {
  for (const [path, raw] of Object.entries(rawModules)) {
    if (slugFromPath(path) !== slug) continue
    const { data, body } = parseFrontmatter(raw)
    const meta: BlogPostMeta = {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      category: data.category != null ? String(data.category) : undefined,
      readingMinutes:
        typeof data.readingTime === 'number'
          ? data.readingTime
          : typeof data.readingMinutes === 'number'
            ? data.readingMinutes
            : undefined,
      description: data.description != null ? String(data.description) : undefined,
      image: data.image != null ? String(data.image) : undefined,
      imageAlt:
        data.imageAlt != null
          ? String(data.imageAlt)
          : data.image_alt != null
            ? String(data.image_alt)
            : undefined,
    }
    return { meta, body: body.trim() }
  }
  return null
}
