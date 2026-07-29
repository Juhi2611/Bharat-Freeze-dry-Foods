import React, { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function FrozenEdgeIndicator() {
  const { scrollY } = useScroll();
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; driftX: number; driftY: number }[]>([]);
  const sparkleIdCounter = useRef(0);
  const lastSpawnY = useRef(0);

  useMotionValueEvent(scrollY, "change", (currentY) => {
    const diff = Math.abs(currentY - lastSpawnY.current);
    // Keep density low: Generate 1 snowflake approximately every ~100-150 pixels scrolled to remain elegant
    if (diff > 120) {
      if (Math.random() > 0.3) { // 70% chance to spawn, breaking exact patterns
        spawnSparkle();
      }
      // Update threshold regardless so it doesn't instantly burst un-spawned iterations
      lastSpawnY.current = currentY; 
    }
  });

  const spawnSparkle = () => {
    const id = sparkleIdCounter.current++;
    
    // Subtle organic spawning ranges across the viewport
    // Keeps away from the extreme edges to prevent cropping
    const x = 10 + Math.random() * 80; // 10vw to 90vw
    const y = 10 + Math.random() * 80; // 10vh to 90vh
    
    // Gentle drift trajectory to simulate cold breeze kinematics
    const driftX = (Math.random() - 0.5) * 60; // Drifts between -30px and +30px horizontally
    const driftY = (Math.random() * 30) + 15;  // Drifts between 15px and 45px gently downwards

    setSparkles((prev) => [...prev.slice(-3), { id, x, y, driftX, driftY }]); // Max 4 snowflakes visible at a time
    
    setTimeout(() => {
      setSparkles((prev) => prev.filter((p) => p.id !== id));
    }, 2800); // Life cycle of rotation and drifting
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {sparkles.map((p) => {
        // High quality sharp geometrical snowflake reflecting ice crystal structure
        const snowflakeSvg = "M 8 0 L 8 16 M 0 8 L 16 8 M 2.5 2.5 L 13.5 13.5 M 2.5 13.5 L 13.5 2.5 M 8 4 L 11 1 M 11 15 L 8 12 M 1 5 L 4 8 M 15 11 L 12 8";
        
        return (
          <motion.div
            key={p.id}
            className="absolute w-[24px] md:w-[34px] h-[24px] md:h-[34px] -translate-x-1/2 -translate-y-1/2"
            style={{ 
                top: `${p.y}vh`, 
                left: `${p.x}vw`
            }}
            initial={{ opacity: 0, scale: 0, rotate: -20, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0],
              rotate: [0, 80],
              x: [0, p.driftX],
              y: [0, p.driftY]
            }}
            transition={{ duration: 2.6, ease: "easeOut" }}
          >
            <svg viewBox="0 0 16 16" className="w-full h-full stroke-white drop-shadow-[0_0_12px_rgba(255,255,255,1)]" strokeWidth="1" strokeLinecap="round">
              <path d={snowflakeSvg} fill="none" />
              <circle cx="8" cy="8" r="1.5" className="fill-ice-blue/90 stroke-none opacity-80" />
            </svg>

            {/* Emit tiny frost particles dynamically from the center */}
            <motion.div 
               className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[1px] drop-shadow-[0_0_4px_white]"
               initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
               animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x: -20, y: -10 }}
               transition={{ duration: 1.6, delay: 0.1, ease: "easeOut" }}
            />
            <motion.div 
               className="absolute top-1/2 left-1/2 w-1 h-1 bg-ice-blue rounded-full blur-[1px] drop-shadow-[0_0_4px_#4FA8D8]"
               initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
               animate={{ opacity: [0, 0.9, 0], scale: [0, 1.5, 0], x: 25, y: 20 }}
               transition={{ duration: 2.0, delay: 0.3, ease: "easeOut" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
