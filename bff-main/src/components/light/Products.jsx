import { useState, useEffect, Suspense } from 'react';
import { Leaf, Minus, Plus, MessageCircle } from 'lucide-react';

/* ─── Product Data from Dark Theme Source of Truth ───────── */
export const CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Gravies',
  'Spices',
  'Superfoods',
  'Pre-Cooked Meals',
];

export const PRODUCTS = [
  { id: 'mango', name: 'Alphonso Mango', category: 'Fruits', packImage: '/images/fd_mango.png', ingredientImage: '/images/fruits_hero.png', accent: '#E1B84A', price: '₹349', whiteLabel: true, blurb: 'Peak-season Alphonso, flash-frozen and freeze-dried into crunchy sunshine.' },
  { id: 'strawberry', name: 'Strawberry', category: 'Fruits', packImage: '/images/fd_strawberry.png', ingredientImage: '/images/fruits_hero.png', accent: '#E14A6E', price: '₹329', whiteLabel: true, blurb: 'Ripe strawberries, locked in — same colour, same bite, none of the water.' },
  { id: 'blueberry', name: 'Blueberry', category: 'Fruits', packImage: '/images/fruits_hero.png', ingredientImage: '/images/fruits_hero.png', accent: '#4FA8D8', price: '₹499', whiteLabel: true, blurb: 'Antioxidant-rich blueberries preserved at the peak of freshness.' },

  { id: 'spinach', name: 'Organic Spinach', category: 'Vegetables', packImage: '/images/organic_vegetables.png', ingredientImage: '/images/vegetables_hero.png', accent: '#5FA755', price: '₹279', organic: true, blurb: 'Baby spinach leaves, freeze-dried with every nutrient intact.' },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', packImage: '/images/organic_vegetables.png', ingredientImage: '/images/vegetables_hero.png', accent: '#D94F3D', price: '₹259', blurb: 'Vine-ripe tomatoes ready to rehydrate in seconds.' },
  { id: 'corn', name: 'Sweet Corn', category: 'Vegetables', packImage: '/images/organic_vegetables.png', ingredientImage: '/images/vegetables_hero.png', accent: '#F0C24A', price: '₹269', organic: true, blurb: 'Golden kernels — snack-crunchy dry, tender in seconds when soaked.' },

  { id: 'red-gravy', name: 'Red Gravy Base', category: 'Gravies', packImage: '/images/gravies_sauces.png', ingredientImage: '/images/precooked_hero.png', accent: '#C33B2E', price: '₹399', whiteLabel: true, blurb: 'Chef-grade tomato-onion base. Just add hot water for restaurant curry.' },
  { id: 'white-gravy', name: 'White Gravy Base', category: 'Gravies', packImage: '/images/gravies_sauces.png', ingredientImage: '/images/precooked_hero.png', accent: '#D19A2E', price: '₹419', whiteLabel: true, blurb: 'Cashew-cream royal base. Silky, freeze-dried, shelf-stable.' },
  { id: 'garlic-gravy', name: 'Garlic Gravy Base', category: 'Gravies', packImage: '/images/spices_hero.png', ingredientImage: '/images/precooked_hero.png', accent: '#A97142', price: '₹389', whiteLabel: true, blurb: 'Slow-roasted garlic gravy, freeze-dried at peak aroma.' },

  { id: 'turmeric', name: 'Turmeric', category: 'Spices', packImage: '/images/spices_hero.png', ingredientImage: '/images/spices_hero.png', accent: '#E1832E', price: '₹229', blurb: 'Freeze-dried at peak curcumin content. Vibrant, potent, whole.' },
  { id: 'moringa', name: 'Moringa Superfood', category: 'Superfoods', packImage: '/images/superfoods_hero.png', ingredientImage: '/images/superfoods_hero.png', accent: '#8ABB4A', price: '₹549', organic: true, blurb: 'Nutrient-dense moringa leaf, freeze-dried whole into fine powder.' },
  { id: 'biryani', name: 'Biryani Ready Meal', category: 'Pre-Cooked Meals', packImage: '/images/precooked_hero.png', ingredientImage: '/images/precooked_hero.png', accent: '#D19A2E', price: '₹449', blurb: 'Full-flavour biryani, cooked, freeze-dried, ready in 5 minutes.' },
];

/* ─── Product Card (Light Theme UI) ──────────────────────── */
const isVideoUrl = (url) => typeof url === 'string' && (/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(url) || url.includes('/video/') || url.startsWith('data:video/'));

function LightProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [qty, setQty] = useState(1);

  const waLink = `https://wa.me/919993377038?text=${encodeURIComponent(
    `Hi BFF, I would like to inquire about ${product.name} (Quantity: ${qty}).`
  )}`;

  const isVideo = isVideoUrl(product.ingredientImage);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: `1.5px solid ${hovered ? product.accent : 'var(--border-light)'}`,
        overflow: 'hidden',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : 'var(--shadow-sm)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Image Area with Flip / Reveal */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: '#0F1A28' }}>
        <img
          src={product.packImage}
          alt={product.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'all 0.5s ease',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        {isVideo ? (
          <video
            src={product.ingredientImage}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              transition: 'all 0.5s ease',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1)' : 'scale(1.08)',
            }}
          />
        ) : (
          <img
            src={product.ingredientImage}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              transition: 'all 0.5s ease',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1)' : 'scale(1.08)',
            }}
          />
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 5 }}>
          {product.organic && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '9999px',
              background: '#2D7A3A', color: 'white',
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
            }}>
              <Leaf size={11} /> Organic
            </span>
          )}
        </div>
        {product.whiteLabel && (
          <span style={{
            position: 'absolute', top: 12, right: 12, zIndex: 5,
            padding: '4px 10px', borderRadius: '9999px',
            background: 'rgba(0,0,0,0.65)', color: 'white',
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)', backdropFilter: 'blur(8px)',
          }}>
            White-label
          </span>
        )}

        {/* Hover overlay actions */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 16px 16px',
          background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 70%, transparent 100%)',
          display: 'flex', flexDirection: 'column', gap: '10px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.3s ease',
          zIndex: 10,
        }}>
          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>
              Select Quantity:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--light-grey)', padding: '2px 8px', borderRadius: '9999px', border: '1px solid var(--border-light)' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setQty((q) => Math.max(1, q - 1)); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
              >
                <Minus size={13} color="var(--text-dark)" />
              </button>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--text-dark)', minWidth: '16px', textAlign: 'center' }}>{qty}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setQty((q) => Math.min(20, q + 1)); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
              >
                <Plus size={13} color="var(--text-dark)" />
              </button>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-whatsapp"
            style={{ padding: '10px', fontSize: '12px', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}
          >
            <MessageCircle size={14} /> Inquire on WhatsApp
          </a>
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '10px', color: product.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {product.category}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--text-dark)' }}>
              {product.price}
            </span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--text-dark)', marginBottom: '6px' }}>
            {product.name}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5 }}>
            {product.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Products Component ────────────────────────────── */
function ProductsContent() {
  // Use a simple URL-based approach for category since we're embedded in a TanStack route
  const getUrlCategory = () => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('category');
  };

  const [urlCategory, setUrlCategory] = useState(getUrlCategory);
  const normalizedCategory = urlCategory ? urlCategory.replace(/\+/g, ' ') : 'All';

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.includes(normalizedCategory) ? normalizedCategory : 'All'
  );

  useEffect(() => {
    const handler = () => {
      const cat = new URLSearchParams(window.location.search).get('category');
      setUrlCategory(cat);
      if (cat) {
        const norm = cat.replace(/\+/g, ' ');
        if (CATEGORIES.includes(norm)) setActiveCategory(norm);
        else setActiveCategory('All');
      } else {
        setActiveCategory('All');
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);


  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Sticky Category Filter Bar */}
      <div style={{
        position: 'sticky', top: '72px', zIndex: 30,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-light)',
        padding: '14px 0',
      }}>
        <div className="container" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', whiteSpace: 'nowrap' }}>
            {['All', ...CATEGORIES].map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    border: '1.5px solid ' + (active ? 'var(--green)' : 'var(--border-light)'),
                    background: active ? 'var(--green)' : 'white',
                    color: active ? 'white' : 'var(--text-dark)',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '64px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filtered.map((p) => (
              <LightProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}