import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUploadDialog } from '@/components/FileUploadDialog'
import { AboutDialog } from '@/components/AboutDialog'
import { ViewerContainer } from '@/components/viewer/ViewerContainer'
import { useViewerStore } from './store/viewerStore'
import { getAvailableModels } from '@/utils/modelList'

function App() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)
  const { setCurrentModel } = useViewerStore()

  useEffect(() => {
    const loadInitialModel = () => {
      const params = new URLSearchParams(window.location.search)
      const modelName = params.get('model')
      const availableModels = getAvailableModels()

      if (availableModels.length === 0) return

      let modelToLoad = availableModels[0] // Default to first model

      // If a specific model is requested via URL
      if (modelName) {
        const foundModel = availableModels.find(m =>
          m.fileName === modelName ||
          m.fileName.startsWith(modelName)
        )
        if (foundModel) {
          modelToLoad = foundModel
        } else {
          console.warn(`Model not found: ${modelName}. Loading first available model.`)
        }
      }

      setCurrentModel({
        id: Date.now().toString(),
        name: modelToLoad.fileName,
        url: modelToLoad.url,
        file: new File([], modelToLoad.fileName),
        fileType: modelToLoad.fileType,
        loaderType: modelToLoad.fileType === 'obj' ? 'obj' : 'gltf'
      })
    }

    loadInitialModel()
  }, [setCurrentModel])

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

  const handleAboutClick = () => {
    setAboutDialogOpen(true)
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
            onAboutClick={handleAboutClick}
          />
        }
      >
        <ViewerContainer />
      </MainLayout>

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />

      <AboutDialog
        open={aboutDialogOpen}
        onOpenChange={setAboutDialogOpen}
      />
    </>
  )
}

export default App