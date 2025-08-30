import { MainLayout } from '@/components/layout/MainLayout'
import { Toolbar } from '@/components/layout/Toolbar'
import { Sidebar } from '@/components/layout/Sidebar'

function App() {
  // Handlers temporales
  const handleFileUpload = () => console.log('Upload file')
  const handleResetView = () => console.log('Reset view')
  const handleZoomIn = () => console.log('Zoom in')
  const handleZoomOut = () => console.log('Zoom out')
  const handleToggleFullscreen = () => console.log('Toggle fullscreen')
  const handleToggleGrid = () => console.log('Toggle grid')
  const handleToggleWireframe = () => console.log('Toggle wireframe')

  return (
    <MainLayout
      toolbar={
        <Toolbar
          onFileUpload={handleFileUpload}
          onResetView={handleResetView}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleGrid={handleToggleGrid}
          onToggleWireframe={handleToggleWireframe}
        />
      }
      sidebar={<Sidebar />}
    >
      <div className="flex h-full items-center justify-center bg-zinc-900">
        <p className="text-zinc-500">3D Viewer will be here</p>
      </div>
    </MainLayout>
  )
}

export default App
