import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-foreground',
    isActive ? 'text-foreground' : 'text-muted-foreground',
  )

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted',
    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
  )

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="min-w-0 flex-1 truncate pr-2 text-left text-sm font-semibold tracking-tight text-foreground sm:text-base"
        >
          Melissa Morgan Whiz - AI Demo
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-6" aria-label="Main">
          <NavLink to="/" end className={navClass}>
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
        </nav>

        <div className="hidden shrink-0 md:block">
          <Link to="/dashboard" className={buttonVariants({ size: 'sm', className: 'touch-manipulation' })}>
            Try agents
          </Link>
        </div>

        <button
          type="button"
          className="touch-manipulation rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/60 touch-manipulation md:hidden"
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <div
            id="mobile-nav"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw-2rem,20rem)] max-w-[calc(100vw-1rem)] flex-col border-l border-border bg-card p-4 shadow-2xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button
                type="button"
                className="touch-manipulation rounded-lg p-2 hover:bg-muted"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Main">
              <NavLink to="/" end className={mobileNavClass} onClick={closeMobile}>
                Home
              </NavLink>
              <NavLink to="/dashboard" className={mobileNavClass} onClick={closeMobile}>
                Agent Dashboard
              </NavLink>
              <NavLink to="/blog" className={mobileNavClass} onClick={closeMobile}>
                Blog
              </NavLink>
              <NavLink to="/about" className={mobileNavClass} onClick={closeMobile}>
                About Me
              </NavLink>
            </nav>
            <div className="border-t border-border pt-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <Link
                to="/dashboard"
                className={buttonVariants({ size: 'default', className: 'w-full touch-manipulation' })}
                onClick={closeMobile}
              >
                Try agents
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  )
}
