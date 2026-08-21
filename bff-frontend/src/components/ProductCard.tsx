import { motion } from "framer-motion";
import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { Link } from "@tanstack/react-router";
import { Leaf, Minus, Plus, Play, ShoppingBag, Check } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/products";
import { InteractiveExperienceModal } from "./InteractiveExperienceModal";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const [qty, setQty] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const active = hover;
  const hasRecipe = !!product.recipe;
  const hasInteractiveExp = !!product.interactiveExperience;
  const hoverVideo = hasInteractiveExp ? product.interactiveExperience!.videoUrl : (hasRecipe ? product.recipe?.videoUrl : null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      {
        id: product.sku || product.name,
        sku: product.sku || 'SKU-001',
        name: product.name,
        price_inr: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 250,
        pack_image: product.packImage,
        accent_color: product.accent,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-500 hover:border-sky-500/40"
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
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${product.accent}20, transparent 60%)`,
          }}
        />

        {/* Image stack */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-deep-navy">
          <img
            src={product.packImage}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[600ms] ease-out ${
              active ? "scale-110 opacity-0" : "scale-100 opacity-100"
            }`}
            loading="lazy"
          />
          {hoverVideo ? (
            <video
              src={hoverVideo}
              autoPlay
              muted
              loop
              playsInline
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[600ms] ease-out ${
                active ? "scale-105 opacity-100 translate-y-0" : "scale-110 opacity-0 translate-y-2"
              }`}
            />
          ) : (
            <img
              src={product.ingredientImage}
              alt=""
              aria-hidden
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[600ms] ease-out ${
                active ? "scale-105 opacity-100 translate-y-0" : "scale-110 opacity-0 translate-y-2"
              }`}
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.organic && (
              <span className="flex items-center gap-1 rounded-full bg-forest-green/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-frost-white backdrop-blur">
                <Leaf className="h-3 w-3" /> Organic
              </span>
            )}
          </div>
          {product.whiteLabel && (
            <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-frost-white backdrop-blur-md z-10">
              White-label
            </span>
          )}
        </div>

        {/* Card Meta & Always-Visible Add to Cart */}
        <div className="flex flex-col justify-between flex-1 p-4 gap-3 bg-slate-900/40">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-eyebrow !text-[0.6rem]" style={{ color: product.accent }}>
                {product.category}
              </p>
              <div className="text-right">
                <p className="text-lg font-bold text-frost-white">{product.price}</p>
              </div>
            </div>
            <h3 className="mt-1 text-base font-bold text-frost-white line-clamp-1">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-steel-silver">{product.blurb}</p>
          </div>

          {/* Always Visible Add to Cart Section */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  aria-label="Decrease"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty((q) => Math.max(1, q - 1));
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-frost-white/80 hover:bg-white/10"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-5 text-center font-mono text-xs text-frost-white">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQty((q) => Math.min(20, q + 1));
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-frost-white/80 hover:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md ${
                  added
                    ? "bg-emerald-500 shadow-emerald-500/30"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25"
                }`}
              >
                {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
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
