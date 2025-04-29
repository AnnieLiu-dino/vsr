import { useTexture } from '@react-three/drei';

// 负责纹理贴图加载
export function useLightMaps() {
  // 并行加载多个贴图
  const textures = useTexture({
    CoffeeTable: '/assets/livingroom/lightMaps/CoffeeTable3.webp',
    CurtainCarpets: '/assets/livingroom/lightMaps/CurtainCarpets3.webp',
    Decor: '/assets/livingroom/lightMaps/Decor2.webp',
    Exterior: '/assets/livingroom/lightMaps/Exterior7.jpg',
    Frames: '/assets/livingroom/lightMaps/Frames.webp',
    Furniture: '/assets/livingroom/lightMaps/Furniture2.webp',
    Sofa: '/assets/livingroom/lightMaps/Sofa2.webp',
    Table: '/assets/livingroom/lightMaps/Table2.webp',
    TV_Shelf: '/assets/livingroom/lightMaps/TV_Shelf3.webp',
    Empty_Exterior: '/assets/livingroom/lightMaps/Empty_Exterior.webp',
    Empty_Furniture: '/assets/livingroom/lightMaps/Empty_Furniture.webp',
  });

  // 统一设置flipY
  Object.values(textures).forEach((texture) => {
    texture.flipY = false;
  });

  return textures;
}
