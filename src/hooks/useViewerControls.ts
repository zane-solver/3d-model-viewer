import { useCallback } from 'react'
import { useThree } from '@react-three/fiber'

export function useViewerControls() {
  const { camera } = useThree()

  const zoomIn = useCallback(() => {
    if (camera) {
      camera.position.multiplyScalar(0.8)
      camera.updateProjectionMatrix()
    }
  }, [camera])

  const zoomOut = useCallback(() => {
    if (camera) {
      camera.position.multiplyScalar(1.2)
      camera.updateProjectionMatrix()
    }
  }, [camera])

  const resetView = useCallback(() => {
    window.dispatchEvent(new Event('reset-camera'))
  }, [])

  return {
    zoomIn,
    zoomOut,
    resetView
  }
}
