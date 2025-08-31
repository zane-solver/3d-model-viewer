import { useEffect } from 'react'
import { Viewer3D } from './Viewer3D'
import { useViewerStore } from '@/store/viewerStore'

interface ViewerContainerProps {
  onReady?: () => void
}

export function ViewerContainer({ onReady }: ViewerContainerProps) {
  const { currentModel, isLoading } = useViewerStore()

  useEffect(() => {
    if (onReady) {
      onReady()
    }
  }, [onReady])

  if (!currentModel && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-900">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">No model loaded</p>
          <p className="text-zinc-600 text-sm">
            Upload a 3D model to visualize it here
          </p>
        </div>
      </div>
    )
  }

  return <Viewer3D />
}
