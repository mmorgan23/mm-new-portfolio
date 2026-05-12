import { Outlet } from 'react-router-dom'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function Layout() {
  return (
    <>
      <Header />
      <main className="mx-auto min-w-0 w-full max-w-6xl flex-1 px-3 py-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
