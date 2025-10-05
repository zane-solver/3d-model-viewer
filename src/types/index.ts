// src/types/index.ts
//
export type RenderMode = 'solid' | 'wireframe' | 'normal' | 'matcap' | 'depth'
export type SupportedFileType = 'obj' | 'gltf' | 'glb'
export type LoaderType = 'obj' | 'gltf'

export interface Model3D {
  id: string
  name: string
  file: File
  url: string
  fileType?: SupportedFileType
  loaderType?: LoaderType
}

export interface ViewerSettings {
  wireframe: boolean
  autoRotate: boolean
  backgroundColor: string
  autoRotateSpeed: number
}

export interface CameraSettings {
  position: [number, number, number]
  fov: number
  near: number
  far: number
}

export interface LightSettings {
  ambient: {
    intensity: number
    color: string
  }
  directional: {
    intensity: number
    color: string
    position: [number, number, number]
  }
}
