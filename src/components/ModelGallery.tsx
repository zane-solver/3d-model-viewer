import { useState, useEffect } from 'react'
import { getAvailableModels, ModelAsset } from '@/utils/modelList'
import { useViewerStore } from '@/store/viewerStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Box, FileBox } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ModelGallery() {
  const [models, setModels] = useState<ModelAsset[]>([])
  const { setCurrentModel, currentModel } = useViewerStore()

  useEffect(() => {
    const availableModels = getAvailableModels()
    setModels(availableModels)
  }, [])

  const handleModelClick = (model: ModelAsset) => {
    setCurrentModel({
      id: Date.now().toString(),
      name: model.fileName,
      file: new File([], model.fileName),
      url: model.url,
      fileType: model.fileType,
      loaderType: model.fileType === 'obj' ? 'obj' : 'gltf'
    })
  }

  if (models.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No models found in assets
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {models.map((model) => {
        const isActive = currentModel?.url === model.url

        return (
          <Card
            key={model.fileName}
            className={cn(
              "cursor-pointer transition-all hover:border-primary/50",
              isActive && "border-primary bg-primary/5"
            )}
            onClick={() => handleModelClick(model)}
          >
            <CardContent className="p-2">
              <div className="flex items-center gap-2">
                {/* Thumbnail or placeholder */}
                <div className="flex-shrink-0 w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                  {model.thumbnailUrl ? (
                    <img
                      src={model.thumbnailUrl}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">
                      {model.fileType === 'obj' ? (
                        <Box className="w-4 h-4" />
                      ) : (
                        <FileBox className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>

                {/* Model info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium truncate leading-tight" title={model.name}>
                    {model.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-mono px-1 py-0 h-4"
                    >
                      {model.fileType.toUpperCase()}
                    </Badge>
                    {isActive && (
                      <span className="text-[10px] text-primary font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
