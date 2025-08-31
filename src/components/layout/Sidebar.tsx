import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useViewerStore } from '@/store/viewerStore'

export function Sidebar() {
  const { settings, updateSettings, currentModel, lightSettings, updateLightSettings, modelInfo } = useViewerStore()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center px-6 border-b">
        <h2 className="text-lg font-semibold">Controls</h2>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="display" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            {/* Display Tab */}
            <TabsContent value="display" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Render Mode</CardTitle>
                  <CardDescription className="text-xs">
                    Change how the model is displayed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wireframe" className="text-sm font-normal">
                      Wireframe
                    </Label>
                    <Toggle
                      id="wireframe"
                      size="sm"
                      pressed={settings.wireframe}
                      onPressedChange={(pressed) =>
                        updateSettings({ wireframe: pressed })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autorotate" className="text-sm font-normal">
                      Auto Rotate
                    </Label>
                    <Toggle
                      id="autorotate"
                      size="sm"
                      pressed={settings.autoRotate}
                      onPressedChange={(pressed) =>
                        updateSettings({ autoRotate: pressed })
                      }
                    />
                    {settings.autoRotate && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-normal">Rotation Speed</Label>
                            <span className="text-xs text-muted-foreground">
                              {settings.autoRotateSpeed.toFixed(1)}x
                            </span>
                          </div>
                          <Slider
                            value={[settings.autoRotateSpeed]}
                            onValueChange={([value]) =>
                              updateSettings({ autoRotateSpeed: value })
                            }
                            min={0.5}
                            max={5}
                            step={0.5}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-sm font-normal">
                      Show Grid
                    </Label>
                    <Toggle
                      id="grid"
                      size="sm"
                      pressed={settings.showGrid}
                      onPressedChange={(pressed) =>
                        updateSettings({ showGrid: pressed })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Background Color</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { color: '#0a0a0a', name: 'Black' },
                      { color: '#1a1a1a', name: 'Dark Gray' },
                      { color: '#404040', name: 'Gray' },
                      { color: '#737373', name: 'Light Gray' },
                      { color: '#ffffff', name: 'White' }
                    ].map(({ color, name }) => (
                      <button
                        key={color}
                        className={`h-10 w-full rounded border-2 transition-all hover:scale-105 ${settings.backgroundColor === color
                          ? 'border-primary shadow-md'
                          : 'border-border'
                          }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSettings({ backgroundColor: color })}
                        title={name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lighting Tab */}
            <TabsContent value="lighting" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Ambient Light</CardTitle>
                  <CardDescription className="text-xs">
                    Control overall scene brightness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">Intensity</Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(lightSettings.ambient.intensity * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[lightSettings.ambient.intensity]}
                      onValueChange={([value]) =>
                        updateLightSettings({
                          ambient: { ...lightSettings.ambient, intensity: value }
                        })
                      }
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Directional Light</CardTitle>
                  <CardDescription className="text-xs">
                    Main light source direction and strength
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-normal">Intensity</Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(lightSettings.directional.intensity * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[lightSettings.directional.intensity]}
                      onValueChange={([value]) =>
                        updateLightSettings({
                          directional: { ...lightSettings.directional, intensity: value }
                        })
                      }
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-sm font-normal">Light Position</Label>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">X</span>
                        <span className="text-xs text-muted-foreground">
                          {lightSettings.directional.position[0].toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[lightSettings.directional.position[0]]}
                        onValueChange={([value]) => {
                          const newPos = [...lightSettings.directional.position] as [number, number, number]
                          newPos[0] = value
                          updateLightSettings({
                            directional: { ...lightSettings.directional, position: newPos }
                          })
                        }}
                        min={-10}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Y</span>
                        <span className="text-xs text-muted-foreground">
                          {lightSettings.directional.position[1].toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[lightSettings.directional.position[1]]}
                        onValueChange={([value]) => {
                          const newPos = [...lightSettings.directional.position] as [number, number, number]
                          newPos[1] = value
                          updateLightSettings({
                            directional: { ...lightSettings.directional, position: newPos }
                          })
                        }}
                        min={0}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Z</span>
                        <span className="text-xs text-muted-foreground">
                          {lightSettings.directional.position[2].toFixed(1)}
                        </span>
                      </div>
                      <Slider
                        value={[lightSettings.directional.position[2]]}
                        onValueChange={([value]) => {
                          const newPos = [...lightSettings.directional.position] as [number, number, number]
                          newPos[2] = value
                          updateLightSettings({
                            directional: { ...lightSettings.directional, position: newPos }
                          })
                        }}
                        min={-10}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-6 mt-0">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Model Information</CardTitle>
                  <CardDescription className="text-xs">
                    Details about the loaded 3D model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentModel ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium truncate ml-2" title={currentModel.name}>
                          {currentModel.name}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Format:</span>
                        <span className="text-sm font-medium">OBJ</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">File Size:</span>
                        <span className="text-sm font-medium">
                          {(currentModel.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      {modelInfo && (
                        <>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Vertices:</span>
                            <span className="text-sm font-medium">
                              {modelInfo.vertices.toLocaleString()}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Faces:</span>
                            <span className="text-sm font-medium">
                              {modelInfo.faces.toLocaleString()}
                            </span>
                          </div>
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

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Rotate:</span>
                    <span>Left Mouse</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom:</span>
                    <span>Mouse Wheel</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan:</span>
                    <span>Right Mouse</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
