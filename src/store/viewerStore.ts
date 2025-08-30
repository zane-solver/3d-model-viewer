// src/store/viewerStore.ts
import { create } from 'zustand'
import { Model3D, ViewerSettings } from '@/types'

interface ViewerStore {
  // Estado del modelo
  currentModel: Model3D | null
  setCurrentModel: (model: Model3D | null) => void

  // Configuración del visor
  settings: ViewerSettings
  updateSettings: (settings: Partial<ViewerSettings>) => void

  // Estado de la UI
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  error: string | null
  setError: (error: string | null) => void
}

export const useViewerStore = create<ViewerStore>((set) => ({
  // Estado inicial
  currentModel: null,
  settings: {
    wireframe: false,
    autoRotate: false,
    showGrid: true,
    backgroundColor: '#1a1a1a',
  },
  isLoading: false,
  error: null,

  // Actions
  setCurrentModel: (model) => set({ currentModel: model }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
