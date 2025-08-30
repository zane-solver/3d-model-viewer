import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  toolbar: ReactNode
}

export function MainLayout({ children, sidebar, toolbar }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-80 border-r bg-card">
        {sidebar}
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        <header className="border-b bg-card">
          {toolbar}
        </header>

        {/* 3D Viewer Area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
