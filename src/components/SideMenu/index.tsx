import { Collapse } from 'antd';
import React, { useState } from 'react';
import * as THREE from "three";
import { floor_replace_texture } from '../../assets/data';
import './index.scss';
import { CheckOutlined, CloseOutlined, MenuFoldOutlined } from '@ant-design/icons';


type SideMenuProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    model: THREE.Group | null;
}

const SideMenu: React.FC<SideMenuProps> = (props) => {
    const { open, model, setOpen } = props;
    const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
    const replaceTexture = (textureImg: string, type: string) => {
        setSelectedTexture(textureImg);
        const loader = new THREE.TextureLoader();
        console.log(model)
        if (model) {
            model.traverse((obj) => {
                if (!(obj as THREE.Mesh).isMesh) return;
                const mesh = obj as THREE.Mesh;
                const meshName = mesh.name;
                const material = mesh.material as THREE.MeshStandardMaterial;

                if (meshName.includes(type)) {
                    loader.load(textureImg, (texture) => {
                        texture.colorSpace = THREE.SRGBColorSpace;

                        texture.repeat.set(4, 4);
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        material.map = texture;
                    });
                }

            })
        }
    }

    const items = [
        {
            key: '1',
            label: "地板颜色：（请选择）",
            children:
                <div className="side-menu__textures">
                    {floor_replace_texture.textures.map((item) => (
                        <div className="side-menu__texture-item" key={item.id}>
                            <img
                                className="side-menu__texture-img"
                                width={82}
                                height={82}
                                src={item.textureImg}
                                onClick={() => replaceTexture(item.textureImg, floor_replace_texture.type)}
                            />
                            {selectedTexture === item.textureImg && (
                                <div className="side-menu__texture-mark">
                                    <CheckOutlined />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

        }
    ]
    const onChange = (key: string | string[]) => {
        console.log(key);
    };
    return (<div className={`side-menu ${open ? "side-menu--open" : ""}`}>
        <div className="side-menu__toggle-btn" onClick={() => setOpen(!open)}>
            {open ? <CloseOutlined /> : <MenuFoldOutlined />}
        </div>
        <p className="side-menu__title">Change Material</p>
        <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />
    </div>)

}
export default SideMenu;