import { Link, NavLink } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-foreground',
    isActive ? 'text-foreground' : 'text-muted-foreground',
  )

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="font-semibold tracking-tight text-foreground">
          Melissa Morgan Whiz - AI Demo
        </Link>
        <nav className="flex items-center gap-2 sm:gap-6" aria-label="Main">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={navClass}>
            Agent Dashboard
          </NavLink>
          <NavLink to="/blog" className={navClass}>
            Blog
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About Me
          </NavLink>
          {/* <NavLink to="/projects" className={navClass}>
            Projects
          </NavLink> */}
        </nav>
        <Link to="/dashboard" className={buttonVariants({ size: 'sm' })}>
          Try agents
        </Link>
      </div>
    </header>
  )
}
