import { useThree } from '@react-three/fiber';
import * as THREE from "three";
// import { PMREMGenerator, TextureLoader, sRGBEncoding } from 'three';
import { useEffect, useState } from 'react';

// 加载环境光贴图
export function useEnvironmentMap(url: string) {
  const { gl } = useThree();
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // 生成真实环境光照贴图
    const pmrem = new THREE.PMREMGenerator(gl);
    const loader = new THREE.TextureLoader();

    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      // 生成适合三维反射光照的环境贴图。
      const env = pmrem.fromEquirectangular(texture).texture;
      setEnvMap(env);
      texture.dispose();
      pmrem.dispose();
    });
    // 清理 WebGL 资源，防止内存泄漏。
    return () => pmrem.dispose();
  }, [url, gl]);

  return envMap;
}
