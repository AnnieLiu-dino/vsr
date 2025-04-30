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

export function useSceneModel(envMap: THREE.Texture | null, lightMaps: LightMaps) {
  const { scene } = useGLTF('/assets/livingroom/livingroom.gltf', '/draco-gltf/');
  const video = document.getElementById('video') as HTMLVideoElement | null;
  const videoTexture = video ? new THREE.VideoTexture(video) : null;

  const {
    globalLightMapIntensity,
    globalEnvMapIntensity,
    curtainCarpetLightMapIntensity
  } = useControls('Material调试', {
    globalLightMapIntensity: { value: 0.2, min: 0, max: 5, step: 0.1 },
    globalEnvMapIntensity: { value: 0.2, min: 0, max: 2, step: 0.1 },
    curtainCarpetLightMapIntensity: { value: 0.0, min: 0, max: 5, step: 0.1 },
  });

  // 设置 colorSpace
  Object.values(lightMaps).forEach((tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
  });
  if (envMap) {
    envMap.colorSpace = THREE.SRGBColorSpace;
  }

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;

      // mesh = geometry + material
      const mesh = obj as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (!material) return;

      const name = mesh.name;
      const matName = material.name;

      // 默认参数
      material.envMapIntensity = globalEnvMapIntensity;
      material.lightMapIntensity = globalLightMapIntensity;
      material.roughness ??= 0.5;
      material.metalness ??= 0.0;


      // 特定分类设置
      if (name.includes('Interior_Chandeliers') && envMap) {
        material.envMap = envMap;
        material.envMapIntensity = 1;
      }

      if (name.includes('CoffeeTable')) {
        material.lightMap = lightMaps.CoffeeTable;
        if (matName.includes('CoffeeTable') && envMap) {
          material.envMap = envMap;
          material.envMapIntensity = globalEnvMapIntensity;
        }
      }

      if (name.includes('CurtainCarpet')) {
        material.lightMap = lightMaps.CurtainCarpets;
        // material.lightMapIntensity = 1.5;
        material.lightMapIntensity = curtainCarpetLightMapIntensity;
      }

      if (name.includes('Decor')) {
        material.lightMap = lightMaps.Decor;
        material.lightMapIntensity = 1;
      }

      if (name.includes('Exterior')) {
        material.lightMap = lightMaps.Exterior;
      }

      if (name.includes('Frames')) {
        material.lightMap = lightMaps.Frames;
        if (envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.3;
        }
        if (matName.includes('Frame_Image')) {
          material.roughness = 0;
        }
      }

      if (name.includes('Sofa')) {
        material.lightMap = lightMaps.Sofa;
        if (envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.5;
        }
      }

      if (name.includes('Table')) {
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
          material.envMapIntensity = 0.1;
          material.metalness = 1;
          material.roughness = 0.2;
        }
      }

      if (name.includes('TV_Shelf')) {
        material.lightMap = lightMaps.TV_Shelf;
      }

      if (name.includes('Door')) {
        material.lightMap = lightMaps.Furniture;
      }

      if (name.includes('Furniture')) {
        material.lightMap = lightMaps.Furniture;
      }

      if (
        name.includes('Dishes') ||
        name.includes('Glass') ||
        name.includes('TV_Strings') ||
        name.includes('Sofa')
      ) {
        if (envMap) {
          material.envMap = envMap;
          material.envMapIntensity = 0.5;
        }
      }

      if (matName.includes('Glass') && envMap) {
        material.envMap = envMap;
        material.envMapIntensity = 1;
        material.refractionRatio = 0;
      }

      if (
        matName.includes('Handle') ||
        matName.includes('Curtain_Sides')
      ) {
        if (envMap) {
          material.envMap = envMap;
        }
      }

      if (name.includes('TV_Screen') && videoTexture) {
        mesh.material = new THREE.MeshBasicMaterial({ map: videoTexture });
        videoTexture.flipY = false;
        videoTexture.colorSpace = THREE.SRGBColorSpace;
      }
    });
  }, [scene, envMap, lightMaps, globalEnvMapIntensity, globalLightMapIntensity]);

  return scene;
}
