import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Box, Github, Globe, Code2 } from 'lucide-react'

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const techStack = [
    { name: 'React', version: '19.1.1' },
    { name: 'TypeScript', version: '5.8.3' },
    { name: 'Three.js', version: '0.179.1' },
    { name: 'React Three Fiber', version: '9.3.0' },
    { name: 'Zustand', version: '5.0.8' },
    { name: 'Vite', version: '7.1.2' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Box className="h-8 w-8 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">3D Model Viewer</DialogTitle>
              <Badge variant="secondary" className="mt-1">
                Beta v1.0.0
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-base">
            Interactive 3D model viewer with OBJ, GLTF, and GLB support
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-2">
              About the Project
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive web application for visualizing and inspecting 3D
              models directly in your browser. Supports multiple file formats,
              advanced rendering modes, lighting controls, and an intuitive
              interface to explore your CAD designs.
            </p>
          </div>

          <Separator />

          {/* Features */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Key Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>OBJ, GLTF, and GLB support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>Multiple rendering modes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>Interactive camera controls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>PBR material preservation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>Detailed model information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">▸</span>
                <span>Responsive design</span>
              </li>
            </ul>
          </div>

          <Separator />

          {/* Tech Stack */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Tech Stack
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-card/50 border border-border/50"
                >
                  <span className="text-sm font-medium text-foreground">
                    {tech.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    v{tech.version}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Developer Info */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 text-center">
              Developed by
            </h3>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  JV Dev Solutions
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Web development and 3D applications solutions
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2 mt-3">
              <a
                href="https://jvdevsolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
              <a
                href="https://github.com/jaimevillegas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} JV Dev Solutions. All rights
              reserved.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
