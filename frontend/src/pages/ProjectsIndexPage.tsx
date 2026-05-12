import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { listProjects } from '@/lib/projects'

export default function ProjectsIndexPage() {
  const projects = listProjects()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-2 text-muted-foreground">Selected builds with live demos and notes on how they were shipped.</p>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Card className="flex h-full flex-col border-border/80">
              <CardHeader>
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="mb-3 aspect-video w-full rounded-md border border-border object-cover"
                  />
                ) : null}
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex flex-wrap gap-2">
                <Link to={`/projects/${p.id}`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                  Details
                </Link>
                {p.demoUrl ? (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ size: 'sm' })}
                  >
                    View demo
                  </a>
                ) : null}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
