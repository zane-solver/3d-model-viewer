// src/types/index.ts
export interface Model3D {
  id: string
  name: string
  file: File
  url: string
}

export interface ViewerSettings {
  wireframe: boolean
  autoRotate: boolean
  showGrid: boolean
  backgroundColor: string
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
