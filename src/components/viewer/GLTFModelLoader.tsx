import { useEffect, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'
import { useViewerStore } from '@/store/viewerStore'

// Suppress console errors from GLTFLoader for missing textures
const originalConsoleError = console.error
const suppressTextureErrors = (...args: any[]) => {
  const message = args[0]
  if (typeof message === 'string' && message.includes('GLTFLoader') && message.includes('texture')) {
    // Suppress texture loading errors
    return
  }
  originalConsoleError(...args)
}

interface GLTFModelLoaderProps {
  url: string
}

export function GLTFModelLoader({ url }: GLTFModelLoaderProps) {
  const { setError, setModelInfo, setAnimations, settings, currentModel } = useViewerStore()
  const meshRef = useRef<THREE.Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Suppress texture errors temporarily
  useEffect(() => {
    console.error = suppressTextureErrors
    return () => {
      console.error = originalConsoleError
    }
  }, [])

  // Load the GLTF file with Draco support
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(dracoLoader)

    // Create custom loader manager that doesn't throw on texture errors
    const customManager = new THREE.LoadingManager()
    customManager.onError = () => {
      // Silently ignore all loading errors
    }

    // Override the default manager
    loader.manager = customManager
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

          // Fix broken materials/textures
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material]
            materials.forEach(mat => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                // If texture failed to load, remove the reference
                if (mat.map && mat.map.image === undefined) {
                  console.warn('Removing broken texture from material')
                  mat.map = null
                  mat.needsUpdate = true
                }
                // Same for other texture maps
                if (mat.normalMap && mat.normalMap.image === undefined) {
                  mat.normalMap = null
                  mat.needsUpdate = true
                }
                if (mat.roughnessMap && mat.roughnessMap.image === undefined) {
                  mat.roughnessMap = null
                  mat.needsUpdate = true
                }
                if (mat.metalnessMap && mat.metalnessMap.image === undefined) {
                  mat.metalnessMap = null
                  mat.needsUpdate = true
                }
              }
            })
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

      // Apply model-specific rotations
      const modelName = currentModel?.name?.toLowerCase() || ''
      console.log('Loading model:', modelName) // Debug

      // Extract model number from filename (e.g., "2.glb" or "2-something.glb")
      const modelNumber = modelName.match(/^(\d+)[-.]/)
      console.log('Detected model number:', modelNumber ? modelNumber[1] : 'none') // Debug

      if (modelNumber && modelNumber[1] === '2') {
        // Rotate model 2 by 180 degrees on Y axis
        console.log('Applying 180° Y rotation to model 2') // Debug
        gltf.scene.rotation.y = Math.PI // 180 degrees in radians
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
