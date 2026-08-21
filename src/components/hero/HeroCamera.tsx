import { PerspectiveCamera } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

export const HeroCamera = () => {
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (cameraRef.current) {
        gsap.fromTo(cameraRef.current.position, 
            { z: 12, y: -2 }, 
            { z: 8, y: 0, duration: 2.5, ease: "power3.out" }
        );
    }
  }, []);

  useFrame((state) => {
    if (cameraRef.current) {
      cameraRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cameraRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 8]} fov={45} />;
};
