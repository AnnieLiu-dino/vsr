import { useRef } from "react";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

interface BaseCircleProps {
    texture: string;
    transparent?: boolean;
    opacity?: number;
    radius?: number;
}

export default function BaseCircle({
    texture,
    transparent = true,
    opacity = 1,
    radius = 0.2,
}: BaseCircleProps) {
    const circle = useRef<THREE.Mesh>(null!);
    const circleTexture = useLoader(TextureLoader, texture);

    return (
        <mesh
            ref={circle}
            position={[0, 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
        >
            <circleGeometry args={[radius, 32]} />
            <meshBasicMaterial
                map={circleTexture}
                transparent={transparent}
                opacity={opacity}
            />
        </mesh>
    );
}
