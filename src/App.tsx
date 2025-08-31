import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Toolbar } from '@/components/layout/Toolbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUploadDialog } from '@/components/FileUploadDialog'
import { useViewerStore } from '@/store/viewerStore'

function App() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { currentModel } = useViewerStore()

  // Handlers
  const handleFileUpload = () => setUploadDialogOpen(true)
  const handleResetView = () => console.log('Reset view')
  const handleZoomIn = () => console.log('Zoom in')
  const handleZoomOut = () => console.log('Zoom out')
  const handleToggleFullscreen = () => console.log('Toggle fullscreen')
  const handleToggleGrid = () => console.log('Toggle grid')
  const handleToggleWireframe = () => console.log('Toggle wireframe')

  return (
    <>
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
          {currentModel ? (
            <div className="text-center">
              <p className="text-zinc-400 mb-2">Model loaded:</p>
              <p className="text-white font-medium">{currentModel.name}</p>
              <p className="text-zinc-500 text-sm mt-4">
                3D Viewer coming next...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-zinc-500 mb-4">No model loaded</p>
              <button
                onClick={handleFileUpload}
                className="text-primary hover:underline text-sm"
              >
                Upload a 3D model to get started
              </button>
            </div>
          )}
        </div>
      </MainLayout>

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </>
  )
}

export default App
