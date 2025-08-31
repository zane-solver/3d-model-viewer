import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Center, Loader, Html } from '@react-three/drei'
import { useViewerStore } from '@/store/viewerStore'
import { ModelLoader } from './ModelLoader'
import { SceneLights } from './SceneLights'
import { ErrorBoundary } from './ErrorBoundary'
import * as THREE from 'three'

// Loading component
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p>Loading 3D Model...</p>
      </div>
    </Html>
  )
}

// Camera Controller component
function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const { settings } = useViewerStore()

  useEffect(() => {
    const handleZoomIn = () => {
      camera.position.multiplyScalar(0.8)
      camera.updateProjectionMatrix()
    }

    const handleZoomOut = () => {
      camera.position.multiplyScalar(1.2)
      camera.updateProjectionMatrix()
    }

    const handleReset = () => {
      if (controlsRef.current) {
        controlsRef.current.reset()
      }
    }

    window.addEventListener('zoom-in', handleZoomIn)
    window.addEventListener('zoom-out', handleZoomOut)
    window.addEventListener('reset-camera', handleReset)

    return () => {
      window.removeEventListener('zoom-in', handleZoomIn)
      window.removeEventListener('zoom-out', handleZoomOut)
      window.removeEventListener('reset-camera', handleReset)
    }
  }, [camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.05}
      minDistance={1}
      maxDistance={50}
      maxPolarAngle={Math.PI / 2 + 0.3}
      autoRotate={settings.autoRotate}
      autoRotateSpeed={settings.autoRotateSpeed}
    />
  )
}

export function Viewer3D() {
  const { settings, currentModel, error } = useViewerStore()

  return (
    <ErrorBoundary>
      <div className="relative w-full h-full">
        <Canvas
          camera={{
            position: [5, 5, 5],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1,
          }}
          style={{ background: settings.backgroundColor }}
        >
          {/* Lights */}
          <SceneLights />

          {/* Grid */}
          {settings.showGrid && (
            <Grid
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#6b7280"
              sectionSize={2}
              sectionThickness={1}
              sectionColor="#374151"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
            />
          )}

          {/* Model */}
          {currentModel && (
            <Suspense fallback={<LoadingFallback />}>
              <Center>
                <ModelLoader
                  url={currentModel.url}
                  wireframe={settings.wireframe}
                  autoRotate={settings.autoRotate}
                />
              </Center>
            </Suspense>
          )}

          {/* Camera Controller */}
          <CameraController />
        </Canvas>

        {/* Error message overlay */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded-md">
            {error}
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
