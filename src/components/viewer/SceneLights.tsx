import { useRef } from 'react'
import { DirectionalLight } from 'three'

interface SceneLightsProps {
  showHelpers?: boolean
}

export function SceneLights({ showHelpers = false }: SceneLightsProps) {
  const directionalLightRef = useRef<DirectionalLight>(null)

  // Fixed lighting values for consistent rendering
  const ambientIntensity = 0.5
  const ambientColor = '#ffffff'
  const directionalIntensity = 1
  const directionalColor = '#ffffff'
  const directionalPosition: [number, number, number] = [5, 5, 5]

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight
        intensity={ambientIntensity}
        color={ambientColor}
      />

      {/* Main directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={directionalPosition}
        intensity={directionalIntensity}
        color={directionalColor}
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
        intensity={directionalIntensity * 0.3}
        color={directionalColor}
      />
    </>
  )
}
