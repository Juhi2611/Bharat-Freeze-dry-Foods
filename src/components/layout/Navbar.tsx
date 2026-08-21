import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-brand-charcoal/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
         <div className="text-2xl font-bold font-sans tracking-widest text-brand-iceBlue drop-shadow-md">
            BFF<span className="text-brand-spiceOrange">.</span>
         </div>
         <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-brand-frostWhite/70">
            <a href="#" className="hover:text-brand-iceBlue transition-colors drop-shadow">Home</a>
            <a href="#" className="hover:text-brand-iceBlue transition-colors drop-shadow">About Us</a>
            <a href="#" className="hover:text-brand-iceBlue transition-colors drop-shadow">Products</a>
            <a href="#" className="hover:text-brand-iceBlue transition-colors drop-shadow">B2B</a>
            <a href="#" className="hover:text-brand-spiceOrange transition-colors drop-shadow">Contact</a>
         </div>
      </div>
    </nav>
  );
};
