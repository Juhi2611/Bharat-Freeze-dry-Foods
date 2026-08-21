

export const HeroLighting = () => {
  return (
    <>
      <ambientLight intensity={0.3} color="#a3d2ca" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2.5} 
        color="#ffffff" 
        castShadow 
      />
      {/* Cold Rim Light */}
      <spotLight 
        position={[-10, 5, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={4} 
        color="#a3d2ca" 
      />
      {/* Warm Spice Accent Light */}
      <spotLight 
        position={[10, -5, 5]} 
        angle={0.2} 
        penumbra={1} 
        intensity={2} 
        color="#d35930" 
      />
    </>
  );
};
