import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export const PacketReveal = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
        meshRef.current.scale.set(0, 0, 0);

        gsap.to(meshRef.current.scale, {
            x: 1, y: 1.5, z: 0.3,
            duration: 1.5,
            delay: 7,
            ease: "back.out(1.7)"
        });
        
        gsap.fromTo(meshRef.current.rotation,
            { y: Math.PI },
            { y: 0, duration: 2, delay: 7, ease: "power2.out" }
        );
    }
  }, []);

  useFrame((state) => {
     if (meshRef.current && state.clock.elapsedTime > 9) {
         meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.5;
         meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
     }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, 0]}>
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial 
        color="#f0f5f5" 
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
};
