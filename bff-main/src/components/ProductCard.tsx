import { motion } from "framer-motion";
import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { Link } from "@tanstack/react-router";
import { Leaf, Minus, Plus, Play } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/products";
import { InteractiveExperienceModal } from "./InteractiveExperienceModal";
import { isVideoUrl } from "@/lib/utils";
import { MediaBackground } from "./MediaBackground";

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const [qty, setQty] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const waLink = buildWhatsAppLink(product.name, qty);

  const active = hover;
  const hasRecipe = !!product.recipe;
  const hasInteractiveExp = !!product.interactiveExperience;
  const isIngredientVideo = isVideoUrl(product.ingredientImage);
  const hoverVideo = hasInteractiveExp 
    ? product.interactiveExperience!.videoUrl 
    : (hasRecipe ? product.recipe?.videoUrl : (isIngredientVideo ? product.ingredientImage : null));

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable
      glareMaxOpacity={0.15}
      glareColor={product.accent}
      transitionSpeed={800}
      className="h-full"
    >
      <div
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-500"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          if (hasInteractiveExp) {
            setModalOpen(true);
          } else {
            setHover((h) => !h);
          }
        }}
        style={{
          boxShadow: hover
            ? `0 30px 60px -20px ${product.accent}55, 0 0 0 1px ${product.accent}30`
            : undefined,
        }}
      >
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${product.accent}20, transparent 60%)`,
          }}
        />

        {/* Image stack */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-[600ms] ease-out ${
              active ? "scale-110 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <MediaBackground
              src={product.packImage}
              alt={product.name}
              loading="lazy"
            />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-[600ms] ease-out ${
              active ? "scale-105 opacity-100 translate-y-0" : "scale-110 opacity-0 translate-y-2"
            }`}
          >
            <MediaBackground
              src={hoverVideo || product.ingredientImage}
              alt={product.name}
              isVideo={!!hoverVideo}
              active={active}
              loading="lazy"
            />
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.organic && (
              <span className="flex items-center gap-1 rounded-full bg-forest-green/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-frost-white backdrop-blur">
                <Leaf className="h-3 w-3" /> Organic
              </span>
            )}
          </div>
          {product.whiteLabel && (
            <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-frost-white backdrop-blur-md">
              White-label
            </span>
          )}

          {/* Overlay content when active */}
          <motion.div
            initial={false}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 bg-gradient-to-t from-deep-navy via-deep-navy/85 to-transparent p-4 pt-16"
          >
            {(hasRecipe || hasInteractiveExp) && (
              hasInteractiveExp ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/20"
                >
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100 group-hover/btn:animate-[shimmer_1.5s_infinite]" /> */}
                  {/* <Play className="h-4 w-4 fill-white text-white" /> */}
                  
                </button>
              ) : (
                <Link
                  to="/recipes"
                  hash={product.recipe!.slug}
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100 group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  <Play className="h-4 w-4 fill-white text-white" />
                  View Recipe
                </Link>
              )
            )}

            <div className="flex items-center gap-2">
              <span className="text-eyebrow" style={{ color: product.accent }}>
                Add to cart
              </span>
              <div className="ml-auto flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  aria-label="Decrease"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty((q) => Math.max(1, q - 1));
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-frost-white/80 hover:bg-white/10"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center font-mono text-sm text-frost-white">{qty}</span>
                <button
                  aria-label="Increase"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty((q) => Math.min(20, q + 1));
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-frost-white/80 hover:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <a
              href={buildWhatsAppLink(product.name, qty)}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
            >
              Inquire on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Meta */}
        <div className="flex items-start justify-between gap-4 p-4">
          <div>
            <p className="text-eyebrow !text-[0.6rem]" style={{ color: product.accent }}>
              {product.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-frost-white">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-steel-silver">{product.blurb}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xl font-bold text-frost-white">{product.price}</p>
            <p className="text-[0.65rem] uppercase tracking-widest text-steel-silver">per pack</p>
          </div>
        </div>
      </div>
      
      {/* Interactive Modal */}
      <InteractiveExperienceModal 
        product={product} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </Tilt>
  );
}
