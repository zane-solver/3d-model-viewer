import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileUploader } from './FileUploader'
import { useViewerStore } from '@/store/viewerStore'

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileUploadDialog({ open, onOpenChange }: FileUploadDialogProps) {
  const { setCurrentModel, setIsLoading, setError } = useViewerStore()

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create object URL for the file
      const url = URL.createObjectURL(file)

      // Store the model
      setCurrentModel({
        id: Date.now().toString(),
        name: file.name,
        file,
        url
      })

      // Close dialog
      onOpenChange(false)
    } catch (error) {
      setError('Failed to load model')
      console.error('Error loading model:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Load 3D Model</DialogTitle>
          <DialogDescription>
            Upload an OBJ file to view it in 3D
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
