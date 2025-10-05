import { useState, useCallback } from 'react'
import { useViewerStore } from '@/store/viewerStore'
import { SupportedFileType, LoaderType } from '@/types'
import { GLTFLoaderWrapper } from '@/utils/gltfLoader'

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { setCurrentModel, setError, setAnimations, setModelInfo } = useViewerStore()

  const getFileType = useCallback((filename: string): SupportedFileType | null => {
    const extension = filename.split('.').pop()?.toLowerCase()
    if (extension === 'obj' || extension === 'gltf' || extension === 'glb') {
      return extension as SupportedFileType
    }
    return null
  }, [])

  const validateObjFile = useCallback((content: string): boolean => {
    // Basic OBJ validation - check for vertices
    const hasVertices = /^v\s+/m.test(content)
    return hasVertices // At minimum, should have vertices
  }, [])

  const processFile = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const fileType = getFileType(file.name)

      if (!fileType) {
        throw new Error('Unsupported file format. Please use .obj, .gltf, or .glb files.')
      }

      if (fileType === 'gltf' || fileType === 'glb') {
        // Procesar archivo GLTF/GLB
        const gltfLoader = new GLTFLoaderWrapper()
        const result = await gltfLoader.load(file)

        // Create object URL for reference
        const url = URL.createObjectURL(file)

        // Store the model with GLTF metadata
        setCurrentModel({
          id: Date.now().toString(),
          name: file.name,
          file,
          url,
          fileType,
          loaderType: 'gltf' as LoaderType
        })

        // Store GLTF-specific data
        if (result.animations.length > 0) {
          setAnimations(result.animations)
        }

        // Store model statistics
        setModelInfo({
          vertices: result.vertexCount,
          faces: result.faceCount,
          meshCount: result.meshCount,
          materialCount: result.materials.length
        })

      } else {
        // Procesar archivo OBJ (lógica existente)
        const text = await file.text()

        if (!validateObjFile(text)) {
          throw new Error('Invalid OBJ file format')
        }

        // Create object URL for the file
        const url = URL.createObjectURL(file)

        // Store the model
        setCurrentModel({
          id: Date.now().toString(),
          name: file.name,
          file,
          url,
          fileType: 'obj',
          loaderType: 'obj' as LoaderType
        })
      }

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file'
      setError(errorMessage)
      return false
    } finally {
      setIsUploading(false)
    }
  }, [setCurrentModel, setError, setAnimations, setModelInfo, validateObjFile, getFileType])

  const clearModel = useCallback(() => {
    const currentModel = useViewerStore.getState().currentModel
    if (currentModel?.url) {
      URL.revokeObjectURL(currentModel.url)
    }
    setCurrentModel(null)
  }, [setCurrentModel])

  return {
    processFile,
    clearModel,
    isUploading
  }
}
