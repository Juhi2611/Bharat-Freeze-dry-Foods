import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { FrostParticles } from "@/components/FrostParticles";

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
  const navigate = useNavigate({ from: "/products" });
  const { category } = Route.useSearch();

  const rawCategory =
    typeof category === "string"
      ? category.replace(/\+/g, " ")
      : undefined;

  const activeCategory: Category | "All" =
    rawCategory && CATEGORIES.includes(rawCategory as Category)
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
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

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
          {(["All", ...CATEGORIES] as const).map((c) => {
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
              {filtered.map((p) => (
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


