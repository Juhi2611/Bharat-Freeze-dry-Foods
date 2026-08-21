import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export const IngredientController = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (coreRef.current) {
        gsap.fromTo(
            coreRef.current.scale,
            { x: 0, y: 0, z: 0 },
            { x: 1.5, y: 1.5, z: 1.5, duration: 1, delay: 2, ease: "elastic.out(1, 0.5)" }
        );
        // Hide after packet reveal
        gsap.to(coreRef.current.scale, {
            x: 0, y: 0, z: 0, duration: 0.5, delay: 6.5
        });
    }
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#d35930" wireframe />
      </mesh>
    </group>
  );
};
