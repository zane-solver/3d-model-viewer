import { ReactNode, useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

interface MainLayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex border flex-shrink-0 border-r bg-card/50 backdrop-blur-sm">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Mobile Menu Button */}
        <div className="lg:hidden absolute top-4 left-4 z-50">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 sm:w-96">
              {sidebar}
            </SheetContent>
          </Sheet>
        </div>

        {children}
      </main>
    </div>
  )
}
