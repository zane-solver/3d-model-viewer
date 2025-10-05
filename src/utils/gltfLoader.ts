import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'

export interface GLTFLoadResult {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
  cameras: THREE.Camera[]
  materials: THREE.Material[]
  meshCount: number
  vertexCount: number
  faceCount: number
}

export class GLTFLoaderWrapper {
  private loader: GLTFLoader
  private dracoLoader: DRACOLoader

  constructor() {
    this.loader = new GLTFLoader()

    // Setup Draco decoder for compressed GLTF files
    this.dracoLoader = new DRACOLoader()
    // Use CDN for Draco decoder (easier than bundling the WASM files)
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    this.loader.setDRACOLoader(this.dracoLoader)
  }

  async load(file: File): Promise<GLTFLoadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const blob = new Blob([arrayBuffer])
        const url = URL.createObjectURL(blob)

        this.loader.load(
          url,
          (gltf) => {
            URL.revokeObjectURL(url)

            // Preservar materiales originales y asegurar renderizado correcto
            gltf.scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (child.material) {
                  // Asegurar que los materiales se rendericen correctamente
                  if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                      mat.needsUpdate = true
                      // Asegurar que los materiales PBR se vean correctamente
                      if (mat instanceof THREE.MeshStandardMaterial) {
                        mat.side = THREE.DoubleSide
                      }
                    })
                  } else {
                    child.material.needsUpdate = true
                    // Asegurar que los materiales PBR se vean correctamente
                    if (child.material instanceof THREE.MeshStandardMaterial) {
                      child.material.side = THREE.DoubleSide
                    }
                  }
                }

                // Habilitar sombras
                child.castShadow = true
                child.receiveShadow = true

                // Asegurar que las normales estén calculadas
                if (child.geometry && !child.geometry.attributes.normal) {
                  child.geometry.computeVertexNormals()
                }
              }
            })

            // Calcular estadísticas del modelo
            const stats = this.calculateModelStats(gltf.scene)

            resolve({
              scene: gltf.scene,
              animations: gltf.animations || [],
              cameras: gltf.cameras || [],
              materials: this.extractMaterials(gltf.scene),
              meshCount: stats.meshCount,
              vertexCount: stats.vertexCount,
              faceCount: stats.faceCount,
            })
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percentComplete = (progress.loaded / progress.total * 100).toFixed(2)
              console.log(`Cargando GLTF: ${percentComplete}%`)
            }
          },
          (error) => {
            URL.revokeObjectURL(url)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            reject(new Error(`Error cargando archivo GLTF: ${errorMessage}`))
          }
        )
      }

      reader.onerror = () => reject(new Error('Error leyendo el archivo'))
      reader.readAsArrayBuffer(file)
    })
  }

  async loadFromURL(url: string): Promise<GLTFLoadResult> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          // Preservar materiales originales
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    mat.needsUpdate = true
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.side = THREE.DoubleSide
                    }
                  })
                } else {
                  child.material.needsUpdate = true
                  if (child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.side = THREE.DoubleSide
                  }
                }
              }

              child.castShadow = true
              child.receiveShadow = true

              if (child.geometry && !child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals()
              }
            }
          })

          const stats = this.calculateModelStats(gltf.scene)

          resolve({
            scene: gltf.scene,
            animations: gltf.animations || [],
            cameras: gltf.cameras || [],
            materials: this.extractMaterials(gltf.scene),
            meshCount: stats.meshCount,
            vertexCount: stats.vertexCount,
            faceCount: stats.faceCount,
          })
        },
        (progress) => {
          if (progress.lengthComputable) {
            const percentComplete = (progress.loaded / progress.total * 100).toFixed(2)
            console.log(`Cargando GLTF: ${percentComplete}%`)
          }
        },
        (error) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          reject(new Error(`Error cargando archivo GLTF desde URL: ${errorMessage}`))
        }
      )
    })
  }

  private extractMaterials(scene: THREE.Group): THREE.Material[] {
    const materialSet = new Set<THREE.Material>()

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => materialSet.add(mat))
        } else {
          materialSet.add(child.material)
        }
      }
    })

    return Array.from(materialSet)
  }

  private calculateModelStats(scene: THREE.Group): {
    meshCount: number
    vertexCount: number
    faceCount: number
  } {
    let meshCount = 0
    let vertexCount = 0
    let faceCount = 0

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++

        const geometry = child.geometry
        if (geometry) {
          if (geometry.attributes.position) {
            vertexCount += geometry.attributes.position.count
          }

          if (geometry.index) {
            faceCount += geometry.index.count / 3
          } else if (geometry.attributes.position) {
            faceCount += geometry.attributes.position.count / 3
          }
        }
      }
    })

    return {
      meshCount,
      vertexCount,
      faceCount: Math.floor(faceCount)
    }
  }
}
