import { useState, useRef } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Toolbar } from '@/components/layout/Toolbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUploadDialog } from '@/components/FileUploadDialog'
import { ViewerContainer } from '@/components/viewer/ViewerContainer'
import { useViewerStore } from '@/store/viewerStore'

function App() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { updateSettings, settings } = useViewerStore()

  // Camera control functions
  const handleResetView = () => {
    window.dispatchEvent(new Event('reset-camera'))
  }

  const handleZoomIn = () => {
    window.dispatchEvent(new Event('zoom-in'))
  }

  const handleZoomOut = () => {
    window.dispatchEvent(new Event('zoom-out'))
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleToggleGrid = () => {
    updateSettings({ showGrid: !settings.showGrid })
  }

  const handleToggleWireframe = () => {
    updateSettings({ wireframe: !settings.wireframe })
  }

  return (
    <>
      <MainLayout
        toolbar={
          <Toolbar
            onFileUpload={() => setUploadDialogOpen(true)}
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
        <ViewerContainer />
      </MainLayout>

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </>
  )
}

export default App
