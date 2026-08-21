import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ShoppingCart, Leaf, Wind, Snowflake, Droplets, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import type { Product, IngredientBenefit } from "@/lib/products";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function InteractiveExperienceModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const exp = product.interactiveExperience;
  const [activeIngredient, setActiveIngredient] = useState<IngredientBenefit | null>(null);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);

  if (!exp) return null;

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg px-4 py-6 md:p-12 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-deep-navy/90 shadow-2xl overflow-hidden shadow-[0_0_80px_rgba(139,127,62,0.15)] flex flex-col max-h-[90vh]"
            style={{ 
              boxShadow: `0 0 80px -20px ${product.accent}40, inset 0 0 0 1px ${product.accent}20` 
            }}
          >
            {/* Header / Nav */}
            <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-deep-navy/80 px-6 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold" style={{ color: product.accent }}>
                  BFF
                </span>
                <span className="text-sm font-semibold uppercase tracking-widest text-frost-white">
                  Premium Experience
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
              
              {/* Intro Section */}
              <div className="relative overflow-hidden px-6 py-16 md:px-16 md:py-24">
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 80% 20%, ${product.accent}, transparent 50%)` }}
                />
                
                <div className="relative z-10 max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-display text-4xl md:text-6xl text-frost-white mb-6">
                      {exp.title}
                    </h2>
                    <p className="text-lg md:text-xl text-frost-white/80 leading-relaxed mb-8">
                      {exp.description}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-3 mb-10"
                  >
                    {exp.features.map((feature, i) => (
                      <span key={i} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ice-blue backdrop-blur-md flex flex-row items-center gap-2">
                         <CheckCircle2 className="h-3 w-3" /> {feature}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <a
                      href={buildWhatsAppLink(product.name, 1)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest text-deep-navy transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: product.accent }}
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </a>
                    <button
                      onClick={() => scrollTo(videoSectionRef)}
                      className="group flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
                    >
                      <Play className="h-4 w-4" /> 
                    </button>
                    <button
                      onClick={() => scrollTo(ingredientsRef)}
                      className="group flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
                    >
                      <Leaf className="h-4 w-4" /> Interactive Ingredient Story
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Interactive Ingredients Section */}
              <div ref={ingredientsRef} className="px-6 py-20 md:px-16 bg-black/40 border-y border-white/5">
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-4xl font-display text-white mb-4">Discover the Ingredients</h3>
                  <p className="text-white/60 text-sm uppercase tracking-widest">Hover & Click to explore</p>
                </div>
                
                <div className="relative mx-auto max-w-4xl h-[400px] flex items-center justify-center">
                  {/* Floating ingredients */}
                  {exp.ingredients.map((ing, i) => {
                    const angle = (i / exp.ingredients.length) * Math.PI * 2;
                    const radius = 140;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.button
                        key={ing.name}
                        onClick={() => setActiveIngredient(ing)}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        animate={{
                          y: [y - 5, y + 5, y - 5],
                          rotate: [0, 5, -5, 0],
                        }}
                        style={{ x, y }}
                        className="absolute flex h-24 w-24 md:h-28 md:w-28 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-white/10"
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        <span className="text-4xl drop-shadow-lg">{ing.emoji}</span>
                        <span className="mt-2 text-xs font-bold tracking-wider text-white drop-shadow-md">{ing.name}</span>
                        
                        {/* Soft lighting overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay pointer-events-none" />
                      </motion.button>
                    );
                  })}
                  
                  {/* Center core */}
                  <div className="absolute h-32 w-32 rounded-full bg-black/50 border border-white/10 flex items-center justify-center animate-pulse backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                     <span className="text-sm font-semibold uppercase tracking-wider text-white/50">100%<br/>Natural</span>
                  </div>
                </div>
              </div>

              {/* Freeze-Drying Story Timeline */}
              <div className="px-6 py-20 md:px-16 pb-24 relative overflow-hidden">
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-4xl font-display text-white mb-4">Our Freeze-Drying Process</h3>
                  <p className="text-white/60 text-sm uppercase tracking-widest">Preserving every ounce of nutrition</p>
                </div>

                <div className="mx-auto max-w-4xl relative">
                   <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2" />
                   
                   {[
                     { title: "Fresh Ingredients", icon: Leaf, desc: "Sourced locally and prepared fresh." },
                     { title: "Rapid Freezing", icon: Snowflake, desc: "Flash-frozen to lock in structure." },
                     { title: "Vacuum Chamber", icon: Wind, desc: "Lowered pressure for sublimation." },
                     { title: "Moisture Removed", icon: Droplets, desc: "Ice turns straight to vapor." },
                     { title: "Nutrients Locked In", icon: ShieldCheck, desc: "98% of natural vitamins retained." },
                     { title: "Ready to Serve", icon: CheckCircle2, desc: "Just add love, or serve dry as a crunch." }
                   ].map((step, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       transition={{ delay: 0.1 * i }}
                       className={`flex items-center gap-6 md:gap-12 w-full mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                     >
                        <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                          <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                          <p className="text-sm text-white/60">{step.desc}</p>
                        </div>
                        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-deep-navy shadow-xl">
                          <step.icon className="h-6 w-6 text-ice-blue" />
                        </div>
                        <div className="flex-1" />
                     </motion.div>
                   ))}
                </div>
              </div>

               {/* Video Section */}
               <div ref={videoSectionRef} className="px-6 pb-20 md:px-16 pt-10 border-t border-white/5 bg-black/60">
                <div className="text-center mb-10">
                  <h3 className="text-2xl md:text-3xl font-display text-white">The BFF Experience</h3>
                </div>
                
                <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <video
                    src={exp.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-[2rem]" />
                   <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                     <p className="text-white/80 text-sm font-medium">Premium Visual Presentation</p>
                     <p className="text-white/50 text-xs uppercase tracking-widest">{product.name}</p>
                   </div>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Ingredient Detail Modal */}
      {activeIngredient && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
           onClick={() => setActiveIngredient(null)}
        >
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
             onClick={e => e.stopPropagation()}
             className="w-full max-w-md rounded-3xl border border-white/20 bg-deep-navy/95 p-8 shadow-2xl backdrop-blur-xl relative"
          >
             <button 
               onClick={() => setActiveIngredient(null)}
               className="absolute top-4 right-4 text-white/50 hover:text-white"
             >
               <X className="h-5 w-5" />
             </button>
             
             <div className="text-center mb-6">
                <div className="text-6xl mb-4 drop-shadow-2xl">{activeIngredient.emoji}</div>
                <h4 className="text-2xl font-bold text-white mb-2">{activeIngredient.name}</h4>
                <p className="text-white/70 text-sm">{activeIngredient.description}</p>
             </div>

             <div className="space-y-4 text-sm">
                <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                  <span className="block text-[10px] uppercase tracking-widest text-[#8B7F3E] mb-1 font-bold">Nutritional Benefits</span>
                  <p className="text-white/90">{activeIngredient.benefits}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 rounded-xl bg-white/5 p-4 border border-white/5">
                    <span className="block text-[10px] uppercase tracking-widest text-ice-blue mb-1 font-bold">Why include it?</span>
                    <p className="text-white/80 text-xs">{activeIngredient.whyIncluded}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/5 p-4 border border-white/5">
                    <span className="block text-[10px] uppercase tracking-widest text-frost-white mb-1 font-bold">Freeze-Dried Effect</span>
                    <p className="text-white/80 text-xs">{activeIngredient.freezeDrying}</p>
                  </div>
                </div>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
