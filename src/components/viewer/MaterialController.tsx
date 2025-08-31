import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { RenderMode } from '@/types'

interface MaterialControllerProps {
  renderMode: RenderMode
  wireframe: boolean
}

export function useMaterialController({ renderMode, wireframe }: MaterialControllerProps) {
  // Load matcap texture for matcap mode
  const matcapTexture = useTexture('/matcap.png', (texture) => {
    texture.encoding = THREE.sRGBEncoding
  })

  const material = useMemo(() => {
    switch (renderMode) {
      case 'solid':
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.7, 0.7, 0.7),
          metalness: 0.3,
          roughness: 0.4,
          wireframe: wireframe,
          side: THREE.DoubleSide,
        })

      case 'wireframe':
        return new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.5, 0.5, 1),
          wireframe: true,
          side: THREE.DoubleSide,
        })

      case 'normal':
        return new THREE.MeshNormalMaterial({
          side: THREE.DoubleSide,
          flatShading: false,
        })

      case 'matcap':
        return new THREE.MeshMatcapMaterial({
          matcap: matcapTexture,
          side: THREE.DoubleSide,
        })

      case 'depth':
        return new THREE.MeshDepthMaterial({
          side: THREE.DoubleSide,
        })

      default:
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.7, 0.7, 0.7),
          side: THREE.DoubleSide,
        })
    }
  }, [renderMode, wireframe, matcapTexture])

  return material
}
