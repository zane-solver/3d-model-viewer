export interface ObjInfo {
  vertexCount: number
  faceCount: number
  hasNormals: boolean
  hasTextureCoords: boolean
}

export function parseObjInfo(content: string): ObjInfo {
  const lines = content.split('\n')

  let vertexCount = 0
  let faceCount = 0
  let hasNormals = false
  let hasTextureCoords = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('v ')) {
      vertexCount++
    } else if (trimmedLine.startsWith('f ')) {
      faceCount++
    } else if (trimmedLine.startsWith('vn ')) {
      hasNormals = true
    } else if (trimmedLine.startsWith('vt ')) {
      hasTextureCoords = true
    }
  }

  return {
    vertexCount,
    faceCount,
    hasNormals,
    hasTextureCoords
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
