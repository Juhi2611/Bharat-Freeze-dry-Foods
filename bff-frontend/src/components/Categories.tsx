import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useCatalogData } from "@/hooks/useCatalogData";
import { PawPrint, Leaf } from "lucide-react";

export function Categories() {
  const { products, categories, isLoading, error } = useCatalogData();
  const liveCategories = categories.map((category) => ({
    name: category.name,
    key: category.name,
    accent: products.find((product) => product.category === category.name)?.accent || "#76CAFF",
    sample: products.find((product) => product.category === category.name),
    pet: category.name.toLowerCase() === "pet food",
  }));

  return (
    <section className="relative bg-background py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 md:mb-16 flex flex-col sm:flex-row flex-wrap items-start sm:items-end justify-between gap-6 sm:gap-8">
          <div>
            <p className="text-eyebrow mb-4">The category showcase</p>
            <h2 className="text-display max-w-2xl text-3xl text-frost-white sm:text-4xl md:text-6xl">
              Every category, <br />
              <span className="text-gradient-ice">frozen at the peak.</span>
            </h2>
          </div>
          <Link
            to="/products"
            search={{ category: undefined }}
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-ice-blue hover:underline"
          >
            View all products →
          </Link>
        </div>

        {isLoading && <p className="py-12 text-center text-steel-silver">Loading categories...</p>}
        {error && <p className="py-12 text-center text-red-300">{error}</p>}
        {!isLoading && !error && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liveCategories.map((c, i) => {
            const sample = c.sample;
            const isPet = c.pet;
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`${
                  c.key === "Fruits" || c.key === "Superfoods" ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <Link
                  to={isPet ? "/pet-foods" : "/products"}
                  search={isPet ? undefined : { category: c.key }}
                  className={`group relative block h-full min-h-[280px] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/8 md:min-h-[320px] ${
                    isPet ? "bg-gradient-to-br from-[#D97B3D]/25 to-deep-navy" : "bg-card"
                  }`}
                >
                  {sample && (
                    <img
                      src={sample.packImage}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/70 to-transparent" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at 50% 100%, ${c.accent}30, transparent 60%)`,
                    }}
                  />
                  <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {c.organic && (
                        <span className="flex items-center gap-1 rounded-full bg-forest-green/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-frost-white">
                          <Leaf className="h-2.5 w-2.5" /> Organic line
                        </span>
                      )}
                      {c.superfood && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-frost-white">
                          Sub-brand
                        </span>
                      )}
                      {c.pet && (
                        <span className="flex items-center gap-1 rounded-full bg-spice-orange/25 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-spice-orange">
                          <PawPrint className="h-2.5 w-2.5 transition-transform group-hover:animate-wag" />
                          For pets
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-frost-white sm:text-2xl md:text-3xl">
                      {c.name}
                    </h3>
                    <span
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ice-blue group-hover:underline"
                      style={{ color: c.accent }}
                    >
                      Browse →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>}
      </div>
    </section>
  );
}


