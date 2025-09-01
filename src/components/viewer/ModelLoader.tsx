import { useEffect, useRef, useState, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import * as THREE from 'three'
import { useViewerStore } from '@/store/viewerStore'

interface ModelLoaderProps {
  url: string
  autoRotate?: boolean
}

export function ModelLoader({ url }: ModelLoaderProps) {
  const { setError, setModelInfo, settings } = useViewerStore()
  const meshRef = useRef<THREE.Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null)

  // Crear textura matcap procedural
  const matcapTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')!

    // Crear gradiente radial para efecto matcap
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.5, '#8888ff')
    gradient.addColorStop(1, '#000033')

    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [])

  // Load the OBJ file
  // @ts-ignore
  const obj = useLoader(
    OBJLoader,
    url,
    // @ts-ignore
    // (xhr) => {
    //   if (xhr.lengthComputable) {
    //     const percentComplete = (xhr.loaded / xhr.total) * 100
    //     console.log(percentComplete + '% loaded')
    //   }
    // }
  )

  // Initialize model (only once when loaded)
  useEffect(() => {
    if (obj && !isInitialized) {
      setError(null)

      let totalVertices = 0
      let totalFaces = 0

      obj.traverse((child: THREE.Object3D) => {
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

      // Guardar el bounding box
      setBoundingBox(box)

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

  return (
    <>
      <primitive ref={meshRef} object={obj} />
      {/* Bounding Box con líneas simples */}
      {settings.showBoundingBox && boundingBox && (
        <BoundingBoxHelper box={boundingBox} />
      )}
    </>
  )
}

// Componente helper para el bounding box
function BoundingBoxHelper({ box }: { box: THREE.Box3 }) {
  const vertices = useMemo(() => {
    const min = box.min
    const max = box.max

    const verticesArray = [
      // Bottom face
      [min.x, min.y, min.z], [max.x, min.y, min.z],
      [max.x, min.y, min.z], [max.x, min.y, max.z],
      [max.x, min.y, max.z], [min.x, min.y, max.z],
      [min.x, min.y, max.z], [min.x, min.y, min.z],
      // Top face
      [min.x, max.y, min.z], [max.x, max.y, min.z],
      [max.x, max.y, min.z], [max.x, max.y, max.z],
      [max.x, max.y, max.z], [min.x, max.y, max.z],
      [min.x, max.y, max.z], [min.x, max.y, min.z],
      // Vertical edges
      [min.x, min.y, min.z], [min.x, max.y, min.z],
      [max.x, min.y, min.z], [max.x, max.y, min.z],
      [max.x, min.y, max.z], [max.x, max.y, max.z],
      [min.x, min.y, max.z], [min.x, max.y, max.z],
    ].flat()

    return new Float32Array(verticesArray)
  }, [box])

  return (
    <lineSegments>
      <bufferGeometry>
          // @ts-ignore
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          array={new Float32Array(vertices)}
          itemSize={3}
          args={[vertices, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="yellow" />
    </lineSegments>
  )
}
