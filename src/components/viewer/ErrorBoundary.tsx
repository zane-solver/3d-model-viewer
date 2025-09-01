import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in 3D Viewer:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full items-center justify-center bg-zinc-900">
            <div className="text-center p-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Error Loading 3D Model
              </h3>
              <p className="text-zinc-400 text-sm max-w-md">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
