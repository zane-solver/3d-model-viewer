import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useViewerStore } from '@/store/viewerStore'
import { Button } from '@/components/ui/button'
import { ModelGallery } from '@/components/ModelGallery'
import {
  Upload,
  Camera,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Box,
  Info,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SidebarProps {
  onFileUpload: () => void
  onResetView: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onToggleFullscreen: () => void
  onAboutClick: () => void
}

export function Sidebar({
  onFileUpload,
  onResetView,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onAboutClick,
}: SidebarProps) {
  const {
    settings,
    updateSettings,
    currentModel,
    modelInfo,
  } = useViewerStore()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center px-4 border-b bg-card/30">
        <Box className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
        <div className="flex flex-col leading-tight">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-muted-foreground hover:underline"
          >
            Sil Bos
          </a>
          <span className="text-base font-bold text-foreground">3D Viewer</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b bg-card/20">
        <Button onClick={onFileUpload} className="w-full bg-primary hover:bg-primary/90">
          <Upload className="h-4 w-4 mr-2" />
          Upload Model
        </Button>
        <div className="grid grid-cols-4 gap-2 mt-4">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onResetView}>
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset Camera</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleFullscreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="models" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            {/* Models Tab */}
            <TabsContent value="models" className="space-y-4 mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Available Models</CardTitle>
                  <CardDescription className="text-xs">
                    Click a model to load it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModelGallery />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Display Tab */}
            <TabsContent value="display" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Background Color</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { color: '#0a1628', name: 'Navy Blue' },
                      { color: '#1a1a1a', name: 'Dark Gray' },
                      { color: '#404040', name: 'Gray' },
                      { color: '#737373', name: 'Light Gray' },
                      { color: '#ffffff', name: 'White' },
                    ].map(({ color, name }) => (
                      <button
                        key={color}
                        className={`h-10 w-full rounded border-2 transition-all hover:scale-105 hover:border-primary/50 ${settings.backgroundColor === color
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border'
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          updateSettings({ backgroundColor: color })
                        }
                        title={name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">
                    Model Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Details about the loaded 3D model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentModel ? (
                    <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-3 items-center text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span
                        className="font-medium truncate"
                        title={currentModel.name}
                      >
                        {currentModel.name}
                      </span>

                      <Separator className="col-span-2" />

                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{currentModel.fileType?.toUpperCase() || 'OBJ'}</span>

                      <Separator className="col-span-2" />

                      <span className="text-muted-foreground">
                        File Size:
                      </span>
                      <span className="font-medium">
                        {(currentModel.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>

                      {modelInfo && (
                        <>
                          <Separator className="col-span-2" />
                          <span className="text-muted-foreground">
                            Vertices:
                          </span>
                          <span className="font-medium">
                            {modelInfo.vertices.toLocaleString()}
                          </span>

                          <Separator className="col-span-2" />
                          <span className="text-muted-foreground">Faces:</span>
                          <span className="font-medium">
                            {modelInfo.faces.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No model loaded
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload an OBJ file to see its information
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>


            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-card/20">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onAboutClick}
        >
          <Info className="h-4 w-4 mr-2" />
          About
        </Button>
      </div>
    </div>
  )
}
