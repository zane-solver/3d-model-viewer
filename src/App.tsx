import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUploadDialog } from '@/components/FileUploadDialog'
import { ViewerContainer } from '@/components/viewer/ViewerContainer'
import { useViewerStore } from './store/viewerStore'
import defaultModelUrl from '@/assets/default.obj?url'

// Use Vite's import.meta.glob to get all .obj files as URLs
const modelUrls = import.meta.glob('@/assets/*.obj', { as: 'url', eager: true })

function App() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { setCurrentModel } = useViewerStore()

  useEffect(() => {
    const loadModelFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      const modelName = params.get('model')
      let modelUrl = defaultModelUrl
      let name = 'default.obj'

      if (modelName) {
        // The keys in modelUrls will be like '/src/assets/model.obj'
        const modelKey = `/src/assets/${modelName}`

        if (modelUrls[modelKey]) {
          modelUrl = modelUrls[modelKey]
          name = modelName
        } else {
          console.warn(`Model not found: ${modelName}. Loading default model.`)
        }
      }

      const model = {
        id: name,
        name: name,
        url: modelUrl,
        file: new File([], name),
      }
      setCurrentModel(model)
    }

    loadModelFromUrl()
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