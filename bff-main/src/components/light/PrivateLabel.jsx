import { useRef, useEffect, useState } from 'react';
import {
  Settings2, Package, Factory, Sprout, CheckCircle2, Award, ShieldCheck,
  MessageSquare, Layers, ArrowRight, ChevronDown, Leaf, Apple, UtensilsCrossed,
  PawPrint, Check,
} from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────── */

const steps = [
  { step: '01', title: 'Product Selection', desc: "Select from our catalog of freeze-dried fruits, vegetables, superfoods, spices, or submit your own custom formulation/recipe.", icon: Settings2, color: '#2D7A3A', tag: 'Catalog or Custom' },
  { step: '02', title: 'Recipe Calibration', desc: "Our food scientists adjust slicing sizes, texture targets, and moisture curves to match your brand's specific requirements.", icon: Layers, color: '#1565C0', tag: 'Food Science', highlight: true },
  { step: '03', title: 'Sourcing & Processing', desc: "We source peak-season fresh ingredients directly from our contracted farms and process them immediately under strict hygiene.", icon: Sprout, color: '#2D7A3A', tag: 'Farm Direct' },
  { step: '04', title: 'Lyophilization', desc: "Food is freeze-dried at -40 degrees C in our state-of-the-art chambers, extracting moisture while preserving 97% original nutrition and color.", icon: Factory, color: '#6A1B9A', tag: '-40C Chamber', highlight: true },
  { step: '05', title: 'Branding & Packing', desc: "Products are packed in our certified facility using your custom stand-up pouches, tins, or bulk packaging with branded labels.", icon: Package, color: '#E65100', tag: 'Your Brand' },
  { step: '06', title: 'Quality & Clearance', desc: "Every batch undergoes rigorous moisture analysis (below 2%), metal detection, and sorting before receiving export compliance papers.", icon: ShieldCheck, color: '#00838F', tag: 'Export Ready', highlight: true },
];

const ingredientCategories = [
  {
    id: 'vegetables',
    label: 'Freeze-Dried Vegetables',
    Icon: Sprout,
    color: '#2D7A3A',
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
    color: '#558B2F',
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
    color: '#E53935',
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
    color: '#8D6E63',
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
    color: '#00838F',
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
    color: '#E65100',
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
    gradient: 'linear-gradient(135deg, #E65100, #FF8A65)',
  },
  {
    id: 'jar',
    type: 'Glass & Plastic Jars',
    desc: 'Sturdy PET or glass jars with induction seal liners and custom labels. Ideal for wellness powders and premium spices.',
    sizes: ['250g', '500g', '1kg'],
    sizeLabel: 'Select Jar Capacity',
    icon: Award,
    gradient: 'linear-gradient(135deg, #6A1B9A, #AB47BC)',
  },
  {
    id: 'bulk',
    type: 'Bulk Catering Bags',
    desc: 'Heavy-duty multi-layer aluminum foil liners inside rigid master cartons. Best for food manufacturers and QSR chains.',
    sizes: ['5kg', '10kg', '25kg'],
    sizeLabel: 'Select Bulk Weight',
    icon: Factory,
    gradient: 'linear-gradient(135deg, #1565C0, #42A5F5)',
  },
];

const faqs = [
  { q: 'What is the Minimum Order Quantity (MOQ) for private label?', a: "Our starting MOQ for private label orders is 500 kg per product SKU. This allows us to calibrate our automated packing lines efficiently for your branded run." },
  { q: 'Can you develop a custom formulation or recipe under NDA?', a: "Absolutely. We regularly sign Non-Disclosure Agreements (NDAs) with brands to protect proprietary recipes. Our in-house R&D team can formulate and dry unique blends exclusively for you." },
  { q: 'Do you assist with packaging design and sourcing?', a: "Yes. We offer turnkey solutions where we help source high-barrier print films, design custom label layouts, and procure containers to ensure compliance with export standards." },
  { q: 'What certifications are included with private label products?', a: "All private label batches are processed in our FSSAI, ISO 22000, and HACCP certified facility. We also provide Phytosanitary Certificates and Lab Reports for export compliance." },
];

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS — packaging image & brand name overlay position
───────────────────────────────────────────────────────────────────────── */

function getJarImage(productName) {
  const n = productName.toLowerCase();
  if (n.includes('onion'))                         return '/images/onion_jar.png';
  if (n.includes('garlic'))                        return '/images/garlic_jar.png';
  if (n.includes('tomato'))                        return '/images/tomato_jar.png';
  if (n.includes('potato'))                        return '/images/potato_jar.png';
  if (n.includes('green chilli') || n.includes('chilli')) return '/images/green_chilli_flakes_jar.png';
  if (n.includes('ginger'))                        return '/images/ginger_jar.png';
  return '/images/ginger_jar.png'; // default for all other products
}

function getPackagingImage(packagingId, productName) {
  if (packagingId === 'standup') return '/images/standup_pouch.png';
  if (packagingId === 'bulk')    return '/images/bulk.png';
  if (packagingId === 'jar')     return getJarImage(productName);
  return null;
}

/*
  Brand name overlay positions (percentage of mockup image dimensions).
  Analysed from actual image assets:
    - standup: white pouch face center at top:42%, left:50%, usable box width:32%, height:22%
    - jar:     white label band center at top:51.5%, left:50%, usable box width:38%, height:15.5%
    - bulk:    white sticker label center at top:51.5%, left:50%, usable box width:34%, height:24%
*/
const BRAND_POS = {
  standup: { top: '42%', left: '50%', width: '28%', height: '20%', maxFontSize: 64 },
  jar:     { top: '51.5%', left: '50%', width: '36%', height: '14.5%', maxFontSize: 56 },
  bulk:    { top: '58.3%', left: '50%', width: '25%', height: '26%', maxFontSize: 60 },
};

/* ─────────────────────────────────────────────────────────────────────────
   BrandOverlay — Dynamic Container-Bounded Auto-Fit Overlay.
   Uses exact percentage boundaries of the packaging label area.
   Binary searches for the maximum font size (up to maxFontSize) where
   scrollHeight & scrollWidth fit inside the label container without overflow.
───────────────────────────────────────────────────────────────────────── */
function BrandOverlay({ name, packagingId }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

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

      // Binary search for maximum font size where text dimensions fit within container
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        text.style.fontSize = mid + 'px';
        text.style.letterSpacing = mid < 12 ? '0.01em' : mid < 20 ? '0.03em' : '0.05em';

        // Measure actual rendered text width & height
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
      text.style.letterSpacing = best < 12 ? '0.01em' : best < 20 ? '0.03em' : '0.05em';
    };

    fitText();

    const observer = new ResizeObserver(() => {
      fitText();
    });
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
        userSelect: 'none',
        boxSizing: 'border-box',
        padding: '2px',
      }}
    >
      <span
        ref={textRef}
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          textAlign: 'center',
          fontFamily: '"Montserrat", "Inter", var(--font-display), sans-serif',
          fontWeight: 900,
          color: '#1a1a1a',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          opacity: 0.88,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
        }}
      >
        {name || 'YOUR BRAND'}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────── */

export default function PrivateLabel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Luxury Dark & Nature Light Theme Tokens ─────────────────────────
  const t = isDark ? {
    pageBg: '#060b14',
    pageBgAlt: '#080f1c',
    heroBg: 'linear-gradient(135deg, #060b14 0%, #0a1324 50%, #070d18 100%)',
    cardBg: '#0a111f',
    cardBgActive: '#0d1726',
    cardBgSubtle: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBorderHover: 'rgba(79, 168, 216, 0.3)',
    cardBorderActive: '#4FA8D8',
    textTitle: '#f0f4ff',
    textSub: 'rgba(255, 255, 255, 0.65)',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    accent: '#4FA8D8',
    accentBright: '#76CAFF',
    accentDark: '#1565C0',
    accentGlow: 'rgba(79, 168, 216, 0.15)',
    accentGradient: 'linear-gradient(135deg, #1565C0 0%, #4FA8D8 100%)',
    textGradient: 'linear-gradient(135deg, #76CAFF 0%, #EAF6FB 100%)',
    btnShadow: '0 8px 24px rgba(21, 101, 192, 0.4)',
    pillBg: 'rgba(79, 168, 216, 0.12)',
    pillBorder: 'rgba(79, 168, 216, 0.28)',
    pillColor: '#76CAFF',
    inputBg: 'rgba(255, 255, 255, 0.06)',
    inputBorder: 'rgba(255, 255, 255, 0.12)',
    inputFocusBorder: '#4FA8D8',
    inputText: '#f0f4ff',
    selectBg: '#0d1726',
    sizeBtnBg: 'rgba(255, 255, 255, 0.06)',
    sizeBtnBorder: 'rgba(255, 255, 255, 0.14)',
    sizeBtnText: '#f0f4ff',
    sizeBtnActiveBg: 'linear-gradient(135deg, #1565C0, #4FA8D8)',
    sizeBtnActiveText: '#ffffff',
    timelineCardBg: '#0a111f',
    timelineBorder: 'rgba(255, 255, 255, 0.08)',
    timelineLine: 'linear-gradient(to bottom, #1565C0, #4FA8D8, rgba(79,168,216,0.1))',
    fontDisplay: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
    fontBody: "'Outfit', 'Inter', sans-serif",
  } : {
    pageBg: 'var(--white)',
    pageBgAlt: 'var(--light-grey)',
    heroBg: 'linear-gradient(135deg, #0A1A0A 0%, #0D2314 50%, #081A0C 100%)',
    cardBg: 'var(--white)',
    cardBgActive: '#ffffff',
    cardBgSubtle: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'var(--border-light)',
    cardBorderHover: 'rgba(45, 122, 58, 0.3)',
    cardBorderActive: 'var(--green)',
    textTitle: 'var(--text-dark)',
    textSub: 'var(--text-body)',
    textMuted: 'var(--text-muted)',
    accent: 'var(--green)',
    accentBright: 'var(--lime)',
    accentDark: '#1A5C2A',
    accentGlow: 'rgba(45, 122, 58, 0.15)',
    accentGradient: 'linear-gradient(135deg, var(--green), var(--lime))',
    textGradient: 'linear-gradient(135deg, #2D7A3A 0%, #8BC34A 100%)',
    btnShadow: '0 8px 24px rgba(45, 122, 58, 0.35)',
    pillBg: 'rgba(45, 122, 58, 0.08)',
    pillBorder: 'rgba(45, 122, 58, 0.2)',
    pillColor: 'var(--green)',
    inputBg: 'white',
    inputBorder: 'var(--border-light)',
    inputFocusBorder: 'var(--green)',
    inputText: 'var(--text-dark)',
    selectBg: 'white',
    sizeBtnBg: 'white',
    sizeBtnBorder: 'rgba(45,122,58,0.3)',
    sizeBtnText: 'var(--text-dark)',
    sizeBtnActiveBg: 'var(--green)',
    sizeBtnActiveText: 'white',
    timelineCardBg: 'white',
    timelineBorder: 'var(--border-light)',
    timelineLine: 'linear-gradient(to bottom, var(--green), var(--lime), rgba(139,195,74,0.1))',
    fontDisplay: "'Plus Jakarta Sans', sans-serif",
    fontBody: "'Outfit', sans-serif",
  };

  // ── Configurator state ──────────────────────────────────────────────
  const [previewBrandName, setPreviewBrandName] = useState('');
  const [activeCatIdx, setActiveCatIdx]         = useState(0);
  const [selectedProduct, setSelectedProduct]   = useState(null);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  const [selectedSize, setSelectedSize]         = useState(null);

  // ── UI state ────────────────────────────────────────────────────────
  const [activeFaq, setActiveFaq]       = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(new Set());

  // ── Inquiry form state ──────────────────────────────────────────────
  const [formBrandName, setFormBrandName] = useState('');
  const [interest, setInterest]           = useState('Fruits');
  const [whatsapp, setWhatsapp]           = useState('');

  // ── Refs ────────────────────────────────────────────────────────────
  const packagingSectionRef = useRef(null);
  const previewSectionRef   = useRef(null);
  const pkgGridRef          = useRef(null);
  const faqRef              = useRef(null);
  const timelineSectionRef  = useRef(null);
  const timelineListRef     = useRef(null);
  const videoRef            = useRef(null);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedPackaging(null);
    setSelectedSize(null);
    setTimeout(() => {
      packagingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleSelectPackaging = (pkg) => {
    if (selectedPackaging?.id === pkg.id) {
      setSelectedPackaging(null);
      setSelectedSize(null);
    } else {
      setSelectedPackaging(pkg);
      setSelectedSize(null);
    }
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setTimeout(() => {
      previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  // ── Timeline IntersectionObserver ───────────────────────────────────
  useEffect(() => {
    const stepEls = timelineListRef.current?.querySelectorAll('[data-step]');
    if (!stepEls?.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSteps((prev) => new Set(prev).add(Number(entry.target.getAttribute('data-step'))));
        }
      });
    }, { threshold: 0.15 });
    stepEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Video scroll scrub ──────────────────────────────────────────────
  useEffect(() => {
    const video   = videoRef.current;
    const section = timelineSectionRef.current;
    if (!video || !section) return;
    let scrubTrigger, rafId;
    let targetTime = 0, currentTime = 0;
    const setupScrub = () => {
      video.pause();
      scrubTrigger = ScrollTrigger.create({
        trigger: section, start: 'top bottom', end: 'bottom top',
        invalidateOnRefresh: true,
        onUpdate: (self) => { if (video.duration) targetTime = self.progress * video.duration; },
      });
      const tick = () => {
        currentTime += (targetTime - currentTime) * 0.12;
        if (Math.abs(currentTime - video.currentTime) > 0.01) video.currentTime = currentTime;
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };
    if (video.readyState >= 1) setupScrub();
    else video.addEventListener('loadedmetadata', setupScrub);
    return () => {
      video.removeEventListener('loadedmetadata', setupScrub);
      if (scrubTrigger) scrubTrigger.kill();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── GSAP scroll reveals ─────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (faqRef.current) {
        gsap.fromTo(faqRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: faqRef.current, start: 'top 85%', toggleActions: 'play none none none' } }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // ── Derived ─────────────────────────────────────────────────────────
  const activeCategory = ingredientCategories[activeCatIdx];
  const showPreview    = !!(selectedProduct && selectedPackaging && selectedSize);
  const packagingImage = showPreview ? getPackagingImage(selectedPackaging.id, selectedProduct.name) : null;
  const brandPos       = selectedPackaging ? BRAND_POS[selectedPackaging.id] : null;

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════ */
  return (
    <section
      id="journey"
      style={{
        background: t.pageBg,
        overflow: 'hidden',
        fontFamily: t.fontBody,
      }}
    >
      <div style={{ height: '40px', background: t.pageBg }} />

      {/* ════════════════════════════════════════════════════════════
          SECTION 0 — BRAND NAME ENTRY
         ════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: '100px 0 85px',
        background: t.heroBg,
        borderBottom: isDark ? '1px solid rgba(79,168,216,0.15)' : '1px solid rgba(139,195,74,0.12)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-30%', left: '-5%',
          width: '500px', height: '500px',
          background: isDark
            ? 'radial-gradient(circle, rgba(79,168,216,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,195,74,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '5%',
          width: '400px', height: '400px',
          background: isDark
            ? 'radial-gradient(circle, rgba(21,101,192,0.10) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(45,122,58,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Step badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '6px 18px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '9999px', marginBottom: '24px',
            }}>
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '10px', color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 01</span>
              <span style={{ width: '1px', height: '12px', background: t.pillBorder }} />
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brand Identity</span>
            </div>

            <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#ffffff', marginBottom: '14px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              What&apos;s Your{' '}
              <span style={isDark ? { background: t.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}} className={isDark ? '' : 'gradient-text-green'}>Brand Name?</span>
            </h2>
            <p style={{ fontFamily: t.fontBody, fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)', maxWidth: '460px', margin: '0 auto 36px', lineHeight: 1.6 }}>
              Enter your brand name. It will appear live on the packaging preview below.
            </p>

            {/* Input row */}
            <div style={{ display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="e.g. Alpine Harvest"
                value={previewBrandName}
                onChange={(e) => setPreviewBrandName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && previewBrandName.trim()) {
                    document.getElementById('choose-ingredients')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  flex: 1, padding: '16px 20px',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.07)',
                  border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '16px',
                  color: 'white', outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = t.accent;
                  e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`;
                  e.target.style.background = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.07)';
                }}
              />
              <button
                onClick={() => {
                  if (previewBrandName.trim()) {
                    document.getElementById('choose-ingredients')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  padding: '16px 28px',
                  background: previewBrandName.trim() ? t.accentGradient : 'rgba(255,255,255,0.08)',
                  color: previewBrandName.trim() ? 'white' : 'rgba(255,255,255,0.35)',
                  borderRadius: '12px', border: 'none',
                  fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '14px',
                  cursor: previewBrandName.trim() ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
                  boxShadow: previewBrandName.trim() ? t.btnShadow : 'none',
                }}
              >
                Let&apos;s Go <ArrowRight size={16} />
              </button>
            </div>

            {/* Live name hint */}
            {previewBrandName.trim() && (
              <p style={{
                fontFamily: t.fontBody, fontSize: '12px',
                color: t.pillColor, marginTop: '16px',
                transition: 'all 0.3s ease',
              }}>
                ✦ &quot;<strong style={{ color: t.accentBright }}>{previewBrandName}</strong>&quot; will appear on your packaging preview
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — CHOOSE YOUR INGREDIENTS
         ════════════════════════════════════════════════════════════ */}
      <div
        id="choose-ingredients"
        style={{
          padding: '100px 0',
          background: isDark ? 'linear-gradient(135deg, #060b14 0%, #091222 50%, #060a12 100%)' : 'linear-gradient(135deg, #0A1A0A 0%, #0D2314 50%, #081A0C 100%)',
          borderBottom: isDark ? '1px solid rgba(79,168,216,0.15)' : '1px solid rgba(139,195,74,0.15)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: '-30%', right: '-10%',
          width: '600px', height: '600px',
          background: isDark
            ? 'radial-gradient(circle, rgba(79,168,216,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,195,74,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '6px 18px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '9999px', marginBottom: '20px',
            }}>
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '10px', color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 02</span>
              <span style={{ width: '1px', height: '12px', background: t.pillBorder }} />
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Catalog Options</span>
            </div>
            <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Choose Your{' '}
              <span style={isDark ? { background: t.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}} className={isDark ? '' : 'gradient-text-green'}>Ingredients.</span>
            </h2>
            <p style={{ fontFamily: t.fontBody, fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '16px auto 0', lineHeight: 1.6 }}>
              Pick a category on the left, then select your specific product from the grid.
            </p>
          </div>

          {/* Two-panel layout */}
          <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* ── Left: Category tabs ── */}
            <div style={{ flex: '0 0 268px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ingredientCategories.map((cat, idx) => {
                const CatIcon = cat.Icon;
                const active  = activeCatIdx === idx;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCatIdx(idx)}
                    style={{
                      padding: '16px 18px',
                      textAlign: 'left',
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: active ? cat.color + '70' : 'rgba(255,255,255,0.08)',
                      background: active
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))'
                        : 'rgba(255,255,255,0.02)',
                      backdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                      position: 'relative', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', gap: '14px',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }
                    }}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
                        background: 'linear-gradient(to bottom, ' + cat.color + ', ' + cat.color + '55)',
                        borderRadius: '4px 0 0 4px',
                      }} />
                    )}

                    {/* Icon bubble */}
                    <div style={{
                      width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
                      background: active ? cat.color + '22' : 'rgba(255,255,255,0.06)',
                      border: active ? '1px solid ' + cat.color + '45' : '1px solid rgba(255,255,255,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}>
                      <CatIcon size={15} color={active ? cat.color : 'rgba(255,255,255,0.38)'} />
                    </div>

                    <span style={{
                      fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '12.5px',
                      color: active ? 'white' : 'rgba(255,255,255,0.45)',
                      transition: 'color 0.3s ease', lineHeight: 1.35,
                    }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Right: Product grid (2 columns) ── */}
            <div style={{ flex: '1 1 380px', minWidth: 0 }}>
              {/* Category description pill */}
              <div style={{
                padding: '14px 18px',
                background: isDark ? 'rgba(79,168,216,0.08)' : 'rgba(139,195,74,0.06)',
                border: `1px solid ${isDark ? 'rgba(79,168,216,0.2)' : 'rgba(139,195,74,0.14)'}`,
                borderRadius: '12px', marginBottom: '20px',
              }}>
                <p style={{
                  fontFamily: t.fontBody, fontSize: '13px',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0,
                }}>
                  <span style={{ color: t.accentBright, fontWeight: 700 }}>{activeCategory.label}</span>
                  {' — '}{activeCategory.desc}
                </p>
              </div>

              {/* Product cards — 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {activeCategory.products.map((product, pidx) => {
                  const isSel = selectedProduct?.name === product.name;
                  return (
                    <button
                      key={pidx}
                      onClick={() => handleSelectProduct(product)}
                      style={{
                        padding: 0,
                        borderRadius: '14px',
                        border: '2px solid',
                        borderColor: isSel ? activeCategory.color : 'rgba(255,255,255,0.1)',
                        background: isSel ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                        overflow: 'hidden', cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                        textAlign: 'left',
                        boxShadow: isSel ? '0 0 0 3px ' + activeCategory.color + '22, 0 8px 32px rgba(0,0,0,0.3)' : 'none',
                        transform: isSel ? 'translateY(-2px)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSel) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', height: '112px', overflow: 'hidden' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                          }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to top, rgba(8,20,10,0.85) 0%, transparent 55%)',
                        }} />
                        {/* Selected checkmark */}
                        {isSel && (
                          <div style={{
                            position: 'absolute', top: '8px', right: '8px',
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: activeCategory.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px ' + activeCategory.color + '55',
                          }}>
                            <Check size={12} color="white" strokeWidth={2.5} />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div style={{ padding: '12px 14px 14px' }}>
                        <span style={{
                          fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '12.5px',
                          color: isSel ? 'white' : 'rgba(255,255,255,0.7)',
                          display: 'block', lineHeight: 1.35,
                        }}>
                          {product.name}
                        </span>
                        {isSel && (
                          <span style={{
                            fontFamily: t.fontBody, fontSize: '10.5px',
                            color: activeCategory.color, marginTop: '5px', display: 'block',
                            fontWeight: 600,
                          }}>
                            ✓ Selected — scroll to packaging ↓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — SELECT PACKAGING SYSTEMS (interactive)
         ════════════════════════════════════════════════════════════ */}
      <div
        ref={packagingSectionRef}
        style={{ padding: '100px 0', borderBottom: `1px solid ${t.cardBorder}`, background: t.pageBg }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '6px 18px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '9999px', marginBottom: '20px',
            }}>
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '10px', color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 03</span>
              <span style={{ width: '1px', height: '12px', background: t.pillBorder }} />
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Packaging Formats</span>
            </div>
            <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: t.textTitle, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Select Packaging{' '}
              <span style={isDark ? { background: t.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}} className={isDark ? '' : 'gradient-text-green'}>Systems.</span>
            </h2>
            <p style={{ fontFamily: t.fontBody, fontSize: '14px', color: t.textMuted, maxWidth: '480px', margin: '16px auto 0', lineHeight: 1.6 }}>
              {selectedProduct
                ? `Choosing packaging for ${selectedProduct.name} — click a format, then pick a size.`
                : 'Every format engineered for maximum shelf life and retail impact. Click to select.'}
            </p>
          </div>

          <div ref={pkgGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {packagingTypes.map((pkg) => {
              const PkgIcon = pkg.icon;
              const isActive = selectedPackaging?.id === pkg.id;
              return (
                <div key={pkg.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* ── Packaging card ── */}
                  <div
                    onClick={() => handleSelectPackaging(pkg)}
                    style={{
                      padding: '36px 28px 28px',
                      background: t.cardBg,
                      borderRadius: '20px',
                      border: '2px solid',
                      borderColor: isActive ? (isDark ? '#4FA8D8' : 'var(--green)') : t.cardBorder,
                      boxShadow: isActive
                        ? (isDark ? '0 16px 48px rgba(79,168,216,0.2)' : '0 16px 48px rgba(45,122,58,0.12)')
                        : (isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.04)'),
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      minHeight: '280px', cursor: 'pointer',
                      transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = isDark ? '0 20px 48px rgba(0,0,0,0.4)' : '0 20px 48px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = t.cardBorderHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.04)';
                        e.currentTarget.style.borderColor = t.cardBorder;
                      }
                    }}
                  >
                    {/* Decorative corner glow */}
                    <div style={{
                      position: 'absolute', top: '-40px', right: '-40px',
                      width: '120px', height: '120px',
                      background: pkg.gradient, opacity: isActive ? 0.15 : 0.05,
                      borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none',
                    }} />

                    {/* Selected badge */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', top: '14px', right: '14px',
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: isDark ? '#1565C0' : 'var(--green)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isDark ? '0 4px 12px rgba(21,101,192,0.5)' : '0 4px 12px rgba(45,122,58,0.4)',
                      }}>
                        <Check size={14} color="white" strokeWidth={2.5} />
                      </div>
                    )}

                    <div>
                      <div style={{
                        width: 52, height: 52, borderRadius: '14px',
                        background: pkg.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '20px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      }}>
                        <PkgIcon size={22} color="white" />
                      </div>
                      <h3 style={{
                        fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '18px',
                        color: t.textTitle, marginBottom: '10px',
                      }}>
                        {pkg.type}
                      </h3>
                      <p style={{
                        fontFamily: t.fontBody, fontSize: '13px',
                        color: t.textSub, lineHeight: 1.7,
                      }}>
                        {pkg.desc}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      borderTop: `1px solid ${t.cardBorder}`, paddingTop: '16px', marginTop: '20px',
                    }}>
                      <CheckCircle2 size={13} color={isDark ? '#76CAFF' : 'var(--green)'} />
                      <span style={{ fontFamily: t.fontBody, fontSize: '12px', color: t.textMuted }}>
                        {pkg.sizeLabel}
                      </span>
                    </div>
                  </div>

                  {/* ── Size options panel (slides in when packaging selected) ── */}
                  {isActive && (
                    <div style={{
                      padding: '20px 22px',
                      background: isDark ? 'rgba(79, 168, 216, 0.08)' : 'linear-gradient(135deg, rgba(45,122,58,0.05), rgba(45,122,58,0.02))',
                      border: `1px solid ${isDark ? 'rgba(79, 168, 216, 0.22)' : 'rgba(45,122,58,0.2)'}`,
                      borderRadius: '14px',
                    }}>
                      <p style={{
                        fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10.5px',
                        color: isDark ? '#76CAFF' : 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em',
                        marginBottom: '14px',
                      }}>
                        {pkg.sizeLabel}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {pkg.sizes.map((size) => {
                          const isSizeSel = selectedSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => handleSelectSize(size)}
                              style={{
                                padding: '10px 22px',
                                borderRadius: '9999px',
                                border: '2px solid',
                                borderColor: isSizeSel ? (isDark ? '#76CAFF' : 'var(--green)') : t.sizeBtnBorder,
                                background: isSizeSel ? t.sizeBtnActiveBg : t.sizeBtnBg,
                                color: isSizeSel ? t.sizeBtnActiveText : t.sizeBtnText,
                                fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                                boxShadow: isSizeSel ? (isDark ? '0 6px 20px rgba(79,168,216,0.4)' : '0 6px 20px rgba(45,122,58,0.3)') : 'none',
                                transform: isSizeSel ? 'scale(1.05)' : 'scale(1)',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSizeSel) {
                                  e.currentTarget.style.borderColor = t.accent;
                                  e.currentTarget.style.background = isDark ? 'rgba(79,168,216,0.12)' : 'rgba(45,122,58,0.06)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSizeSel) {
                                  e.currentTarget.style.borderColor = t.sizeBtnBorder;
                                  e.currentTarget.style.background = t.sizeBtnBg;
                                }
                              }}
                            >
                              {size}
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

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — BRAND PREVIEW (replaces Packaging Gallery)
         ════════════════════════════════════════════════════════════ */}
      <div
        ref={previewSectionRef}
        style={{
          padding: '100px 0',
          background: isDark ? 'linear-gradient(135deg, #050a12 0%, #081220 50%, #060b14 100%)' : 'linear-gradient(135deg, #06100a 0%, #0a1a0e 50%, #060d08 100%)',
          borderBottom: isDark ? '1px solid rgba(79,168,216,0.15)' : '1px solid rgba(139,195,74,0.15)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '700px', height: '700px',
          background: isDark
            ? 'radial-gradient(circle, rgba(79,168,216,0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,195,74,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '600px', height: '600px',
          background: isDark
            ? 'radial-gradient(circle, rgba(21,101,192,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(45,122,58,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '6px 18px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '9999px', marginBottom: '20px',
            }}>
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '10px', color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 04</span>
              <span style={{ width: '1px', height: '12px', background: t.pillBorder }} />
              <span style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10px', color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Brand Vision</span>
            </div>
            <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Your Product,{' '}
              <span style={isDark ? { background: t.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}} className={isDark ? '' : 'gradient-text-green'}>Your Brand.</span>
            </h2>
          </div>

          {showPreview ? (
            /* ── Full preview ── */
            <div style={{
              display: 'flex', gap: '64px', alignItems: 'center',
              justifyContent: 'center', flexWrap: 'wrap',
            }}>
              {/* Packaging mockup with brand name overlay */}
              <div style={{
                position: 'relative',
                maxWidth: '460px', width: '100%',
                filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.65))',
              }}>
                <img
                  src={packagingImage}
                  alt="Packaging Preview"
                  style={{ width: '100%', display: 'block', borderRadius: '8px' }}
                />

                {/* ── Brand name overlay — strict container-bounded auto-fit ── */}
                <BrandOverlay
                  name={previewBrandName}
                  packagingId={selectedPackaging.id}
                />
              </div>

              {/* Details panel */}
              <div style={{ maxWidth: '360px', flex: '1 1 280px' }}>
                <div style={{
                  padding: '32px',
                  background: isDark ? 'rgba(10, 17, 31, 0.85)' : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  border: isDark ? '1px solid rgba(79, 168, 216, 0.25)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 12px',
                    background: t.pillBg,
                    border: `1px solid ${t.pillBorder}`,
                    borderRadius: '9999px', marginBottom: '20px',
                  }}>
                    <span style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10px', color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      ✦ Draft Preview
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: t.fontDisplay, fontWeight: 900, fontSize: '24px',
                    color: 'white', marginBottom: '4px', lineHeight: 1.2,
                  }}>
                    {previewBrandName || 'Your Brand'}
                  </h3>
                  <p style={{
                    fontFamily: t.fontBody, fontSize: '12.5px',
                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.45)', marginBottom: '28px',
                  }}>
                    Private Label Configuration
                  </p>

                  {[
                    { label: 'Product',    value: selectedProduct?.name },
                    { label: 'Category',   value: activeCategory.label  },
                    { label: 'Packaging',  value: selectedPackaging?.type },
                    { label: 'Net Weight', value: selectedSize },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '11px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <span style={{
                        fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10.5px',
                        color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                        {label}
                      </span>
                      <span style={{
                        fontFamily: t.fontBody, fontSize: '13px',
                        color: 'rgba(255,255,255,0.85)', fontWeight: 600, maxWidth: '55%',
                        textAlign: 'right',
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}

                  <a
                    href="#onboarding"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '14px 24px', marginTop: '24px',
                      background: t.accentGradient,
                      color: 'white', borderRadius: '9999px',
                      fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '13px',
                      textDecoration: 'none',
                      boxShadow: t.btnShadow,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Inquire About This Configuration <ArrowRight size={14} />
                  </a>

                  <p style={{
                    fontFamily: t.fontBody, fontSize: '10.5px',
                    color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.28)', textAlign: 'center', marginTop: '14px', lineHeight: 1.5,
                  }}>
                    Visual mockup only. Final artwork developed with your design team.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ── Placeholder (steps not completed yet) ── */
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%', margin: '0 auto 28px',
                background: t.pillBg,
                border: `2px dashed ${t.pillBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Package size={34} color={t.pillColor} />
              </div>
              <p style={{
                fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '16px',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.32)', lineHeight: 1.65,
              }}>
                Complete steps 02 &amp; 03 above to see<br />your branded product preview here.
              </p>
              {selectedProduct && !selectedPackaging && (
                <div style={{ marginTop: '20px' }}>
                  <span style={{
                    padding: '8px 18px',
                    background: t.pillBg,
                    border: `1px solid ${t.pillBorder}`,
                    borderRadius: '9999px',
                    fontFamily: t.fontBody, fontSize: '12.5px',
                    color: t.pillColor,
                  }}>
                    ✓ Product selected: <strong>{selectedProduct.name}</strong> — now choose packaging above ↑
                  </span>
                </div>
              )}
              {selectedProduct && selectedPackaging && !selectedSize && (
                <div style={{ marginTop: '20px' }}>
                  <span style={{
                    padding: '8px 18px',
                    background: t.pillBg,
                    border: `1px solid ${t.pillBorder}`,
                    borderRadius: '9999px',
                    fontFamily: t.fontBody, fontSize: '12.5px',
                    color: t.pillColor,
                  }}>
                    ✓ {selectedPackaging.type} selected — now pick a size above ↑
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4: HOW PRIVATE LABEL WORKS — Video timeline
         ════════════════════════════════════════════════════════════ */}
      <div
        ref={timelineSectionRef}
        style={{
          position: 'relative', overflow: 'hidden',
          padding: '120px 0', borderBottom: `1px solid ${t.cardBorder}`,
          background: t.pageBg,
        }}
      >
        <video
          ref={videoRef}
          muted playsInline preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0, pointerEvents: 'none',
            opacity: isDark ? 0.35 : 0.6,
          }}
        >
          <source src="/videos/Vegetables_conveyor_smooth.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(to bottom, rgba(6,11,20,0.85), rgba(6,11,20,0.75), rgba(6,11,20,0.90))'
            : 'linear-gradient(to bottom, rgba(6,10,15,.48), rgba(6,10,15,.38), rgba(6,10,15,.52))',
          zIndex: 1, pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 18px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '9999px',
              fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px',
              color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.1em',
              margin: '0 auto 16px',
            }}>
              Manufacturing Journey
            </div>
            <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              How Private Label{' '}
              <span style={isDark ? { background: t.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}} className={isDark ? '' : 'gradient-text-green'}>Works.</span>
            </h2>
            <p style={{ fontFamily: t.fontBody, fontSize: '14px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.7)', maxWidth: '520px', margin: '16px auto 0', lineHeight: 1.6 }}>
              We manage the entire food-science loop from direct farm sourcing to vacuum packaging under your own logo.
            </p>
          </div>

          <div ref={timelineListRef} style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '36px', width: '2px',
              background: t.timelineLine,
              zIndex: 0,
            }} />
            {steps.map((st, idx) => {
              const StepIcon = st.icon;
              const visible  = visibleSteps.has(idx);
              return (
                <div
                  key={idx}
                  data-step={idx}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '28px',
                    marginBottom: idx < steps.length - 1 ? '48px' : '0',
                    position: 'relative', zIndex: 1,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-40px)',
                    transition: `opacity 0.7s ease ${idx * 0.05}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.05}s`,
                  }}
                >
                  <div style={{ flexShrink: 0, width: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: st.highlight
                        ? (isDark ? 'linear-gradient(135deg, #1565C0, #4FA8D8)' : `linear-gradient(135deg, ${st.color}, ${st.color}cc)`)
                        : (isDark ? '#0a111f' : 'white'),
                      border: `2px solid ${isDark ? 'rgba(79,168,216,0.35)' : st.color + '40'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: st.highlight
                        ? (isDark ? '0 8px 24px rgba(79,168,216,0.4)' : `0 8px 24px ${st.color}40`)
                        : (isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.08)'),
                    }}>
                      <StepIcon size={22} color={st.highlight ? 'white' : (isDark ? '#76CAFF' : st.color)} strokeWidth={2} />
                    </div>
                    <span style={{
                      fontFamily: t.fontDisplay, fontWeight: 800,
                      fontSize: '10px', color: isDark ? '#76CAFF' : 'var(--text-light)', letterSpacing: '0.06em',
                    }}>
                      {st.step}
                    </span>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      background: t.timelineCardBg,
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${st.color}18`,
                      borderRadius: '16px',
                      padding: '24px 28px',
                      boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)',
                      marginBottom: '4px',
                      position: 'relative', overflow: 'hidden',
                      transition: 'all 0.35s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = isDark ? '0 16px 40px rgba(0,0,0,0.5)' : `0 16px 40px ${st.color}18`;
                      e.currentTarget.style.borderColor = isDark ? 'rgba(79,168,216,0.3)' : `${st.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : `${st.color}18`;
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                      background: isDark
                        ? 'linear-gradient(to bottom, #4FA8D8, rgba(79,168,216,0.3))'
                        : `linear-gradient(to bottom, ${st.color}, ${st.color}55)`,
                      borderRadius: '4px 0 0 4px',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{
                        fontFamily: t.fontDisplay, fontWeight: 800,
                        fontSize: '17px', color: t.textTitle, lineHeight: 1.2,
                      }}>
                        {st.title}
                      </h3>
                      <span style={{
                        padding: '3px 10px',
                        background: isDark ? 'rgba(79,168,216,0.12)' : `${st.color}12`,
                        border: `1px solid ${isDark ? 'rgba(79,168,216,0.25)' : st.color + '25'}`,
                        borderRadius: '9999px',
                        fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '10px',
                        color: isDark ? '#76CAFF' : st.color, letterSpacing: '0.06em',
                        whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '12px',
                      }}>
                        {st.tag}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: t.fontBody, fontSize: '14px',
                      color: t.textSub, lineHeight: 1.72,
                    }}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5: FAQ ACCORDION
         ════════════════════════════════════════════════════════════ */}
      <div ref={faqRef} style={{ padding: '120px 0', borderBottom: `1px solid ${t.cardBorder}`, background: t.pageBgAlt, opacity: 0 }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 18px',
              background: t.pillBg,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '9999px',
              fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px',
              color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.1em',
              margin: '0 auto 16px',
            }}>
              Common Questions
            </div>
            <h2 style={{ fontFamily: t.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 54px)', color: t.textTitle, marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Frequently Asked{' '}
              <span style={isDark ? { background: t.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}} className={isDark ? '' : 'gradient-text-green'}>Questions.</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: activeFaq === idx ? t.cardBgActive : t.cardBg,
                  borderRadius: '14px',
                  border: '1px solid ' + (activeFaq === idx ? (isDark ? 'rgba(79,168,216,0.4)' : 'var(--green-light)') : t.cardBorder),
                  overflow: 'hidden',
                  boxShadow: activeFaq === idx ? (isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(45,122,58,0.08)') : 'none',
                  transition: 'all 0.35s ease',
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%', padding: '24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textAlign: 'left', cursor: 'pointer',
                    background: 'none', border: 'none',
                  }}
                >
                  <span style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '14.5px', color: t.textTitle }}>
                    {faq.q}
                  </span>
                  <ChevronDown size={18} style={{
                    color: isDark ? '#76CAFF' : 'var(--text-muted)', flexShrink: 0, marginLeft: '16px',
                    transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }} />
                </button>
                {activeFaq === idx && (
                  <div style={{
                    padding: '0 24px 24px',
                    fontFamily: t.fontBody, fontSize: '14px',
                    color: t.textSub, lineHeight: 1.75,
                    borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6: BULK INQUIRY FORM
         ════════════════════════════════════════════════════════════ */}
      <div id="onboarding" style={{ padding: '120px 0', background: t.pageBgAlt }}>
        <div className="container" style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          <div style={{
            background: t.cardBg,
            padding: '48px 40px',
            borderRadius: '24px',
            boxShadow: isDark ? '0 24px 70px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.08)',
            border: `1px solid ${isDark ? 'rgba(79,168,216,0.25)' : 'var(--border-light)'}`,
          }}>
            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '6px 18px',
                    background: t.pillBg,
                    border: `1px solid ${t.pillBorder}`,
                    borderRadius: '9999px',
                    fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px',
                    color: t.pillColor, textTransform: 'uppercase', letterSpacing: '0.1em',
                    margin: '0 auto 12px',
                  }}>
                    Bulk Inquiry &amp; RFQ
                  </div>
                  <h3 style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '24px', color: t.textTitle }}>
                    Request a Custom Quote
                  </h3>
                  <p style={{ fontFamily: t.fontBody, fontSize: '13.5px', color: t.textMuted, marginTop: '6px' }}>
                    Please provide your product specifications below. Our export and supply team will get back to you within 24 hours.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Company Name
                      </label>
                      <input
                        type="text" required value={formBrandName}
                        onChange={(e) => setFormBrandName(e.target.value)}
                        placeholder={previewBrandName || 'e.g. Global Foods Trading'}
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.inputBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Destination Country
                      </label>
                      <input
                        type="text" required placeholder="e.g. Germany"
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.inputBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Required
                      </label>
                      <input
                        type="text" required
                        defaultValue={selectedProduct ? selectedProduct.name : ''}
                        placeholder="e.g. Garlic Powder / Onion Flakes"
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.inputBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Form
                      </label>
                      <select
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.selectBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="flakes" style={{ background: t.selectBg, color: t.inputText }}>Flakes</option>
                        <option value="powder" style={{ background: t.selectBg, color: t.inputText }}>Powder</option>
                        <option value="whole" style={{ background: t.selectBg, color: t.inputText }}>Whole / Sliced</option>
                        <option value="dice" style={{ background: t.selectBg, color: t.inputText }}>Diced</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Monthly Quantity Needed
                      </label>
                      <input
                        type="text" required placeholder="e.g. 500 kg / 2 Tons"
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.inputBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Target Price (USD/INR per kg)
                      </label>
                      <input
                        type="text" placeholder="Optional"
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.inputBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Packaging Requirement
                      </label>
                      <select
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.selectBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="bulk" style={{ background: t.selectBg, color: t.inputText }}>Bulk Pack (10kg / 20kg drums)</option>
                        <option value="retail" style={{ background: t.selectBg, color: t.inputText }}>Retail Ready Pack (pouches/jars)</option>
                        <option value="custom" style={{ background: t.selectBg, color: t.inputText }}>Custom specifications</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Private Label Required?
                      </label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        style={{
                          width: '100%', padding: '12px 14px', borderRadius: '8px',
                          background: t.selectBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.inputText,
                          fontFamily: t.fontBody, fontSize: '13px',
                          transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                        }}
                        onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                        onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="Yes" style={{ background: t.selectBg, color: t.inputText }}>Yes, private label required</option>
                        <option value="No" style={{ background: t.selectBg, color: t.inputText }}>No, bulk ingredient supply only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '11px', color: isDark ? '#94a3b8' : 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      WhatsApp / Email Contact
                    </label>
                    <input
                      type="text" required value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. +91 99999 99999 / buyer@globalfoods.com"
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '8px',
                        background: t.inputBg,
                        border: `1px solid ${t.inputBorder}`,
                        color: t.inputText,
                        fontFamily: t.fontBody, fontSize: '13px',
                        transition: 'border-color 0.3s, box-shadow 0.3s', boxSizing: 'border-box',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = t.inputFocusBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`; }}
                      onBlur={(e) => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%', padding: '16px',
                      borderRadius: '9999px',
                      border: 'none',
                      background: t.accentGradient,
                      color: '#ffffff',
                      boxShadow: t.btnShadow,
                      fontFamily: t.fontDisplay, fontWeight: 700, fontSize: '14px',
                      marginTop: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                  >
                    Submit RFQ &amp; Request Samples
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: isDark ? 'rgba(79,168,216,0.15)' : 'rgba(45,122,58,0.1)',
                  display: 'flex', alignItems: 'center', margin: '0 auto 20px', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={28} color={isDark ? '#76CAFF' : 'var(--green)'} />
                </div>
                <h3 style={{ fontFamily: t.fontDisplay, fontWeight: 800, fontSize: '20px', color: t.textTitle, marginBottom: '12px' }}>
                  Bulk RFQ Submitted Successfully
                </h3>
                <p style={{ fontFamily: t.fontBody, fontSize: '13.5px', color: t.textSub, lineHeight: 1.6, marginBottom: '24px' }}>
                  Thank you for submitting specifications for {formBrandName || previewBrandName || 'your brand'}. Our industrial ingredients desk is processing your request and will provide sample details.
                </p>
                <a
                  href={'https://wa.me/919993377038?text=Hi%20BFF%2C%20I%20just%20submitted%20a%20bulk%20inquiry%20RFQ%20for%20company%20' + encodeURIComponent(formBrandName || previewBrandName)}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: '12px 24px', borderRadius: '9999px', fontSize: '13.5px',
                    display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
                    background: isDark ? 'linear-gradient(135deg, #1565C0, #4FA8D8)' : 'var(--green)',
                    color: 'white',
                    fontFamily: t.fontDisplay, fontWeight: 700,
                  }}
                >
                  <MessageSquare size={14} />
                  Connect Instantly on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}