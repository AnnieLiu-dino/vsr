import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag, useMove } from '@use-gesture/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import lerp from 'lerp';
import { useModel } from '../store/model';

const PI_2 = Math.PI / 2;
const dragSpeed = 3;
// 控制圆在地面上浮多少
const yLevel = - 0.01;

function findIntersectItems(array: THREE.Object3D[], activeFloor: string): THREE.Object3D[] {
    const result: THREE.Object3D[] = [];
    array.forEach((o) => {
        if (o.name === activeFloor) {
            result.push(o);
        }
        if (o.children?.length) {
            result.push(...findIntersectItems(o.children, activeFloor));
        }
    });
    return result;
}

export default function Controls() {
    const { camera, gl, scene, raycaster, mouse } = useThree();
    const floorCircleRef = useRef<THREE.Group>(null);
    const yawObject = useRef(new THREE.Object3D());
    const pitchObject = useRef(new THREE.Object3D());
    const [isMoving, setIsMoving] = useState(false);

    const { state, dispatch } = useModel();

    useEffect(() => {
        camera.rotation.order = 'YXZ';
    }, [camera]);

    const activeFloor = state.activeFloor;


    // 🖱️ 拖动（旋转视角） + 点击（移动到地面）
    useDrag(
        ({ down, delta: [mx, my], tap, first }) => {
            if (tap) {
                raycaster.setFromCamera(mouse, camera);
                const root = scene.getObjectByName('Scene');
                if (!root) return;

                const targets = findIntersectItems(root.children, activeFloor);
                const intersects = raycaster.intersectObjects(targets, false);

                for (const intersect of intersects) {
                    if (intersect.object.name === activeFloor) {
                        setIsMoving(true);
                        const floorCircle = floorCircleRef.current;
                        if (floorCircle) {
                            floorCircle.visible = true;
                            floorCircle.position.copy(intersect.point);
                            const marker = floorCircle.children[0] as any;
                            if (marker?.material) {
                                gsap.fromTo(
                                    marker.material,
                                    { opacity: 1 },
                                    {
                                        opacity: 0,
                                        duration: 0.4,
                                        onComplete: () => {
                                            marker.material.opacity = 0;
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

            const targets = findIntersectItems(root.children, activeFloor);
            const intersects = raycaster.intersectObjects(targets, true);

            const floorCircle = floorCircleRef.current;
            if (!floorCircle) return;

            const hit = intersects.find((i) => i.object.name === activeFloor);
            if (hit) {
                floorCircle.visible = true;
                floorCircle.position.copy(hit.point).add(new THREE.Vector3(0, yLevel, 0));
            } else {
                floorCircle.visible = false;
            }
        },
        { target: gl.domElement }
    );

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

    return null;
}
