import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AIOrb } from '@/components/ui/AIOrb'

export function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50 relative">
            <Outlet />
          </main>
          <AIOrb />
        </div>
      </div>
    </QueryClientProvider>
  )
}
