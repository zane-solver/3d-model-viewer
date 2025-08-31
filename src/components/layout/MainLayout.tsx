import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  toolbar: ReactNode
}

export function MainLayout({ children, sidebar, toolbar }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed width */}
      <aside className="w-80 flex-shrink-0 border-r bg-card/50 backdrop-blur">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Toolbar - Fixed height */}
        <header className="h-14 flex-shrink-0 border-b bg-card/50 backdrop-blur">
          {toolbar}
        </header>

        {/* 3D Viewer Area - Takes remaining space */}
        <main className="flex-1 relative overflow-hidden bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
