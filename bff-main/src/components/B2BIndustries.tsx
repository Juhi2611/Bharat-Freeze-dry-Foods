import { motion } from "framer-motion";
import {
  Factory,
  Utensils,
  Zap,
  ShoppingBag,
  Tag,
  Ship,
  Shield,
  HeartHandshake,
  Plane,
  Activity,
  PawPrint,
  Compass,
} from "lucide-react";

interface IndustryItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  accent: string;
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: "food-manufacturers",
    name: "Food Manufacturers",
    description: "Premium freeze-dried fruit powders, dice & cuts for bakery, cereal, confectionery & dairy formulations.",
    icon: Factory,
    accent: "#4FA8D8",
  },
  {
    id: "hotels-restaurants",
    name: "Hotels & Restaurants",
    description: "Chef-grade shelf-stable produce, curry bases & instant rehydration ingredients for high-volume kitchens.",
    icon: Utensils,
    accent: "#E1832E",
  },
  {
    id: "qsr",
    name: "Quick Service Restaurants",
    description: "Ready-to-use gravy bases & real fruit crunches ensuring fast, consistent menu execution across outlets.",
    icon: Zap,
    accent: "#E1B84A",
  },
  {
    id: "retail-supermarkets",
    name: "Retail & Supermarkets",
    description: "Consumer-packaged freeze-dried fruit snacks & pantry staples preserved at peak nutrition.",
    icon: ShoppingBag,
    accent: "#5FA755",
  },
  {
    id: "private-label",
    name: "Private Label Brands",
    description: "End-to-end turnkey contract manufacturing, custom pouch printing & formulation development.",
    icon: Tag,
    accent: "#D19A2E",
  },
  {
    id: "export-distributors",
    name: "Export Distributors",
    description: "Full container-load (FCL) shipments with complete export documentation, phytosanitary & HACCP compliance.",
    icon: Ship,
    accent: "#4FA8D8",
  },
  {
    id: "military-defence",
    name: "Military & Defence Food Supply",
    description: "Lightweight, high-calorie field rations with 25-year shelf life for defence & tactical operations.",
    icon: Shield,
    accent: "#C33B2E",
  },
  {
    id: "emergency-relief",
    name: "Emergency Relief & Disaster Food",
    description: "Nutrient-dense instant meal packs designed for immediate deployment in humanitarian relief.",
    icon: HeartHandshake,
    accent: "#8ABB4A",
  },
  {
    id: "travel-aviation",
    name: "Travel & Aviation Catering",
    description: "Weight-optimized, flight-ready gourmet snack packs & instant meals for airlines & cruise liners.",
    icon: Plane,
    accent: "#E1832E",
  },
  {
    id: "health-wellness",
    name: "Health & Wellness Brands",
    description: "Organic superfood powders like Moringa, Turmeric & Blueberry extracts for dietary supplements.",
    icon: Activity,
    accent: "#5FA755",
  },
  {
    id: "pet-food",
    name: "Pet Food Manufacturers",
    description: "High-protein freeze-dried chicken, liver, & salmon ingredients for premium pet treats & toppers.",
    icon: PawPrint,
    accent: "#D97B3D",
  },
  {
    id: "outdoor-adventure",
    name: "Outdoor & Adventure Food",
    description: "Ultralight, calorie-dense freeze-dried meals for mountaineering, trekking & expedition gear brands.",
    icon: Compass,
    accent: "#4FA8D8",
  },
];

export function B2BIndustries() {
  return (
    <section id="industries" className="relative border-t border-white/5 bg-deep-navy/80 py-20 md:py-32">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-ice-blue/5 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-14 text-center md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eyebrow mb-3"
          >
            Diverse Applications
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-display text-3xl text-frost-white sm:text-5xl md:text-6xl"
          >
            The Industries <span className="text-gradient-ice">We Serve</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-steel-silver"
          >
            Supplying premium freeze-dried food solutions across diverse industries worldwide.
          </motion.p>
        </div>

        {/* Industries Animated Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-card/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-ice-blue/40 hover:bg-card/90"
              >
                {/* Subtle radial glow overlay on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${ind.accent}25, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundColor: `${ind.accent}18`,
                      color: ind.accent,
                      border: `1px solid ${ind.accent}30`,
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-frost-white transition-colors group-hover:text-ice-blue">
                    {ind.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-steel-silver">
                    {ind.description}
                  </p>
                </div>

                {/* Bottom subtle accent line on hover */}
                <div
                  className="relative z-10 mt-6 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: ind.accent }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
