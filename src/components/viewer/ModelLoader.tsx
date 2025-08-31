import { useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import { useViewerStore } from '@/store/viewerStore'

interface ModelLoaderProps {
  url: string
  wireframe?: boolean
  autoRotate?: boolean
}

export function ModelLoader({ url, wireframe = false }: ModelLoaderProps) {
  const { setError } = useViewerStore()
  const meshRef = useRef<THREE.Group>(null)

  // Load the OBJ file
  const obj = useLoader(
    OBJLoader,
    url,
    // onProgress
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // onError
    (error) => {
      console.error('Error loading OBJ:', error)
      setError('Failed to load 3D model')
    }
  )

  useEffect(() => {
    if (obj) {
      // Clear any previous errors
      setError(null)

      // Calculate bounding box for proper centering
      const box = new THREE.Box3().setFromObject(obj)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // Center the object
      obj.position.x = -center.x
      obj.position.y = -center.y
      obj.position.z = -center.z

      // Scale if too large
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 10) {
        const scale = 10 / maxDim
        obj.scale.multiplyScalar(scale)
      }

      // Apply materials to all meshes
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Preserve original material if exists, otherwise create new
          if (!child.material || child.material.type === 'MeshBasicMaterial') {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.7, 0.7, 0.7),
              metalness: 0.3,
              roughness: 0.4,
              wireframe: wireframe,
              side: THREE.DoubleSide,
            })
          } else if (child.material) {
            // Update existing material
            child.material.wireframe = wireframe
            child.material.needsUpdate = true
          }

          // Enable shadows
          child.castShadow = true
          child.receiveShadow = true

          // Compute normals if missing
          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals()
          }
        }
      })
    }
  }, [obj, wireframe, setError])

  return <primitive ref={meshRef} object={obj} />
}
