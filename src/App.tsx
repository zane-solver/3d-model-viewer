import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUploadDialog } from '@/components/FileUploadDialog'
import { ViewerContainer } from '@/components/viewer/ViewerContainer'

function App() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

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
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <>
      <MainLayout
        sidebar={
          <Sidebar
            onFileUpload={() => setUploadDialogOpen(true)}
            onResetView={handleResetView}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleFullscreen={handleToggleFullscreen}
          />
        }
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