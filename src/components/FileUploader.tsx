import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  onCancel?: () => void
}

export function FileUploader({ onFileSelect, onCancel }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      setError('Please upload a valid .obj file')
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]

      // Additional validation
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('File size must be less than 100MB')
        return
      }

      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'model/obj': ['.obj'],
      'application/object': ['.obj'],
      'text/plain': ['.obj']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const selectedFile = acceptedFiles[0]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload 3D Model</h3>

        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            isDragActive || dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            error && "border-destructive"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "rounded-full p-4 transition-colors",
              isDragActive || dragActive ? "bg-primary/10" : "bg-muted"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragActive || dragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>

            <div>
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop your file here"
                  : "Drag & drop your OBJ file here"
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Supports: .obj files up to 100MB
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {selectedFile && !error && (
          <div className="mt-4 p-3 rounded-md bg-muted flex items-center gap-2">
            <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm flex-1 truncate">{selectedFile.name}</p>
            <span className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}

        {onCancel && (
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
