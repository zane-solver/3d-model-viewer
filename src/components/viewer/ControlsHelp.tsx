import { Card, CardContent } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

export function ControlsHelp() {
  return (
    <Card className="absolute top-4 right-4 w-64 bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <HelpCircle className="w-5 h-5 mr-2 text-primary" />
          <h3 className="font-semibold">Controls</h3>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Rotate:</span>
            <span className="font-medium text-foreground">Left Mouse</span>
          </div>
          <div className="flex justify-between">
            <span>Zoom:</span>
            <span className="font-medium text-foreground">Mouse Wheel</span>
          </div>
          <div className="flex justify-between">
            <span>Pan:</span>
            <span className="font-medium text-foreground">Right Mouse</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
