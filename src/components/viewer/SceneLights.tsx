import { useRef } from 'react'
import { DirectionalLight } from 'three'
import { useViewerStore } from '@/store/viewerStore'

interface SceneLightsProps {
  showHelpers?: boolean
}

export function SceneLights({ showHelpers = false }: SceneLightsProps) {
  const directionalLightRef = useRef<DirectionalLight>(null)
  const { lightSettings } = useViewerStore()

  // Show light helper in development
  if (showHelpers && directionalLightRef.current) {
    // useHelper(directionalLightRef, DirectionalLight, 1, 'yellow')
  }

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight
        intensity={lightSettings.ambient.intensity}
        color={lightSettings.ambient.color}
      />

      {/* Main directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={lightSettings.directional.position}
        intensity={lightSettings.directional.intensity}
        color={lightSettings.directional.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light from opposite direction */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={lightSettings.directional.intensity * 0.3}
        color={lightSettings.directional.color}
      />
    </>
  )
}
