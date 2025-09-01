import { create } from 'zustand'
// @ts-ignore
import { Model3D, ViewerSettings, LightSettings, RenderMode } from '@/types'

interface ViewerStore {
  // Estado del modelo
  currentModel: Model3D | null
  setCurrentModel: (model: Model3D | null) => void

  // Configuración del visor
  settings: ViewerSettings
  updateSettings: (settings: Partial<ViewerSettings>) => void

  // Configuración de luces
  lightSettings: LightSettings
  updateLightSettings: (settings: Partial<LightSettings>) => void

  // Estado de la UI
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  error: string | null
  setError: (error: string | null) => void

  // Info del modelo
  modelInfo: {
    vertices: number
    faces: number
  } | null
  setModelInfo: (info: { vertices: number; faces: number } | null) => void
}

export interface ViewerSettings {
  wireframe: boolean
  autoRotate: boolean
  autoRotateSpeed: number // Agregar esta línea
  showGrid: boolean
  backgroundColor: string
}

export const useViewerStore = create<ViewerStore>((set) => ({
  // Estado inicial
  currentModel: null,
  settings: {
    wireframe: false,
    autoRotate: false,
    autoRotateSpeed: 1,
    showGrid: true,
    backgroundColor: '#1a1a1a',
    renderMode: 'solid' as RenderMode,
    showAxes: false,
    showBoundingBox: false,
  },
  lightSettings: {
    ambient: {
      intensity: 0.5,
      color: '#ffffff'
    },
    directional: {
      intensity: 1,
      color: '#ffffff',
      position: [5, 5, 5] as [number, number, number]
    }
  },
  isLoading: false,
  error: null,
  modelInfo: null,

  // Actions
  setCurrentModel: (model) => set({ currentModel: model }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
  updateLightSettings: (newSettings) =>
    set((state) => ({
      lightSettings: {
        ambient: { ...state.lightSettings.ambient, ...newSettings.ambient },
        directional: { ...state.lightSettings.directional, ...newSettings.directional }
      }
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setModelInfo: (info) => set({ modelInfo: info }),
}))

