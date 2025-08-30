import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useViewerStore } from '@/store/viewerStore'

export function Sidebar() {
  const { settings, updateSettings, currentModel } = useViewerStore()

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Controls</h2>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="display" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Render Mode</CardTitle>
                  <CardDescription>
                    Change how the model is displayed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wireframe">Wireframe</Label>
                    <Toggle
                      id="wireframe"
                      pressed={settings.wireframe}
                      onPressedChange={(pressed) =>
                        updateSettings({ wireframe: pressed })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autorotate">Auto Rotate</Label>
                    <Toggle
                      id="autorotate"
                      pressed={settings.autoRotate}
                      onPressedChange={(pressed) =>
                        updateSettings({ autoRotate: pressed })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid">Show Grid</Label>
                    <Toggle
                      id="grid"
                      pressed={settings.showGrid}
                      onPressedChange={(pressed) =>
                        updateSettings({ showGrid: pressed })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {['#1a1a1a', '#2d3748', '#4a5568', '#718096', '#ffffff'].map((color) => (
                      <button
                        key={color}
                        className="h-8 w-8 rounded border-2 border-border"
                        style={{ backgroundColor: color }}
                        onClick={() => updateSettings({ backgroundColor: color })}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lighting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ambient Light</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Intensity</Label>
                    <Slider
                      defaultValue={[0.5]}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Directional Light</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Intensity</Label>
                    <Slider
                      defaultValue={[1]}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Model Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentModel ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{currentModel.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span>OBJ</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No model loaded
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
