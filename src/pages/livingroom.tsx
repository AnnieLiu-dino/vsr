import React, { Suspense, useState, useEffect, useCallback } from "react";
import { useResizeDetector } from "react-resize-detector";
import LoadingManager from '../components/LoadingManager';
import CustomCamera from "../components/CustomCamera";
import FloorCircle from "../components/Circle/FloorCircle";
import Model from '../components/Scene/Model'
import Controls from "../components/Controls";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";


// const Controls = React.lazy(() => import("../components/Controls"));
// const Model = React.lazy(() => import("../models/Hall"));


const Home = () => {
    // 相机视野
    const [fov, setFov] = useState(55);
    const { width, ref } = useResizeDetector();


    useEffect(() => {
        if (width !== undefined) {
            setFov(width < 500 ? 85 : 55);
        }
    }, [width]);

    return <div ref={ref} style={{ width: "100vw", height: "100vh" }}>
        {/* Canvas整个WebGL场景容器，子组件不可随意动GL的全局状态 */}
        <Canvas
            dpr={[1, 2]}
            shadows
            onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.0; // 可调成 1.2 或 1.5 提升对比
                gl.outputColorSpace = THREE.SRGBColorSpace; // 取代 outputEncoding
            }}
        >

            {/* ✅ 监听 THREE all Loader 的进度 */}
            <LoadingManager />
            <ambientLight intensity={1} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            {/* ✅ 自定义相机 */}
            <CustomCamera fov={fov} position={[1, 1.37, 0]} lookAt={[0, 0, 10]} near={0.1} far={100} />
            <Suspense fallback={"Loading.."}>
                <FloorCircle />
                <Model />
                <Controls />
            </Suspense>
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
    </div>;
};

export default Home
