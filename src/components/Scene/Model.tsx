import { useLightMaps } from './Loaders/useLightMaps';
import { useEnvironmentMap } from './Loaders/useEnvironmentMap';
import { useModel } from './Loaders/useModel';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

export default function Model() {
    // 模型加载的三要素：贴图加载；环境贴图生成；模型加载 + 材质配置
    const lightMaps = useLightMaps();
    const envMap = useEnvironmentMap('/assets/livingroom/envMap.webp');
    console.log(envMap)
    const modelScene = useModel(envMap, lightMaps);
    const { scene, gl } = useThree();

    useEffect(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 4;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        // 加载好的模型加进场景，显示到 canvas 中
        scene.add(modelScene);
    }, [scene, modelScene, gl]);

    return null;
}
