import { useViewerStore } from '@/store/viewerStore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ModelInfo() {
  const { currentModel, modelInfo, animations } = useViewerStore()

  if (!currentModel) {
    return null
  }

  const fileType = currentModel.fileType || 'obj'
  const hasAnimations = animations.length > 0

  return (
    <Card className="absolute top-4 left-4 bg-black/80 text-white border-zinc-700 backdrop-blur-sm">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-sm">Model Info</h3>
          <Badge variant="secondary" className="text-xs">
            {fileType.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Name:</span>
            <span className="font-mono truncate max-w-[150px]" title={currentModel.name}>
              {currentModel.name}
            </span>
          </div>

          {modelInfo && (
            <>
              {modelInfo.meshCount !== undefined && (
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">Meshes:</span>
                  <span className="font-mono">{modelInfo.meshCount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Vertices:</span>
                <span className="font-mono">{modelInfo.vertices.toLocaleString()}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-zinc-400">Faces:</span>
                <span className="font-mono">{modelInfo.faces.toLocaleString()}</span>
              </div>

              {modelInfo.materialCount !== undefined && (
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-400">Materials:</span>
                  <span className="font-mono">{modelInfo.materialCount.toLocaleString()}</span>
                </div>
              )}
            </>
          )}

          {hasAnimations && (
            <div className="pt-2 border-t border-zinc-700">
              <div className="flex items-center gap-2 text-green-400">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">{animations.length} animation{animations.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
