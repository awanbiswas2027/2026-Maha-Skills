import * as THREE from 'three';

export interface LogoMarkProps {
  primary: THREE.Color;
  accent: THREE.Color;
  depth: number;
}

function createRoundedRectShape(x: number, y: number, width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
}

export function createLogoMarkModel({ primary, accent, depth }: LogoMarkProps): THREE.Group {
  const group = new THREE.Group();
  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelSize: 0.4,
    bevelSegments: 2,
    bevelThickness: 0.4,
    curveSegments: 12
  };

  const primaryMaterial = new THREE.MeshStandardMaterial({
    color: primary,
    roughness: 0.6,
    metalness: 0.05
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: accent,
    roughness: 0.6,
    metalness: 0.05
  });

  const ox = -16;
  const oy = 16; 
  
  const s1 = createRoundedRectShape(4 + ox, oy - (18 + 12), 6, 12, 1.5);
  const g1 = new THREE.ExtrudeGeometry(s1, extrudeSettings);
  const m1 = new THREE.Mesh(g1, primaryMaterial);
  group.add(m1);

  const s2 = createRoundedRectShape(13 + ox, oy - (11 + 19), 6, 19, 1.5);
  const g2 = new THREE.ExtrudeGeometry(s2, extrudeSettings);
  const m2 = new THREE.Mesh(g2, primaryMaterial);
  group.add(m2);

  const s3 = createRoundedRectShape(22 + ox, oy - (6 + 24), 6, 24, 1.5);
  const g3 = new THREE.ExtrudeGeometry(s3, extrudeSettings);
  const m3 = new THREE.Mesh(g3, primaryMaterial);
  group.add(m3);

  const diamond = new THREE.Shape();
  diamond.moveTo(25 + ox, oy - 0);
  diamond.lineTo(28 + ox, oy - 3);
  diamond.lineTo(25 + ox, oy - 6);
  diamond.lineTo(22 + ox, oy - 3);
  diamond.closePath();

  const gd = new THREE.ExtrudeGeometry(diamond, extrudeSettings);
  const md = new THREE.Mesh(gd, accentMaterial);
  group.add(md);

  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  let triangles = 0;
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      triangles += child.geometry.index ? child.geometry.index.count / 3 : child.geometry.attributes.position.count / 3;
    }
  });
  if (process.env.NODE_ENV === 'development') {
    console.log('LogoMark 3D Triangles:', triangles);
  }

  return group;
}
