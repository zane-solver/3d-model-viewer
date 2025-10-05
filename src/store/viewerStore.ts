import { create } from 'zustand'
import * as THREE from 'three'
// @ts-ignore
import { Model3D, ViewerSettings, LightSettings, RenderMode } from '@/types'

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

  // Info del modelo
  modelInfo: {
    vertices: number
    faces: number
    meshCount?: number
    materialCount?: number
  } | null
  setModelInfo: (info: { vertices: number; faces: number; meshCount?: number; materialCount?: number } | null) => void

  // Datos específicos de GLTF
  animations: THREE.AnimationClip[]
  setAnimations: (animations: THREE.AnimationClip[]) => void

  mixer: THREE.AnimationMixer | null
  setMixer: (mixer: THREE.AnimationMixer | null) => void
}

export interface ViewerSettings {
  wireframe: boolean
  autoRotate: boolean
  autoRotateSpeed: number
  backgroundColor: string
}

export const useViewerStore = create<ViewerStore>((set) => ({
  // Estado inicial
  currentModel: null,
  settings: {
    wireframe: false,
    autoRotate: false,
    autoRotateSpeed: 1,
    backgroundColor: '#0a1628',
  },
  isLoading: false,
  error: null,
  modelInfo: null,
  animations: [],
  mixer: null,

  // Actions
  setCurrentModel: (model) => set({ currentModel: model }),
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setModelInfo: (info) => set({ modelInfo: info }),
  setAnimations: (animations) => set({ animations }),
  setMixer: (mixer) => set({ mixer }),
}))

