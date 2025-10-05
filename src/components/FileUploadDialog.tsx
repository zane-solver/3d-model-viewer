import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileUploader } from './FileUploader'
import { useFileUpload } from '@/hooks/useFileUpload'

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileUploadDialog({ open, onOpenChange }: FileUploadDialogProps) {
  const { processFile } = useFileUpload()

  const handleFileSelect = async (file: File) => {
    const success = await processFile(file)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Load 3D Model</DialogTitle>
          <DialogDescription>
            Upload a 3D model file (.obj, .gltf, .glb) to view it in 3D
          </DialogDescription>
        </DialogHeader>

        <FileUploader
          onFileSelect={handleFileSelect}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
