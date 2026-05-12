import { Link, useParams } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getProject } from '@/lib/projects'

export default function ProjectDetailPage() {
  const { id = '' } = useParams()
  const project = getProject(id)

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/projects" className={buttonVariants({ variant: 'outline' })}>
          Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/projects" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'px-0' })}>
        ← Projects
      </Link>
      {project.image ? (
        <img
          src={project.image}
          alt=""
          className="aspect-video w-full rounded-lg border border-border object-cover"
        />
      ) : null}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 text-muted-foreground">{project.description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tech stack</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-3">
        {project.demoUrl ? (
          <a href={project.demoUrl} target="_blank" rel="noreferrer" className={buttonVariants({ size: 'lg' })}>
            Live demo
          </a>
        ) : null}
        {project.repoUrl ? (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Repository
          </a>
        ) : null}
      </div>
    </div>
  )
}
