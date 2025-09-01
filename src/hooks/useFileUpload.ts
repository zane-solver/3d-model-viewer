import { useState, useCallback } from 'react'
import { useViewerStore } from '@/store/viewerStore'

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { setCurrentModel, setError } = useViewerStore()

  const validateObjFile = useCallback((content: string): boolean => {
    // Basic OBJ validation - check for vertices
    const hasVertices = /^v\s+/m.test(content)

    return hasVertices // At minimum, should have vertices
  }, [])

  const processFile = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      // Read file content for validation
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
        url
      })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file'
      setError(errorMessage)
      return false
    } finally {
      setIsUploading(false)
    }
  }, [setCurrentModel, setError, validateObjFile])

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
