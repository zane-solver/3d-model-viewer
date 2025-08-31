import { useRef } from 'react'
import { DirectionalLight } from 'three'
import { useHelper } from '@react-three/drei'

interface SceneLightsProps {
  showHelpers?: boolean
}

export function SceneLights({ showHelpers = false }: SceneLightsProps) {
  const directionalLightRef = useRef<DirectionalLight>(null)

  // Show light helper in development
  if (showHelpers && directionalLightRef.current) {
    useHelper(directionalLightRef, DirectionalLight, 1, 'yellow')
  }

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.5} />

      {/* Main directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 5, 5]}
        intensity={1}
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
        intensity={0.3}
      />

      {/* Top light for better definition */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.2}
      />
    </>
  )
}
