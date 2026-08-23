import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import type { Category } from "@/lib/products";
import { useCatalogData } from "@/hooks/useCatalogData";
import { FrostParticles } from "@/components/FrostParticles";
import { useTheme } from "@/lib/theme-context";
import ProductsLight from "@/components/light/Products.jsx";
import { Wind } from "lucide-react";

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    return {
      category: typeof search?.category === "string" ? search.category : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Products — BFF Bharat Freeze Dry Foods" },
      {
        name: "description",
        content:
          "Explore freeze-dried fruits, vegetables, gravies, spices, superfoods, pre-cooked meals and premium pet food. Hover any pack to reveal the fresh ingredient inside.",
      },
      { property: "og:title", content: "Products — BFF" },
      {
        property: "og:description",
        content: "Freeze-dried, export-grade. Frozen at the peak, preserved for life.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { theme } = useTheme();
  const catalog = useCatalogData();
  const navigate = useNavigate({ from: "/products" });
  const { category } = Route.useSearch();

  if (theme === "light") {
    return (
      <main>
        <section style={{ position: 'relative', padding: '140px 0 100px', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #081A0C 0%, #0D2314 50%, #0A1A0A 100%)' }}>
          <video autoPlay muted loop playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '85% center', opacity: 0.70 }}>
            <source src="/videos/products_bg.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(5,15,8,0.12)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 10, paddingLeft: 'max(20px, 4vw)', maxWidth: '840px' }}>
            <div className="hero-label-anim" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139,195,74,0.15)', border: '1px solid rgba(139,195,74,0.3)', borderRadius: '9999px', marginBottom: '36px' }}>
              <Wind size={13} color="#8BC34A" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C5E1A5' }}>The Full Range</span>
            </div>
            <h1 className="hero-h1-anim" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 7vw, 108px)', lineHeight: 1.02, letterSpacing: '-0.04em', color: 'white', marginBottom: '28px' }}>
              Every Pack,{' '}<span style={{ background: 'linear-gradient(135deg, #FFD54F 0%, #FFAB91 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>At Its Ripest.</span>
            </h1>
            <p className="hero-p-anim" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 21px)', fontWeight: 300, lineHeight: 1.72, color: 'rgba(255,255,255,0.70)', maxWidth: '600px' }}>
              Hover any pack to reveal the fresh ingredient inside. On mobile, tap the card.
            </p>
          </div>
        </section>
        <ProductsLight products={catalog.products} categories={catalog.categories} isLoading={catalog.isLoading} error={catalog.error} />
      </main>
    );
  }

  // Dark theme
  const rawCategory =
    typeof category === "string"
      ? category.replace(/\+/g, " ")
      : undefined;

  const categories = catalog.categories.map((item) => item.name);
  const activeCategory: Category | "All" =
    rawCategory && categories.includes(rawCategory)
      ? (rawCategory as Category)
      : "All";

  const handleCategoryChange = (c: Category | "All") => {
    navigate({
      search: { category: c === "All" ? undefined : c },
      replace: false,
    });
  };


  const filtered =
    activeCategory === "All"
      ? catalog.products
      : catalog.products.filter((p) => p.category === activeCategory);

  return (
    <div className="relative">
      {/* Header */}
      <section className="relative overflow-hidden bg-deep-navy pt-32 pb-16">
        <FrostParticles count={16} />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="text-eyebrow mb-4">The full range</p>
          <h1 className="text-display text-5xl text-frost-white sm:text-6xl md:text-7xl">
            Every pack, <br />
            <span className="text-gradient-ice">at its ripest.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-steel-silver">
            Hover any pack to reveal the fresh ingredient inside. On mobile, tap the card.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[68px] z-30 border-y border-white/5 bg-nav-glass py-4">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 no-scrollbar">
          {(["All", ...categories] as const).map((c) => {
            const active = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
                  active
                    ? "border-ice-blue bg-ice-blue text-deep-navy shadow-frost"
                    : "border-white/10 bg-white/5 text-frost-white/80 hover:border-white/30 hover:text-frost-white"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {catalog.isLoading && <p className="col-span-full py-16 text-center text-steel-silver">Loading products...</p>}
              {!catalog.isLoading && catalog.error && <p className="col-span-full py-16 text-center text-red-300">{catalog.error}</p>}
              {!catalog.isLoading && !catalog.error && filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="py-16 text-center text-steel-silver">No products in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}


