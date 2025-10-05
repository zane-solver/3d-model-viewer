import { GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Object3D } from 'three'

interface SceneHelpersProps {
  model?: Object3D
}

export function SceneHelpers({ model }: SceneHelpersProps) {
  return (
    <>
      {/* Axes Helper in corner - always shown */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={['red', 'green', 'blue']}
          labelColor="black"
        />
      </GizmoHelper>
    </>
  )
}
