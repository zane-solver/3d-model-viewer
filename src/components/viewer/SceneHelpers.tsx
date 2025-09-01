import { Box3Helper } from 'three'
import { useHelper, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { useRef } from 'react'
import { Object3D } from 'three'
import { useViewerStore } from '@/store/viewerStore'

interface SceneHelpersProps {
  model?: Object3D
}

export function SceneHelpers({ model }: SceneHelpersProps) {
  const { settings } = useViewerStore()
  const boxHelperRef = useRef<Box3Helper>(null)

  // Bounding box helper
  if (model && settings.showBoundingBox) {
    // @ts-ignore
    useHelper(boxHelperRef, Box3Helper, 'yellow')
  }

  return (
    <>
      {/* Axes Helper in corner */}
      {settings.showAxes && (
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={['red', 'green', 'blue']}
            labelColor="black"
          />
        </GizmoHelper>
      )}
    </>
  )
}
