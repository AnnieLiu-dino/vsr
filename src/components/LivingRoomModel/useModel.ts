import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect } from 'react';
import { useControls } from 'leva';

type LightMaps = {
  CoffeeTable: THREE.Texture;
  CurtainCarpets: THREE.Texture;
  Decor: THREE.Texture;
  Exterior: THREE.Texture;
  Frames: THREE.Texture;
  Furniture: THREE.Texture;
  Sofa: THREE.Texture;
  Table: THREE.Texture;
  TV_Shelf: THREE.Texture;
  [key: string]: THREE.Texture;
};

export function useModel(envMap: THREE.Texture | null, lightMaps: LightMaps) {
  const { scene } = useGLTF('/assets/livingroom/livingroom.gltf', '/draco-gltf/');
  const video = document.getElementById('video') as HTMLVideoElement | null;
  const videoTexture = video ? new THREE.VideoTexture(video) : null;

    const {
    globalLightMapIntensity,
    globalEnvMapIntensity,
  } = useControls('Material调试', {
    globalLightMapIntensity: { value: 0, min: 0, max: 5, step: 0.1 },
    globalEnvMapIntensity: { value: 0.2, min: 0, max: 2, step: 0.1 },
  });


  // ✅ 强制设置 colorSpace
  Object.values(lightMaps).forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
  });
  if (envMap) {
    envMap.colorSpace = THREE.SRGBColorSpace;
  }
  const {   CoffeeTableMap,
    CurtainCarpetsMap,
    DecorMap,
    ExteriorMap,
    FramesMap,
    FurnitureMap,
    SofaMap,
    TableMap,
    TV_ShelfMap,
    Empty_ExteriorMap,
    Empty_FurnitureMap,} = lightMaps;

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;

      const mesh = obj as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      if (!material) return;

      const name = mesh.name;
      const matName = material.name;

      // ✅ 设置默认材质属性
      material.envMapIntensity = 0.0;
      material.lightMapIntensity = 0.0;
      material.roughness ??= 0.5;
      material.metalness ??= 0.0;

      material.envMapIntensity = globalEnvMapIntensity;
      material.lightMapIntensity = globalLightMapIntensity;

      // 🪑 分类设置
      if (name.includes('CoffeeTable')) {
        material.lightMap = lightMaps.CoffeeTable;
        if (matName.includes('CoffeeTable') && envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.3;
        }
      } else if (name.includes('CurtainCarpet')) {
        material.lightMap = lightMaps.CurtainCarpets;
        material.lightMapIntensity = 2;
      } else if (name.includes('Decor')) {
        material.lightMap = lightMaps.Decor;
        material.lightMapIntensity = 1;
      } else if (name.includes('Exterior')) {
        material.lightMap = lightMaps.Exterior;
      } else if (name.includes('Frames')) {
        material.lightMap = lightMaps.Frames;
        if (envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.3;
        }
        if (matName.includes('Frame_Image')) {
          material.roughness = 0;
        }
      } else if (name.includes('Sofa')) {
        material.lightMap = lightMaps.Sofa;
        if (envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.5;
        }
      } else if (name.includes('Table')) {
        material.lightMap = lightMaps.Table;
        if (matName.includes('Tables') && envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.3;
        }
        if (matName.includes('Chair_Base') && envMap) {
          material.envMap = envMap;
        }
        if (matName.includes('Table_Leg_Copper') && envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.3;
          material.metalness = 1;
          material.roughness = 0.2;
        }
      } else if (name.includes('TV_Shelf')) {
        material.lightMap = lightMaps.TV_Shelf;
      } else if (name.includes('Door')) {
        material.lightMap = lightMaps.Furniture;
      } else if (name.includes('Furniture')) {
        material.lightMap = lightMaps.Furniture;
      }

      // 📺 视频材质（TV）
      if (name.includes('TV_Screen') && videoTexture) {
        mesh.material = new THREE.MeshBasicMaterial({ map: videoTexture });
        videoTexture.flipY = false;
        videoTexture.colorSpace = THREE.SRGBColorSpace;
      }

      // 💡 环境反射类
      if (envMap) {
        if (
          name.includes('Dishes') ||
          name.includes('Glass') ||
          name.includes('TV_Strings') ||
          name.includes('Sofa')
        ) {
          material.envMap = envMap;
          material.envMapIntensity = 0.5;
        }

        if (matName.includes('Glass')) {
          material.envMap = envMap;
          material.envMapIntensity = 1;
        }

        if (matName.includes('Handle') || matName.includes('Curtain_Sides')) {
          material.envMap = envMap;
        }

        if (name.includes('Interior_Chandeliers')) {
          material.envMap = envMap;
          material.envMapIntensity = 1;
        }
      }

    });

  }, [scene, envMap, lightMaps]);

  return scene;
}
