import { useEffect, useRef, useState } from 'react'
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
  const { setError, setModelInfo } = useViewerStore()
  const meshRef = useRef<THREE.Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)

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

  // Initialize model (only once when loaded)
  useEffect(() => {
    if (obj && !isInitialized) {
      // Clear any previous errors
      setError(null)

      // Count vertices and faces
      let totalVertices = 0
      let totalFaces = 0

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geometry = child.geometry
          if (geometry) {
            // Count vertices
            if (geometry.attributes.position) {
              totalVertices += geometry.attributes.position.count
            }

            // Count faces (triangles)
            if (geometry.index) {
              totalFaces += geometry.index.count / 3
            } else {
              totalFaces += geometry.attributes.position.count / 3
            }
          }
        }
      })

      // Update model info in store
      setModelInfo({
        vertices: totalVertices,
        faces: Math.floor(totalFaces)
      })

      // Calculate bounding box for proper centering
      const box = new THREE.Box3().setFromObject(obj)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // Center the object (only once!)
      obj.position.set(-center.x, -center.y, -center.z)

      // Scale if too large (only once!)
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 10) {
        const scale = 10 / maxDim
        obj.scale.setScalar(scale)
      }

      // Mark as initialized
      setIsInitialized(true)
    }

    // Cleanup function
    return () => {
      if (isInitialized) {
        setModelInfo(null)
      }
    }
  }, [obj, isInitialized, setError, setModelInfo])

  // Update materials when wireframe changes
  useEffect(() => {
    if (obj && isInitialized) {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            // If it's an array of materials
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.wireframe = wireframe
                mat.needsUpdate = true
              })
            } else {
              // Single material
              child.material.wireframe = wireframe
              child.material.needsUpdate = true
            }
          } else {
            // Create new material if none exists
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0.7, 0.7, 0.7),
              metalness: 0.3,
              roughness: 0.4,
              wireframe: wireframe,
              side: THREE.DoubleSide,
            })
          }

          // Ensure shadows are enabled
          child.castShadow = true
          child.receiveShadow = true

          // Compute normals if missing (only if not already computed)
          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals()
          }
        }
      })
    }
  }, [obj, wireframe, isInitialized])

  return <primitive ref={meshRef} object={obj} />
}
