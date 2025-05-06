import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useResizeDetector } from "react-resize-detector";
import CustomCamera from "../components/CustomCamera";
import SideMenu from "../components/SideMenu";
import LoadingManager from "../components/LoadingManager";
import LivingRoomScene from "../components/LivingRoom/LivingRoomScene";
import LoadingPage from '../components/LoadingPage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LivingRoom: React.FC = () => {
    const modelRef = useRef<THREE.Group | null>(null);
    const [open, setOpen] = useState(true);
    const [fov, setFov] = useState(55);
    const { width, ref } = useResizeDetector();
    const progress = useSelector((state: RootState) => state.loader.progress);


    useEffect(() => {
        if (width !== undefined) {
            setFov(width < 500 ? 85 : 55);
        }
    }, [width]);

    useEffect(() => {
        const video = document.getElementById("video") as HTMLVideoElement;
        if (video) {
            video.play();
            video.muted = true;
            video.loop = true;
            video.crossOrigin = "anonymous";
        }
    }, []);



    return (
        <div ref={ref} style={{ width: "100vw", height: "100vh" }}>
            <LoadingPage progress={progress} />

            <Canvas
                dpr={[1, 2]}
                shadows
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.2;
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                }}
            >
                <LoadingManager />
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-bias={-0.005}
                />
                <CustomCamera
                    fov={fov}
                    position={[1, 1.37, 0]}
                    lookAt={[0, 0, 10]}
                    near={0.1}
                    far={100}
                />
                <LivingRoomScene modelRef={modelRef} />
            </Canvas>
            <video
                id="video"
                loop
                crossOrigin="anonymous"
                style={{ display: "none" }}
            >
                <source
                    src="/assets/livingroom/video/promo_compressed.mp4"
                    type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                />
            </video>
            <SideMenu open={open} setOpen={setOpen} model={modelRef.current} />
        </div>
    );
};

export default LivingRoom;
