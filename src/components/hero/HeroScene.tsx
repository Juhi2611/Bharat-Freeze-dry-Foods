import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroCamera } from './HeroCamera';
import { HeroLighting } from './HeroLighting';
import { FrostParticles } from './FrostParticles';
import { IngredientController } from './IngredientController';
import { PacketReveal } from './PacketReveal';
import { Preload } from '@react-three/drei';

export const HeroScene = () => {
  return (
    <div className="w-full h-screen bg-brand-charcoal absolute top-0 left-0 -z-10">
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#1a1d1e']} />
        <fog attach="fog" args={['#1a1d1e', 5, 25]} />
        <HeroCamera />
        <HeroLighting />

        <Suspense fallback={null}>
          <FrostParticles />
          <IngredientController />
          <PacketReveal />
          <Preload all />
        </Suspense>
      </Canvas>
      <div className="absolute top-8 right-8 z-50">
         <button className="text-brand-iceBlue opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest text-xs border border-brand-iceBlue/20 px-4 py-2 rounded-full cursor-pointer mix-blend-screen">Skip Intro</button>
      </div>
    </div>
  );
};
