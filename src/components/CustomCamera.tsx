import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type CameraProps = {
    fov?: number;
    position?: [number, number, number];
    lookAt?: [number, number, number];
    far?: number;
    near?: number;
};

export default function CustomCamera({ fov = 55, near = 0.1, far = 100, ...props }: CameraProps) {
    const ref = useRef<THREE.PerspectiveCamera>(null!);

    useFrame(() => {
        if (ref.current) {
            ref.current.updateMatrixWorld();
        }
    });

    return (
        <PerspectiveCamera
            ref={ref}
            fov={fov}
            near={near}
            far={far}
            makeDefault
            {...props}
        />
    );
}
