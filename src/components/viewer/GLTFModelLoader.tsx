import { useEffect, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'
import { useViewerStore } from '@/store/viewerStore'

interface GLTFModelLoaderProps {
  url: string
}

export function GLTFModelLoader({ url }: GLTFModelLoaderProps) {
  const { setError, setModelInfo, setAnimations, settings } = useViewerStore()
  const meshRef = useRef<THREE.Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load the GLTF file with Draco support
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(dracoLoader)
  })

  // Initialize model (only once when loaded)
  useEffect(() => {
    if (gltf && !isInitialized) {
      setError(null)

      let totalVertices = 0
      let totalFaces = 0
      let meshCount = 0
      const materials = new Set<THREE.Material>()

      gltf.scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          meshCount++

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

          // Collect unique materials
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => materials.add(mat))
            } else {
              materials.add(child.material)
            }
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

      setModelInfo({
        vertices: totalVertices,
        faces: Math.floor(totalFaces),
        meshCount,
        materialCount: materials.size
      })

      // Store animations if any
      if (gltf.animations && gltf.animations.length > 0) {
        setAnimations(gltf.animations)
      }

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      gltf.scene.position.set(-center.x, -center.y, -center.z)

      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 10) {
        const scale = 10 / maxDim
        gltf.scene.scale.setScalar(scale)
      }

      setIsInitialized(true)
    }

    return () => {
      if (isInitialized) {
        setModelInfo(null)
        setAnimations([])
      }
    }
  }, [gltf, isInitialized, setError, setModelInfo, setAnimations])

  // Handle wireframe setting for GLTF models
  // Note: GLTF models preserve their original PBR materials
  useEffect(() => {
    if (gltf && isInitialized) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]

          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.wireframe = settings.wireframe
            }
          })
        }
      })
    }
  }, [gltf, settings.wireframe, isInitialized])

  return <primitive ref={meshRef} object={gltf.scene} />
}
