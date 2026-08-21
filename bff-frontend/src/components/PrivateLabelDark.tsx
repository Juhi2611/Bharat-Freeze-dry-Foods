import { useRef, useEffect, useState } from 'react';
import {
  Settings2, Package, Factory, Sprout, CheckCircle2, Award, ShieldCheck,
  MessageSquare, Layers, ArrowRight, ChevronDown, Leaf, Apple, UtensilsCrossed,
  PawPrint, Check, Tag, Info, Send
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   DATA (Identical to Light Theme Source of Truth)
───────────────────────────────────────────────────────────────────────── */

const steps = [
  { step: '01', title: 'Product Selection', desc: "Select from our catalog of freeze-dried fruits, vegetables, superfoods, spices, or submit your own custom formulation/recipe.", icon: Settings2, color: '#76caff', tag: 'Catalog or Custom' },
  { step: '02', title: 'Recipe Calibration', desc: "Our food scientists adjust slicing sizes, texture targets, and moisture curves to match your brand's specific requirements.", icon: Layers, color: '#a78bfa', tag: 'Food Science', highlight: true },
  { step: '03', title: 'Sourcing & Processing', desc: "We source peak-season fresh ingredients directly from our contracted farms and process them immediately under strict hygiene.", icon: Sprout, color: '#4ade80', tag: 'Farm Direct' },
  { step: '04', title: 'Lyophilization', desc: "Food is freeze-dried at -40 degrees C in our state-of-the-art chambers, extracting moisture while preserving 97% original nutrition and color.", icon: Factory, color: '#c084fc', tag: '-40C Chamber', highlight: true },
  { step: '05', title: 'Branding & Packing', desc: "Products are packed in our certified facility using your custom stand-up pouches, tins, or bulk packaging with branded labels.", icon: Package, color: '#fb923c', tag: 'Your Brand' },
  { step: '06', title: 'Quality & Clearance', desc: "Every batch undergoes rigorous moisture analysis (below 2%), metal detection, and sorting before receiving export compliance papers.", icon: ShieldCheck, color: '#22d3ee', tag: 'Export Ready', highlight: true },
];

const ingredientCategories = [
  {
    id: 'vegetables',
    label: 'Freeze-Dried Vegetables',
    Icon: Sprout,
    color: '#4ade80',
    desc: 'Core cooking ingredients processed at the source — close to major onion, garlic and potato agri-belts of central India.',
    products: [
      { name: 'Onion Flakes',       image: '/images/vegetables_hero.png' },
      { name: 'Garlic Flakes',      image: '/images/spices_hero.png'     },
      { name: 'Tomato Dices',       image: '/images/organic_vegetables.png' },
      { name: 'Potato Dices',       image: '/images/organic_vegetables.png' },
      { name: 'Green Chilli Flakes',image: '/images/organic_vegetables.png' },
      { name: 'Ginger Powder',      image: '/images/spices_hero.png'     },
    ],
  },
  {
    id: 'garlic',
    label: 'Freeze-Dried Garlic Range',
    Icon: Layers,
    color: '#a3e635',
    desc: 'A dedicated garlic processing line offering six distinct forms — crafted for seasoning manufacturers, soup brands, and food formulators.',
    products: [
      { name: 'Garlic Flakes (Bulk)',    image: '/images/spices_hero.png' },
      { name: 'Garlic Granules',         image: '/images/spices_hero.png' },
      { name: 'Garlic Powder',           image: '/images/spices_hero.png' },
      { name: 'Garlic Paste Powder',     image: '/images/spices_hero.png' },
      { name: 'Roasted Garlic Powder',   image: '/images/spices_hero.png' },
      { name: 'Garlic Seasoning Blend',  image: '/images/spices_hero.png' },
    ],
  },
  {
    id: 'fruits',
    label: 'Freeze-Dried Fruits',
    Icon: Apple,
    color: '#f87171',
    desc: 'Whole, sliced or diced Indian fruits dried at peak ripeness — retaining natural colour, flavour and nutritional profile.',
    products: [
      { name: 'Mango Slices',      image: '/images/fd_mango.png'      },
      { name: 'Jamun (Whole)',     image: '/images/fruits_hero.png'   },
      { name: 'Strawberry Slices', image: '/images/fd_strawberry.png' },
      { name: 'Banana Chips',      image: '/images/fruits_hero.png'   },
      { name: 'Pineapple Tidbits', image: '/images/fruits_hero.png'   },
    ],
  },
  {
    id: 'petfood',
    label: 'Freeze-Dried Pet Food',
    Icon: PawPrint,
    color: '#fb923c',
    desc: 'Pure, single-ingredient plant inputs dried at source. Retains 97% of natural vitamins for premium pet food formulations.',
    products: [
      { name: 'Carrot Bites',       image: '/images/pet_veg_treats.png' },
      { name: 'Sweet Potato Cubes', image: '/images/pet_treats.png'     },
      { name: 'Green Peas',         image: '/images/vegetables_hero.png' },
      { name: 'Pumpkin Flakes',     image: '/images/pet_veg_treats.png' },
      { name: 'Blueberry Bites',    image: '/images/pet_treats.png'     },
      { name: 'Spinach Flakes',     image: '/images/pet_veg_treats.png' },
    ],
  },
  {
    id: 'herbs',
    label: 'Herbs & Functional Ingredients',
    Icon: Leaf,
    color: '#22d3ee',
    desc: 'Nutritionally dense powders and flakes from Indian functional herbs — for nutraceutical, wellness and flavour applications.',
    products: [
      { name: 'Moringa Powder',        image: '/images/superfoods_hero.png' },
      { name: 'Mint Flakes',           image: '/images/superfoods_hero.png' },
      { name: 'Coriander Leaf Powder', image: '/images/superfoods_hero.png' },
      { name: 'Curry Leaf Powder',     image: '/images/superfoods_hero.png' },
    ],
  },
  {
    id: 'horeca',
    label: 'Ready-to-Eat / HoReCa Range',
    Icon: UtensilsCrossed,
    color: '#fdba74',
    desc: 'Complete freeze-dried meal bases and ready-to-eat dishes for hotels, airlines, institutional catering and export meal kits.',
    products: [
      { name: 'Dal Makhni Base',      image: '/images/precooked_hero.png' },
      { name: 'Paneer Makhani Gravy', image: '/images/precooked_hero.png' },
      { name: 'Instant Poha',         image: '/images/precooked_hero.png' },
      { name: 'Instant Upma',         image: '/images/precooked_hero.png' },
      { name: 'Curry Base Mix',       image: '/images/precooked_hero.png' },
      { name: 'Green Chutney',        image: '/images/precooked_hero.png' },
    ],
  },
];

const packagingTypes = [
  {
    id: 'standup',
    type: 'Stand-Up Pouches',
    desc: 'Premium Mylar or Kraft pouches with resealable zippers, hang holes, and custom matte/gloss prints. Perfect for retail snacks.',
    sizes: ['20g', '60g', '100g', '250g'],
    sizeLabel: 'Select Retail Weight',
    icon: Package,
    gradient: 'linear-gradient(135deg, #fb923c, #f97316)',
  },
  {
    id: 'jar',
    type: 'Glass & Plastic Jars',
    desc: 'Sturdy PET or glass jars with induction seal liners and custom labels. Ideal for wellness powders and premium spices.',
    sizes: ['250g', '500g', '1kg'],
    sizeLabel: 'Select Jar Capacity',
    icon: Award,
    gradient: 'linear-gradient(135deg, #c084fc, #a855f7)',
  },
  {
    id: 'bulk',
    type: 'Bulk Catering Bags',
    desc: 'Heavy-duty multi-layer aluminum foil liners inside rigid master cartons. Best for food manufacturers and QSR chains.',
    sizes: ['5kg', '10kg', '25kg'],
    sizeLabel: 'Select Bulk Weight',
    icon: Factory,
    gradient: 'linear-gradient(135deg, #76caff, #38bdf8)',
  },
];

const faqs = [
  { q: 'What is the Minimum Order Quantity (MOQ) for private label?', a: "Our starting MOQ for private label orders is 500 kg per product SKU. This allows us to calibrate our automated packing lines efficiently for your branded run." },
  { q: 'Can you develop a custom formulation or recipe under NDA?', a: "Absolutely. We regularly sign Non-Disclosure Agreements (NDAs) with brands to protect proprietary recipes. Our in-house R&D team can formulate and dry unique blends exclusively for you." },
  { q: 'Do you assist with packaging design and sourcing?', a: "Yes. We offer turnkey solutions where we help source high-barrier print films, design custom label layouts, and procure containers to ensure compliance with export standards." },
  { q: 'What certifications are included with private label products?', a: "All private label batches are processed in our FSSAI, ISO 22000, and HACCP certified facility. We also provide Phytosanitary Certificates and Lab Reports for export compliance." },
];

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS & BRAND OVERLAY (Identical to Light Theme Source of Truth)
───────────────────────────────────────────────────────────────────────── */

function getJarImage(productName: string) {
  const n = productName.toLowerCase();
  if (n.includes('onion'))                         return '/images/onion_jar.png';
  if (n.includes('garlic'))                        return '/images/garlic_jar.png';
  if (n.includes('tomato'))                        return '/images/tomato_jar.png';
  if (n.includes('potato'))                        return '/images/potato_jar.png';
  if (n.includes('green chilli') || n.includes('chilli')) return '/images/green_chilli_flakes_jar.png';
  if (n.includes('ginger'))                        return '/images/ginger_jar.png';
  return '/images/ginger_jar.png';
}

function getPackagingImage(packagingId: string, productName: string) {
  if (packagingId === 'standup') return '/images/standup_pouch.png';
  if (packagingId === 'bulk')    return '/images/bulk.png';
  if (packagingId === 'jar')     return getJarImage(productName);
  return null;
}

const BRAND_POS: Record<string, { top: string; left: string; width: string; height: string; maxFontSize: number }> = {
  standup: { top: '42%', left: '50%', width: '28%', height: '20%', maxFontSize: 64 },
  jar:     { top: '51.5%', left: '50%', width: '36%', height: '14.5%', maxFontSize: 56 },
  bulk:    { top: '58.3%', left: '50%', width: '25%', height: '26%', maxFontSize: 60 },
};

function BrandOverlay({ name, packagingId }: { name: string; packagingId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const pos = BRAND_POS[packagingId] || BRAND_POS.standup;

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const fitText = () => {
      const maxW = container.clientWidth;
      const maxH = container.clientHeight;
      if (!maxW || !maxH) return;

      const upperLimit = pos.maxFontSize || 64;
      let low = 8;
      let high = upperLimit;
      let best = low;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        text.style.fontSize = mid + 'px';

        const sH = text.offsetHeight || text.scrollHeight;
        const sW = text.offsetWidth || text.scrollWidth;

        if (sH <= maxH && sW <= maxW) {
          best = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      text.style.fontSize = best + 'px';
    };

    fitText();
    const observer = new ResizeObserver(fitText);
    observer.observe(container);
    return () => observer.disconnect();
  }, [name, packagingId, pos]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        height: pos.height,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        padding: '2px',
      }}
    >
      <span
        ref={textRef}
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          textAlign: 'center',
          fontWeight: 900,
          color: '#1a1a1a',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          opacity: 0.88,
          wordBreak: 'break-word',
        }}
      >
        {name || 'YOUR BRAND'}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN PRIVATE LABEL COMPONENT (1:1 Code & Logic with Dark UI)
───────────────────────────────────────────────────────────────────────── */

export function PrivateLabelDark() {
  const [previewBrandName, setPreviewBrandName] = useState('');
  const [activeCatIdx, setActiveCatIdx]         = useState(0);
  const [selectedProduct, setSelectedProduct]   = useState<any>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<any>(null);
  const [selectedSize, setSelectedSize]         = useState<any>(null);

  const [activeFaq, setActiveFaq]       = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const packagingSectionRef = useRef<HTMLDivElement>(null);
  const previewSectionRef   = useRef<HTMLDivElement>(null);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setSelectedPackaging(null);
    setSelectedSize(null);
    setTimeout(() => {
      packagingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleSelectPackaging = (pkg: any) => {
    if (selectedPackaging?.id === pkg.id) {
      setSelectedPackaging(null);
      setSelectedSize(null);
    } else {
      setSelectedPackaging(pkg);
      setSelectedSize(null);
    }
  };

  const handleSelectSize = (size: any) => {
    setSelectedSize(size);
    setTimeout(() => {
      previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const activeCategory = ingredientCategories[activeCatIdx];
  const showPreview    = !!(selectedProduct && selectedPackaging && selectedSize);
  const packagingImage = showPreview ? getPackagingImage(selectedPackaging.id, selectedProduct.name) : null;

  return (
    <section className="bg-deep-navy text-frost-white overflow-hidden">

      {/* ─── SECTION 0: BRAND NAME ENTRY ─── */}
      <div className="py-24 border-b border-white/10 bg-background/60 relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ice-blue/30 bg-ice-blue/15 px-4 py-1.5 backdrop-blur-md mb-6">
            <Tag className="h-3.5 w-3.5 text-ice-blue" />
            <span className="text-xs font-bold uppercase tracking-widest text-frost-white">Interactive Brand Builder</span>
          </div>

          <h2 className="text-display text-3xl sm:text-5xl text-frost-white font-black mb-4">
            Custom Product <span className="text-gradient-ice italic font-medium">Configurator.</span>
          </h2>
          <p className="text-steel-silver text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Type your brand name below to see live updates as you build your custom private label product.
          </p>

          <input
            type="text"
            placeholder="Type your brand name (e.g. NATURE CRAFT)"
            value={previewBrandName}
            onChange={(e) => setPreviewBrandName(e.target.value)}
            className="w-full max-w-lg rounded-2xl border border-white/20 bg-card/80 px-6 py-4 text-center font-bold text-lg text-frost-white outline-none focus:border-ice-blue focus:ring-2 focus:ring-ice-blue/20"
          />
        </div>
      </div>

      {/* ─── SECTION 1: INGREDIENT CATALOG ─── */}
      <div className="py-20 md:py-28 border-b border-white/10 bg-deep-navy">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="text-eyebrow mb-3">Step 1 of 3 — Product Selection</p>
            <h2 className="text-display text-3xl sm:text-5xl text-frost-white">
              Choose Your <span className="text-gradient-ice italic font-medium">Ingredient Base.</span>
            </h2>
            <p className="mt-3 text-steel-silver text-sm sm:text-base max-w-xl mx-auto">
              Select an ingredient from our catalog below to configure your private label run.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start lg:justify-center">
            {ingredientCategories.map((cat, idx) => {
              const Icon = cat.Icon;
              const active = activeCatIdx === idx;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCatIdx(idx)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                    active
                      ? 'border-ice-blue bg-ice-blue text-deep-navy shadow-frost'
                      : 'border-white/10 bg-white/5 text-steel-silver hover:border-white/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategory.products.map((prod, idx) => {
              const isSelected = selectedProduct?.name === prod.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectProduct(prod)}
                  className={`group relative overflow-hidden rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'border-ice-blue bg-ice-blue/15 shadow-frost' : 'border-white/10 bg-card/60 hover:border-white/30'
                  }`}
                >
                  <div className="relative h-44 w-full overflow-hidden rounded-xl bg-black/40 mb-4">
                    <img src={prod.image} alt={prod.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="text-lg font-bold text-frost-white mb-1">{prod.name}</h3>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-ice-blue' : 'text-steel-silver'}`}>
                    {isSelected ? <><Check className="h-4 w-4" /> Selected</> : 'Select Product →'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: PACKAGING FORMAT ─── */}
      <div ref={packagingSectionRef} className="py-20 md:py-28 border-b border-white/10 bg-background/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="text-eyebrow mb-3">Step 2 of 3 — Packaging Format</p>
            <h2 className="text-display text-3xl sm:text-5xl text-frost-white">
              Choose Packaging &amp; <span className="text-gradient-ice italic font-medium">Weight Target.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packagingTypes.map((pkg) => {
              const Icon = pkg.icon;
              const isPkgSelected = selectedPackaging?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl border p-8 transition-all duration-300 ${
                    isPkgSelected ? 'border-ice-blue bg-card/90 shadow-frost' : 'border-white/10 bg-card/50'
                  }`}
                >
                  <button
                    onClick={() => handleSelectPackaging(pkg)}
                    className="w-full text-left"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ice-blue/15 text-ice-blue border border-ice-blue/30">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-frost-white mb-2">{pkg.type}</h3>
                    <p className="text-xs text-steel-silver leading-relaxed mb-6">{pkg.desc}</p>
                  </button>

                  {/* Weight Buttons */}
                  {isPkgSelected && (
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs font-bold uppercase tracking-widest text-ice-blue mb-3">{pkg.sizeLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {pkg.sizes.map((sz) => {
                          const isSizeSelected = selectedSize === sz;
                          return (
                            <button
                              key={sz}
                              onClick={() => handleSelectSize(sz)}
                              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                                isSizeSelected
                                  ? 'bg-ice-blue text-deep-navy font-black shadow-frost'
                                  : 'bg-white/10 text-frost-white hover:bg-white/20'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: LIVE PREVIEW & SPECIFICATION SUMMARY ─── */}
      <div ref={previewSectionRef} className="py-20 md:py-28 border-b border-white/10 bg-deep-navy">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="text-eyebrow mb-3">Step 3 of 3 — Product Spec Sheet</p>
            <h2 className="text-display text-3xl sm:text-5xl text-frost-white">
              Live Mockup &amp; <span className="text-gradient-ice italic font-medium">Specification.</span>
            </h2>
          </div>

          {showPreview ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center rounded-3xl border border-white/15 bg-card/80 p-8 md:p-12">
              {/* Packaging Image with Brand Overlay */}
              <div className="relative mx-auto w-full max-w-md aspect-square overflow-hidden rounded-2xl bg-black/40 p-6 flex items-center justify-center">
                {packagingImage && (
                  <div className="relative w-full h-full">
                    <img src={packagingImage} alt="Packaging Preview" className="h-full w-full object-contain" />
                    <BrandOverlay name={previewBrandName} packagingId={selectedPackaging.id} />
                  </div>
                )}
              </div>

              {/* Spec Sheet Summary */}
              <div>
                <span className="inline-block rounded-full bg-ice-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-ice-blue border border-ice-blue/30 mb-4">
                  Turnkey Product Spec
                </span>
                <h3 className="text-3xl font-bold text-frost-white mb-6">
                  {previewBrandName || 'YOUR BRAND'} — {selectedProduct.name}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                    <span className="text-steel-silver uppercase font-bold text-xs tracking-wider">Product Base</span>
                    <span className="font-bold text-frost-white">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                    <span className="text-steel-silver uppercase font-bold text-xs tracking-wider">Packaging Format</span>
                    <span className="font-bold text-frost-white">{selectedPackaging.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                    <span className="text-steel-silver uppercase font-bold text-xs tracking-wider">Net Weight</span>
                    <span className="font-bold text-frost-white">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                    <span className="text-steel-silver uppercase font-bold text-xs tracking-wider">Standard MOQ</span>
                    <span className="font-bold text-ice-blue">500 kg</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
                    <span className="text-steel-silver uppercase font-bold text-xs tracking-wider">Shelf Life</span>
                    <span className="font-bold text-frost-white">24 Months Ambient</span>
                  </div>
                </div>

                <a href="#sample-form" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-frost">
                  Request Sample Pack <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 bg-card/30 p-12 text-center max-w-2xl mx-auto">
              <Info className="h-10 w-10 text-ice-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold text-frost-white mb-2">Complete Selection to View Mockup</h3>
              <p className="text-sm text-steel-silver">
                Please select an ingredient base above, choose your packaging format, and click a weight target to generate your live product mockup spec sheet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── 6-STEP MANUFACTURING JOURNEY ─── */}
      <div className="py-20 md:py-28 border-b border-white/10 bg-background/60">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="text-eyebrow mb-3">Turnkey Manufacturing</p>
            <h2 className="text-display text-3xl sm:text-5xl text-frost-white">
              6-Step OEM <span className="text-gradient-ice italic font-medium">Process.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="rounded-2xl border border-white/10 bg-card/60 p-7">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ice-blue/15 text-ice-blue border border-ice-blue/30">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-white/20">{st.step}</span>
                  </div>
                  <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-ice-blue mb-3">
                    {st.tag}
                  </span>
                  <h3 className="text-lg font-bold text-frost-white mb-2">{st.title}</h3>
                  <p className="text-xs text-steel-silver leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── FAQ ACCORDION ─── */}
      <div className="py-20 md:py-28 border-b border-white/10 bg-deep-navy">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="text-eyebrow mb-3">Frequently Asked Questions</p>
            <h2 className="text-display text-3xl sm:text-5xl text-frost-white">
              Private Label <span className="text-gradient-ice italic font-medium">FAQs.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-card/60 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-frost-white text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-ice-blue transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-steel-silver leading-relaxed border-t border-white/10 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SAMPLE REQUEST FORM ─── */}
      <div id="sample-form" className="py-20 md:py-28 bg-background/60">
        <div className="mx-auto max-w-2xl px-4 md:px-6 text-center">
          <p className="text-eyebrow mb-3">Get Started</p>
          <h2 className="text-display text-3xl sm:text-5xl text-frost-white mb-4">
            Request Private Label <span className="text-gradient-ice italic font-medium">Sample Kit.</span>
          </h2>
          <p className="text-steel-silver text-sm mb-8">
            Tell us about your brand and our OEM specialists will send sample pouches and specification datasheets.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }} className="rounded-3xl border border-white/10 bg-card/80 p-8 space-y-4 text-left">
            {formSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-frost-white mb-2">Sample Request Submitted!</h3>
                <p className="text-sm text-steel-silver">Our OEM team will reach out to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-frost-white mb-2">Brand / Company Name *</label>
                  <input required placeholder="Your Brand Ltd." className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-frost-white outline-none focus:border-ice-blue" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-frost-white mb-2">WhatsApp / Phone *</label>
                  <input required placeholder="+1 555 000 1234" className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-frost-white outline-none focus:border-ice-blue" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-frost-white mb-2">Specific Requirements</label>
                  <textarea rows={3} placeholder="Tell us which products and sizes you are interested in..." className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-frost-white outline-none focus:border-ice-blue" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-gradient-primary-cta py-4 text-xs font-bold uppercase tracking-widest text-white shadow-frost">
                  Submit Sample Request
                </button>
              </>
            )}
          </form>
        </div>
      </div>

    </section>
  );
}
