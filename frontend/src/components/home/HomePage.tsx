import { Link } from 'react-router-dom'
import { Bot, GitBranch, Radio, ShieldCheck } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    title: 'Multi-agent orchestration',
    description:
      'A COO-style orchestrator delegates to research, content, and QA agents so work mirrors real agentic pipelines.',
    icon: GitBranch,
  },
  {
    title: 'Real-time visibility',
    description:
      'WebSockets stream status, inter-agent messages, and reasoning so visitors see collaboration, not just a final blob.',
    icon: Radio,
  },
  {
    title: 'Quality loops',
    description:
      'QA reviews drafts, flags gaps, and drives a revision pass—demonstrating review cycles and human-grade bar setting.',
    icon: ShieldCheck,
  },
  {
    title: 'AI engineering depth',
    description:
      'FastAPI backend, structured events, and Claude streaming—built the way you would ship an internal agent platform.',
    icon: Bot,
  },
]

export function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Live portfolio</p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Meet the COO Agent Team
        </h1>
        <p className="mx-auto max-w-2xl text-pretty text-muted-foreground sm:mx-0 md:text-lg">
          I am <strong className="text-foreground">Mel</strong>, your AI Chief Operations Officer for this demo—analytical,
          polite, collaborative, detail-oriented, and a little obsessed with crisp handoffs. Submit a task and watch
          specialized agents plan, research, draft, and review in real time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Link to="/dashboard" className={buttonVariants({ size: 'lg' })}>
            Try the agent dashboard
          </Link>
          <Link to="/projects" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            View projects
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="border-border/80 bg-card/50">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
