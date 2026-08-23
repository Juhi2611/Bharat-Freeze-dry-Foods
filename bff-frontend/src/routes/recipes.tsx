import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { useCatalogData } from "@/hooks/useCatalogData";
import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX, Bookmark, Clock, ChefHat, Flame } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/recipes")({
  head: () => ({
    meta: [
      { title: "Recipes — BFF Bharat Freeze Dry Foods" },
    ],
  }),
  component: RecipesPage,
});

function RecipesPage() {
  const { products, isLoading, error } = useCatalogData();
  const recipeProducts = products.filter((product) => product.recipe);
  const [activeSlug, setActiveSlug] = useState<string | undefined>();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash;
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
      }
    }
  }, [location.hash]);

  if (isLoading) {
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-navy text-frost-white">Loading recipes...</div>;
  }

  if (error || recipeProducts.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-navy text-frost-white">
        <p className="text-xl">{error || "No recipes found yet."}</p>
        <Link to="/products" search={{ category: undefined }} className="mt-4 border border-white/20 px-6 py-3 rounded-full hover:bg-white/10 transition">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] h-dvh w-screen bg-black overflow-hidden select-none">
      <Link to="/products" search={{ category: undefined }} className="absolute top-6 left-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white/20">
        <X className="h-6 w-6" />
      </Link>
      
      <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar scroll-smooth">
        {recipeProducts.map((p) => (
          <RecipeSlide key={p.id} product={p} isActive={activeSlug === p.recipe!.slug} onVisible={() => setActiveSlug(p.recipe!.slug)} />
        ))}
      </div>
    </div>
  );
}

function RecipeSlide({ product, isActive, onVisible }: { product: Product, isActive: boolean, onVisible: () => void }) {
  const recipe = product.recipe!;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      },
      { threshold: 0.6 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [onVisible]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <div id={recipe.slug} ref={containerRef} className="relative h-full w-full snap-start snap-always flex justify-center bg-black text-white overflow-hidden">
      
      {/* Blurred Video Background for Desktop */}
      <div className="absolute inset-0 z-0 hidden md:block pointer-events-none">
        <video
          src={recipe.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-20 blur-3xl scale-[1.15]"
        />
      </div>

      {/* Mobile-like Center Feed */}
      <div className="relative h-full w-full max-w-[420px] bg-black shadow-2xl z-10 flex flex-col justify-end">
        <video
          ref={videoRef}
          src={recipe.videoUrl}
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        
        {/* Sidebar Actions */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20">
          <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-1 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition group-hover:bg-white/20">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition group-hover:bg-white/20">
              <Bookmark className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-medium opacity-80">Save</span>
          </button>
        </div>

        {/* Content Overlays */}
        <div className="absolute left-4 right-14 bottom-6 z-20 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-ice-blue drop-shadow-md">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.prepTime}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1"><ChefHat className="h-3 w-3" /> {recipe.difficulty}</span>
            {recipe.calories && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.calories}</span>
              </>
            )}
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-display font-medium leading-tight text-frost-white drop-shadow-lg">{recipe.name}</h2>
          <p className="line-clamp-2 text-xs sm:text-sm text-white/90 drop-shadow-xl pr-2">{recipe.description}</p>
          
          <div className="mt-1 flex flex-col gap-1 text-[11px] sm:text-xs text-white/90 leading-snug">
            <span className="font-bold text-white uppercase tracking-wider text-[9px] opacity-70">Ingredients</span>
            <ul className="list-inside list-disc space-y-0.5">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-1 flex flex-col gap-0.5 text-[11px] sm:text-xs text-white/90 leading-snug">
            <span className="font-bold text-ice-blue uppercase tracking-wider text-[9px]">Product Used</span>
            <span>{product.name}</span>
          </div>

          <div className="mt-3 flex w-full pr-2">
            <a
              href={buildWhatsAppLink(product.name, 1)}
              target="_blank"
              rel="noreferrer noopener"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ice-blue px-4 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-deep-navy shadow-xl transition hover:bg-white hover:scale-[1.02]"
            >
              Add To Cart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
