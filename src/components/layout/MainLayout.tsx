import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r bg-card/50 backdrop-blur-sm">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative">{children}</main>
    </div>
  )
}