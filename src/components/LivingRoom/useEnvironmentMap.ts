import { useThree } from '@react-three/fiber';
import * as THREE from "three";
import { useEffect, useState } from 'react';

// useEnvironmentMap 用于加载和处理环境贴图。
// 用 THREE.PMREMGenerator 将 equirectangular 环境贴图（经纬图） 转换为适合 PBR（物理基础渲染） 渲染的 漫反射+镜面反射贴图
export function useEnvironmentMap(url: string) {
  const { gl } = useThree();
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // PMREMGenerator 生成 PBR 材质中需要的 模糊环境贴图
    const pmrem = new THREE.PMREMGenerator(gl);
    const loader = new THREE.TextureLoader();

    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      // 它会将原始贴图，处理成 一组不同模糊级别的立方体贴图（mipmap）
      // 带有 mipmap 层级的立方体贴图（THREE.CubeTexture），Three.js 内部会根据材质的粗糙度来使用不同的 mip 层。
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
