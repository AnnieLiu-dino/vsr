import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag, useMove } from '@use-gesture/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import lerp from 'lerp';

const activeFloor = 'Safe_Area'
const PI_2 = Math.PI / 2;
const dragSpeed = 3;
// 控制圆在地面上浮多少
const yLevel = - 0.01;

function getIntersectObj(children: THREE.Object3D[], activeFloor: string): THREE.Object3D[] {
    const result: THREE.Object3D[] = [];
    children.forEach((o) => {
        if (o.name === activeFloor) {
            result.push(o);
        }
        if (o.children?.length) {
            result.push(...getIntersectObj(o.children, activeFloor));
        }
    });
    return result;
}

export default function Controls() {
    const { camera, gl, scene, raycaster, mouse } = useThree();
    const floorCircleRef = useRef<THREE.Group>(null);
    // 左右旋转 y轴，用于控制相机的偏航角度
    const yawObject = useRef(new THREE.Object3D());
    // 上下旋转 x轴，用于控制相机的俯仰角度
    const pitchObject = useRef(new THREE.Object3D());

    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        camera.rotation.order = 'YXZ';
    }, [camera]);

    useEffect(() => {
        // 初始化 floorCircle 引用
        floorCircleRef.current = scene.getObjectByName('floorCircle') as THREE.Group;
        if (floorCircleRef.current) floorCircleRef.current.visible = false;
    }, [scene]);

    useFrame(() => {
        camera.updateProjectionMatrix();
        camera.rotation.x = lerp(camera.rotation.x, -pitchObject.current.rotation.x, 0.2);
        camera.rotation.y = lerp(camera.rotation.y, -yawObject.current.rotation.y, 0.2);
    });

    // 🖱️ 拖动（旋转视角） + 点击（移动到地面）
    useDrag(
        ({ down, delta: [mx, my], tap, first }) => {
            // tap: true 代表点击事件，down: true 代表按下鼠标拖动， first: true 代表第一次按下鼠标
            if (tap) {
                raycaster.setFromCamera(mouse, camera);
                const root = scene.getObjectByName('Scene');
                if (!root) return;
                // 找到场景中所有 name === activeFloor 的对象（通常是 Mesh，也可能是 Group 等容器）
                const targets = getIntersectObj(root.children, activeFloor);
                // 用 Raycaster 发射一条射线，检测与 targets 中的物体有哪些相交
                const intersects = raycaster.intersectObjects(targets, false);

                for (const intersect of intersects) {
                    if (intersect.object.name === activeFloor) {
                        setIsMoving(true);
                        const floorCircle = floorCircleRef.current;
                        if (floorCircle) {
                            console.log('floorCircle', floorCircle);
                            floorCircle.visible = true;
                            // 将圆的中心 放置在 交点坐标
                            floorCircle.position.copy(intersect.point);
                            const marker = floorCircle.children[0] as THREE.Mesh;

                            // 实现圆的淡出动画
                            if (marker?.material) {
                                const material = marker.material as THREE.Material;
                                gsap.fromTo(
                                    material,
                                    { opacity: 1 },
                                    {
                                        opacity: 0,
                                        duration: 0.4,
                                        onComplete: () => {
                                            material.opacity = 0;
                                            marker.scale.set(1, 1, 1);
                                        }
                                    }
                                );
                            }
                        }

                        gsap.to(camera.position, {
                            duration: 0.8,
                            x: intersect.point.x,
                            z: intersect.point.z,
                            onUpdate: () => camera.updateProjectionMatrix(),
                            onComplete: () => setIsMoving(false),
                        });

                        break;
                    }
                }
            } else if (down) {
                if (first) {
                    document.body.style.cursor = 'grab';
                }
                document.body.style.cursor = 'grabbing';

                yawObject.current.rotation.y += (-mx * dragSpeed) / 1000;
                pitchObject.current.rotation.x += (-my * dragSpeed) / 1000;
                // 限制上下最大视角为 ±90°，也就是避免“头掉转、翻转”现象。
                pitchObject.current.rotation.x = Math.max(
                    -PI_2,
                    Math.min(PI_2, pitchObject.current.rotation.x)
                );
            } else {
                document.body.style.cursor = 'grab';
            }
        },
        {
            target: gl.domElement,
            filterTaps: true,
        }
    );

    // 💡 鼠标移动（预览地面 hover 效果）
    useMove(
        () => {
            raycaster.setFromCamera(mouse, camera);
            const root = scene.getObjectByName('Scene');
            if (!root) return;

            const targets = getIntersectObj(root.children, activeFloor);
            // ecursive = true，会递归检测所有子物体
            const intersects = raycaster.intersectObjects(targets, true);

            const floorCircle = floorCircleRef.current;
            if (!floorCircle) return;

            const intersect = intersects.find((i) => i.object.name === activeFloor);
            if (intersect) {
                floorCircle.visible = true;
                // 圆的中心点 + yLevel = Y 方向上抬一点点
                floorCircle.position.copy(intersect.point).add(new THREE.Vector3(0, yLevel, 0));
            } else {
                floorCircle.visible = false;
            }
        },
        { target: gl.domElement }
    );

    return null;
}
