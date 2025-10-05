import { useEffect, useRef, useState } from 'react'
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

  // Apply solid material (fixed mode)
  useEffect(() => {
    if (obj && isInitialized) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Always use solid material
          const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0.7, 0.7, 0.7),
            metalness: 0.3,
            roughness: 0.4,
            wireframe: settings.wireframe,
            side: THREE.DoubleSide,
          })

          child.material = material
          child.castShadow = true
          child.receiveShadow = true

          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals()
          }
        }
      })
    }
  }, [obj, settings.wireframe, isInitialized])

  return <primitive ref={meshRef} object={obj} />
}
