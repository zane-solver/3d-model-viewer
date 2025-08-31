import { useEffect, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import { useViewerStore } from '@/store/viewerStore'
import { useTexture } from '@react-three/drei'
import { Box3Helper } from 'three'
import { useHelper } from '@react-three/drei'

interface ModelLoaderProps {
  url: string
  wireframe?: boolean
  autoRotate?: boolean
}

export function ModelLoader({ url, wireframe = false }: ModelLoaderProps) {
  const { setError, setModelInfo, settings } = useViewerStore()
  const meshRef = useRef<THREE.Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load matcap texture
  const matcapTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')!

    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.5, '#8888ff')
    gradient.addColorStop(1, '#000033')

    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)
    texture.encoding = THREE.sRGBEncoding
    return texture
  }, [])

  // Load the OBJ file
  const obj = useLoader(
    OBJLoader,
    url,
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.error('Error loading OBJ:', error)
      setError('Failed to load 3D model')
    }
  )

  // Initialize model (only once when loaded)
  useEffect(() => {
    if (obj && !isInitialized) {
      setError(null)

      let totalVertices = 0
      let totalFaces = 0

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geometry = child.geometry
          if (geometry) {
            if (geometry.attributes.position) {
              totalVertices += geometry.attributes.position.count
            }
            if (geometry.index) {
              totalFaces += geometry.index.count / 3
            } else {
              totalFaces += geometry.attributes.position.count / 3
            }
          }
        }
      })

      setModelInfo({
        vertices: totalVertices,
        faces: Math.floor(totalFaces)
      })

      const box = new THREE.Box3().setFromObject(obj)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      obj.position.set(-center.x, -center.y, -center.z)

      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 10) {
        const scale = 10 / maxDim
        obj.scale.setScalar(scale)
      }

      setIsInitialized(true)
    }

    return () => {
      if (isInitialized) {
        setModelInfo(null)
      }
    }
  }, [obj, isInitialized, setError, setModelInfo])

  // Update materials when render mode changes
  useEffect(() => {
    if (obj && isInitialized) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Create material based on render mode
          let material: THREE.Material

          switch (settings.renderMode) {
            case 'wireframe':
              material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(0.5, 0.5, 1),
                wireframe: true,
                side: THREE.DoubleSide,
              })
              break

            case 'normal':
              material = new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide,
                flatShading: false,
              })
              break

            case 'matcap':
              material = new THREE.MeshMatcapMaterial({
                matcap: matcapTexture,
                side: THREE.DoubleSide,
              })
              break

            case 'depth':
              material = new THREE.MeshDepthMaterial({
                side: THREE.DoubleSide,
              })
              break

            case 'solid':
            default:
              material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0.7, 0.7, 0.7),
                metalness: 0.3,
                roughness: 0.4,
                wireframe: settings.wireframe,
                side: THREE.DoubleSide,
              })
              break
          }

          child.material = material
          child.castShadow = true
          child.receiveShadow = true

          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals()
          }
        }
      })
    }
  }, [obj, settings.renderMode, settings.wireframe, isInitialized, matcapTexture])

  const boxHelperRef = useRef<THREE.Box3Helper>(null)

  useHelper(settings.showBoundingBox ? meshRef : null, Box3Helper, 'yellow')

  return <primitive ref={meshRef} object={obj} />
}
