import { Link } from 'react-router-dom'
import { Code2, Layers, Mail, Sparkles } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const highlights = [
  {
    title: 'Agent orchestration',
    description:
      'Designing pipelines where specialized roles collaborate—planning, research, drafting, and QA—with observable handoffs.',
    icon: Layers,
  },
  {
    title: 'Full-stack AI systems',
    description:
      'Shipping APIs, streaming UX, and model integrations you can run in production, not just in a slide deck.',
    icon: Code2,
  },
  {
    title: 'This portfolio',
    description:
      'A live demo: Mel (COO) coordinates agents over WebSockets while FastAPI and Claude power the backend.',
    icon: Sparkles,
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto min-w-0 max-w-3xl space-y-12">
      <div className="min-w-0 space-y-4">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">About Me</p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">Melissa Morgan Whiz</h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base [&_p]:break-words">
          <p>
            I started my career in frontend and full-stack development, focused on building great user experiences. With
            8+ years of hands-on development, I've evolved alongside the technology stack, learning what it takes to move
            from proof-of-concept to enterprise-grade reliability.
          </p>
          <p>
            I led the design and deployment of a RAG-based platform that integrated OpenAI and Anthropic APIs into
            enterprise workflows. This wasn't just an experiment—we built it right from day one with evaluation
            frameworks, comprehensive monitoring, and governance embedded in the architecture.
          </p>
          <p>
            That success led me to focus on what I find most compelling: architecting multi-agent workflows that
            meaningfully reduce manual operational effort. I led the end-to-end design and delivery of an AI-powered
            internal platform with multi-agent and multimodal LLM workflows deployed across the entire company.
          </p>
          <p>
            This work proved that when agents are designed thoughtfully—with clear communication patterns, well-defined
            responsibilities, and proper oversight—they can handle complex workflows that previously required significant
            human coordination.
          </p>
          <p>
            Beyond the tech stack, what I care about is translating business problems into engineered AI solutions. I'm
            not interested in building for building's sake. For every system I architect, I ask: What problem does this
            actually solve? How do we know it's working? How do we ensure it stays reliable at scale?
          </p>
          <p>
            Interested in building intelligent systems together? I'd love to discuss opportunities where we can turn
            cutting-edge AI capabilities into solutions that matter.
          </p>
        </div>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">What I emphasize</h2>
        <div className="grid gap-4 sm:grid-cols-1">
          {highlights.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="border-border/80 bg-card/50">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-border/80 bg-muted/20">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="size-4 shrink-0 text-primary" aria-hidden />
            Get in touch
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            <a
              href="mailto:mmorganwhiz@gmail.com"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              mmorganwhiz@gmail.com
            </a>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link to="/dashboard" className={buttonVariants({ size: 'lg', className: 'min-h-12 w-full touch-manipulation sm:w-auto' })}>
          Try the agent dashboard
        </Link>
        <Link to="/blog" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'min-h-12 w-full touch-manipulation sm:w-auto' })}>
          Read the blog
        </Link>
      </div>
    </div>
  )
}
