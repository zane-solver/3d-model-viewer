// src/App.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">3D Model Viewer</h1>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            Setup completado. ¡Listo para comenzar con el visualizador 3D!
          </p>
          <Button>Test Button</Button>
        </Card>
      </div>
    </div>
  )
}

export default App
