import { SupportedFileType } from '@/types'

export interface ModelAsset {
  name: string
  fileName: string
  fileType: SupportedFileType
  url: string
  thumbnailUrl?: string
}

// Import all model files from assets
const objModels = import.meta.glob('@/assets/*.obj', { as: 'url', eager: true })
const gltfModels = import.meta.glob('@/assets/*.gltf', { as: 'url', eager: true })
const glbModels = import.meta.glob('@/assets/*.glb', { as: 'url', eager: true })

// Import all thumbnail images (optional - will be undefined if not found)
const thumbnails = import.meta.glob('@/assets/*.png', { as: 'url', eager: true })

function extractFileName(path: string): string {
  return path.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
}

function getFileType(path: string): SupportedFileType {
  const ext = path.split('.').pop()?.toLowerCase()
  if (ext === 'obj' || ext === 'gltf' || ext === 'glb') {
    return ext as SupportedFileType
  }
  return 'obj'
}

function getThumbnailUrl(fileName: string): string | undefined {
  const thumbnailPath = `/src/assets/${fileName}.png`
  return thumbnails[thumbnailPath]
}

export function getAvailableModels(): ModelAsset[] {
  const models: ModelAsset[] = []

  // Process OBJ files
  Object.entries(objModels).forEach(([path, url]) => {
    const fileName = extractFileName(path)
    models.push({
      name: fileName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      fileName: `${fileName}.obj`,
      fileType: 'obj',
      url: url as string,
      thumbnailUrl: getThumbnailUrl(fileName)
    })
  })

  // Process GLTF files
  Object.entries(gltfModels).forEach(([path, url]) => {
    const fileName = extractFileName(path)
    models.push({
      name: fileName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      fileName: `${fileName}.gltf`,
      fileType: 'gltf',
      url: url as string,
      thumbnailUrl: getThumbnailUrl(fileName)
    })
  })

  // Process GLB files
  Object.entries(glbModels).forEach(([path, url]) => {
    const fileName = extractFileName(path)
    models.push({
      name: fileName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      fileName: `${fileName}.glb`,
      fileType: 'glb',
      url: url as string,
      thumbnailUrl: getThumbnailUrl(fileName)
    })
  })

  return models.sort((a, b) => {
    // Natural sort for numeric filenames (1, 2, 3... instead of 1, 10, 11, 2...)
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  })
}
