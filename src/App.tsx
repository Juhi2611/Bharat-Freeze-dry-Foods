import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { HeroScene } from './components/hero/HeroScene';
import { Navbar } from './components/layout/Navbar';

export default function App() {
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Show UI text after packet reveal (9s)
    const t = setTimeout(() => setShowUI(true), 9000);
    
    return () => { 
      lenis.destroy(); 
      clearTimeout(t);
    };
  }, []);

  return (
    <main className="w-full min-h-screen relative overflow-hidden">
      <Navbar />
      <HeroScene />
      
      {/* Delayed UI reveal mirroring Scene 5 */}
      <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-all duration-1000 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         <h1 className="text-xl md:text-2xl font-sans font-light text-brand-frostWhite tracking-widest drop-shadow-md mb-8">
            Sourcing the Best Quality, For You.
         </h1>
         <div className="flex gap-4">
             <button className="px-6 py-3 bg-brand-forestGreen text-brand-frostWhite rounded-full font-medium hover:bg-opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(35,78,61,0.5)]">
                 Explore Products
             </button>
             <button className="px-6 py-3 bg-transparent border-2 border-brand-iceBlue text-brand-iceBlue rounded-full font-medium hover:bg-brand-iceBlue/10 transition-all hover:scale-105 active:scale-95">
                 Get in Touch
             </button>
         </div>
      </div>
    </main>
  );
}
