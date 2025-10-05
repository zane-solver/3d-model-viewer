import { useViewerStore } from '@/store/viewerStore'
import { ModelLoader } from './ModelLoader'
import { GLTFModelLoader } from './GLTFModelLoader'

interface UniversalModelLoaderProps {
  url: string
  autoRotate?: boolean
}

export function UniversalModelLoader({ url, autoRotate }: UniversalModelLoaderProps) {
  const { currentModel } = useViewerStore()

  if (!currentModel) {
    return null
  }

  // Determine which loader to use based on file type
  const loaderType = currentModel.loaderType || 'obj'

  if (loaderType === 'gltf') {
    return <GLTFModelLoader url={url} />
  }

  // Default to OBJ loader
  return <ModelLoader url={url} autoRotate={autoRotate} />
}
