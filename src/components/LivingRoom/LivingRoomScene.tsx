import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useLightMaps } from "./useLightMaps";
import { useEnvironmentMap } from "./useEnvironmentMap";
import { useSceneModel } from "./useSceneModel";
import * as THREE from "three";
import FloorCircle from "../Circle/FloorCircle";
import Controls from "../Controls";
import { Suspense } from "react";

type LivingRoomSceneProps = {
    modelRef: React.RefObject<THREE.Group | null>;
};
export default function LivingRoomScene(props: LivingRoomSceneProps) {
    const { modelRef } = props;
    const lightMaps = useLightMaps();
    const envMap = useEnvironmentMap("/assets/livingroom/envMap.webp");
    const modelScene = useSceneModel(envMap, lightMaps);
    const { scene, gl } = useThree();

    useEffect(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 4;
        gl.outputColorSpace = THREE.SRGBColorSpace;

        modelRef.current = modelScene;
        scene.add(modelScene);
    }, [scene, modelScene, gl]);

    return (
        <Suspense fallback={"Loading..."}>
            <FloorCircle />
            <Controls />
        </Suspense>
    );
}
