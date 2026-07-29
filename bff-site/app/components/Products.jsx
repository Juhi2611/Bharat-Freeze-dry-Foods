'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Leaf, Layers, Apple, Sprout, UtensilsCrossed,
  FlaskConical, Package, Clock, Droplets, ChevronDown,
  ArrowRight, Send, Thermometer, CheckCircle2, Info, PawPrint
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'vegetables',
    label: 'Freeze-Dried Vegetables',
    Icon: Sprout,
    color: '#2D7A3A',
    image: '/images/vegetables_hero.png',
    desc: 'Core cooking ingredients processed at the source — close to major onion, garlic and potato agri-belts of central India.',
    products: [
      { name: 'Onion Flakes', price: '₹240 / kg', image: '/images/vegetables_hero.png', video: '/videos/Freeze-dried_onion_flakes_rotating_202607091432.mp4', form: 'Flakes / Powder', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 5', packaging: 'Multi-layer foil bags', applications: 'Soups, seasonings, instant noodles, processed snacks' },
      { name: 'Garlic Flakes', price: '₹280 / kg', image: '/images/spices_hero.png', video: '/videos/Freeze-dried_garlic_flakes_rotating_202607091432.mp4', form: 'Flakes / Granules / Powder', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Multi-layer foil bags', applications: 'Marinades, seasoning blends, ready-meal mixes' },
      { name: 'Tomato Dices', price: '₹320 / kg', image: '/images/organic_vegetables.png', video: '/videos/Tomato_dices_rotating_in_air_202607091432.mp4', form: 'Dices / Powder', moisture: '< 5%', shelf: '18 months', rehydration: '1 : 5', packaging: 'Foil laminate bags', applications: 'Pizza toppings, soups, sauce bases, instant meals' },
      { name: 'Potato Dices', price: '₹180 / kg', image: '/images/organic_vegetables.png', video: '/videos/Potato_dices_rotating_in_air_202607091433.mp4', form: 'Dices / Slices', moisture: '< 5%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Multi-layer foil bags', applications: 'Instant meal mixes, soup kits, snack coatings' },
      { name: 'Green Chilli Flakes', price: '₹380 / kg', image: '/images/organic_vegetables.png', video: '/videos/green_chilli_flakes.mp4', form: 'Flakes / Whole', moisture: '< 4%', shelf: '18 months', rehydration: '1 : 4', packaging: 'Foil laminate bags', applications: 'Condiment blends, noodle seasoning, hot sauces' },
      { name: 'Ginger Powder', price: '₹450 / kg', image: '/images/spices_hero.png', video: '/videos/ginger_powder.mp4', form: 'Fine Powder', moisture: '< 5%', shelf: '24 months', rehydration: 'N/A', packaging: 'Foil laminate bags', applications: 'Teas, bakery, marinades, health supplements' },
    ],
  },
  {
    id: 'garlic',
    label: 'Freeze-Dried Garlic Range',
    Icon: Layers,
    color: '#558B2F',
    image: '/images/spices_hero.png',
    desc: 'A dedicated garlic processing line offering six distinct forms — crafted for seasoning manufacturers, soup brands, and food formulators.',
    products: [
      { name: 'Garlic Flakes (Bulk)', price: '₹280 / kg', image: '/images/spices_hero.png', form: 'Thin Flakes', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Multi-layer foil / bulk sacks', applications: 'Seasoning blends, bakery toppings, instant soups' },
      { name: 'Garlic Granules', price: '₹290 / kg', image: '/images/spices_hero.png', form: 'Coarse Granules', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Multi-layer foil / bulk sacks', applications: 'Rubs, marinades, sausage mixes, spice blends' },
      { name: 'Garlic Powder', price: '₹260 / kg', image: '/images/spices_hero.png', form: 'Fine Powder', moisture: '< 3%', shelf: '24 months', rehydration: 'N/A', packaging: 'Foil bags / drums', applications: 'Processed foods, flavour compounds, instant noodles' },
      { name: 'Garlic Paste Powder', price: '₹310 / kg', image: '/images/spices_hero.png', form: 'Agglomerated Powder', moisture: '< 5%', shelf: '18 months', rehydration: '1 : 2', packaging: 'Foil laminate bags', applications: 'Ready-meal pastes, curry kits, restaurant supply' },
      { name: 'Roasted Garlic Powder', price: '₹350 / kg', image: '/images/spices_hero.png', form: 'Fine Roasted Powder', moisture: '< 4%', shelf: '24 months', rehydration: 'N/A', packaging: 'Foil bags', applications: 'Gourmet seasonings, chip flavours, sauce mixes' },
      { name: 'Garlic Seasoning Blend', price: '₹380 / kg', image: '/images/spices_hero.png', form: 'Custom Blend', moisture: '< 5%', shelf: '18 months', rehydration: 'N/A', packaging: 'Foil bags / retail packs', applications: 'Table condiment, pizza blends, salad dressings' },
    ],
  },
  {
    id: 'fruits',
    label: 'Freeze-Dried Fruits',
    Icon: Apple,
    color: '#E53935',
    image: '/images/fruits_hero.png',
    desc: 'Whole, sliced or diced Indian fruits dried at peak ripeness — retaining natural colour, flavour and nutritional profile.',
    products: [
      { name: 'Mango Slices', price: '₹650 / kg', image: '/images/fd_mango.png', form: 'Slices / Powder', moisture: '< 3%', shelf: '24 months', rehydration: '1 : 5', packaging: 'Nitrogen-flushed foil bags', applications: 'Snacking, cereal toppings, smoothie blends, bakery' },
      { name: 'Jamun (Whole)', price: '₹750 / kg', image: '/images/fruits_hero.png', form: 'Whole / Halved', moisture: '< 3%', shelf: '24 months', rehydration: '1 : 5', packaging: 'Nitrogen-flushed foil bags', applications: 'Health supplements, nutraceuticals, trail mixes' },
      { name: 'Strawberry Slices', price: '₹850 / kg', image: '/images/fd_strawberry.png', form: 'Slices / Powder', moisture: '< 3%', shelf: '24 months', rehydration: '1 : 5', packaging: 'Nitrogen-flushed foil bags', applications: 'Confectionery, yoghurt toppings, breakfast cereals' },
      { name: 'Banana Chips', price: '₹290 / kg', image: '/images/fruits_hero.png', form: 'Slices / Rounds', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Foil laminate bags', applications: 'Snack packs, granola, infant foods, energy bars' },
      { name: 'Pineapple Tidbits', price: '₹580 / kg', image: '/images/fruits_hero.png', form: 'Dices / Tidbits', moisture: '< 3%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Nitrogen-flushed foil bags', applications: 'Tropical blends, confectionery, beverages, toppings' },
    ],
  },
  {
    id: 'petfood',
    label: 'Freeze-Dried Pet Food',
    Icon: PawPrint,
    color: '#8D6E63',
    image: '/images/pet_page.png',
    desc: 'Pure, single-ingredient plant inputs dried at source. Retains 97% of natural vitamins, vital minerals, and dietary fibers for premium pet food and treat formulations.',
    products: [
      { name: 'Carrot Bites', price: '₹310 / kg', image: '/images/pet_veg_treats.png', form: 'Dices / Powder', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 5', packaging: 'Multi-layer foil bags', applications: 'Dog treats, premium pet food mixers, small animal food' },
      { name: 'Sweet Potato Cubes', price: '₹290 / kg', image: '/images/pet_treats.png', form: 'Cubes / Dices', moisture: '< 5%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Multi-layer foil bags', applications: 'High-fiber dog kibble mixers, feline treats, pet food formulations' },
      { name: 'Green Peas', price: '₹340 / kg', image: '/images/vegetables_hero.png', form: 'Whole Peas', moisture: '< 4%', shelf: '24 months', rehydration: '1 : 4', packaging: 'Foil laminate bags', applications: 'Treat formulations, nutrient-rich kibble addition, pet snacks' },
      { name: 'Pumpkin Flakes', price: '₹380 / kg', image: '/images/pet_veg_treats.png', form: 'Flakes / Powder', moisture: '< 4%', shelf: '18 months', rehydration: '1 : 5', packaging: 'Foil laminate bags', applications: 'Digestive health treats, premium pet kibble, raw food mixers' },
      { name: 'Blueberry Bites', price: '₹890 / kg', image: '/images/pet_treats.png', form: 'Whole Berry / Powder', moisture: '< 3%', shelf: '24 months', rehydration: '1 : 5', packaging: 'Nitrogen-flushed foil bags', applications: 'Antioxidant pet treats, raw food topper, nutritional mixers' },
      { name: 'Spinach Flakes', price: '₹420 / kg', image: '/images/pet_veg_treats.png', form: 'Flakes / Powder', moisture: '< 5%', shelf: '18 months', rehydration: '1 : 4', packaging: 'Foil laminate bags', applications: 'Vitamin-rich dog food mixers, small pet supplements, pet treats' },
    ],
  },
  {
    id: 'herbs',
    label: 'Herbs & Functional Ingredients',
    Icon: Leaf,
    color: '#00838F',
    image: '/images/superfoods_hero.png',
    desc: 'Nutritionally dense powders and flakes from Indian functional herbs — for nutraceutical, wellness and flavour applications.',
    products: [
      { name: 'Moringa Powder', price: '₹420 / kg', image: '/images/superfoods_hero.png', form: 'Fine Powder', moisture: '< 5%', shelf: '24 months', rehydration: 'N/A', packaging: 'Foil bags / drums', applications: 'Supplements, health drinks, bakery fortification' },
      { name: 'Mint Flakes', price: '₹480 / kg', image: '/images/superfoods_hero.png', form: 'Flakes / Powder', moisture: '< 4%', shelf: '18 months', rehydration: '1 : 4', packaging: 'Foil laminate bags', applications: 'Teas, sauces, condiments, confectionery' },
      { name: 'Coriander Leaf Powder', price: '₹320 / kg', image: '/images/superfoods_hero.png', form: 'Fine Powder', moisture: '< 5%', shelf: '18 months', rehydration: 'N/A', packaging: 'Foil bags', applications: 'Seasoning blends, ready-meal kits, HoReCa supply' },
      { name: 'Curry Leaf Powder', price: '₹340 / kg', image: '/images/superfoods_hero.png', form: 'Fine Powder', moisture: '< 5%', shelf: '18 months', rehydration: 'N/A', packaging: 'Foil bags', applications: 'South Indian seasoning, rice mixes, curry kits' },
    ],
  },
  {
    id: 'horeca',
    label: 'Ready-to-Eat / HoReCa Range',
    Icon: UtensilsCrossed,
    color: '#E65100',
    image: '/images/precooked_hero.png',
    desc: 'Complete freeze-dried meal bases and ready-to-eat dishes for hotels, airlines, institutional catering and export meal kits.',
    products: [
      { name: 'Dal Makhni Base', price: '₹390 / kg', image: '/images/precooked_hero.png', form: 'Cooked & Dried', moisture: '< 5%', shelf: '18 months', rehydration: '1 : 3', packaging: 'Vacuum foil pouches', applications: 'Hotels, airlines, army rations, retail meal kits' },
      { name: 'Paneer Makhani Gravy', price: '₹480 / kg', image: '/images/precooked_hero.png', form: 'Cooked & Dried', moisture: '< 5%', shelf: '12 months', rehydration: '1 : 3', packaging: 'Vacuum foil pouches', applications: 'HoReCa, export meal kits, institutional catering' },
      { name: 'Instant Poha', price: '₹220 / kg', image: '/images/precooked_hero.png', form: 'Pre-cooked & Dried', moisture: '< 5%', shelf: '12 months', rehydration: '1 : 2', packaging: 'Foil laminate pouches', applications: 'Retail FMCG, travel meals, airline catering' },
      { name: 'Instant Upma', price: '₹240 / kg', image: '/images/precooked_hero.png', form: 'Pre-cooked & Dried', moisture: '< 5%', shelf: '12 months', rehydration: '1 : 2', packaging: 'Foil laminate pouches', applications: 'Retail FMCG, travel meals, institutional supply' },
      { name: 'Curry Base Mix', price: '₹360 / kg', image: '/images/precooked_hero.png', form: 'Cooked & Dried Blend', moisture: '< 5%', shelf: '18 months', rehydration: '1 : 3', packaging: 'Vacuum foil pouches', applications: 'Food manufacturers, ready-meal brands, exports' },
      { name: 'Green Chutney', price: '₹290 / kg', image: '/images/precooked_hero.png', form: 'Dried Paste Powder', moisture: '< 5%', shelf: '12 months', rehydration: '1 : 2', packaging: 'Foil laminate pouches', applications: 'Condiment supply, airline meals, snack accompaniment' },
    ],
  },
];

const buyerEducation = [
  {
    q: 'Why does freeze-dried onion or garlic cost more than fresh?',
    a: 'Fresh onion and garlic contain 80–90% water. After freeze-drying, that water is removed, leaving a concentrated ingredient with intense flavour and zero waste. One kilogram of freeze-dried onion replaces approximately 5–6 kg of fresh onion in cooking — making the cost per actual usage significantly lower. You also eliminate spoilage, cold chain costs, and labour for peeling and cutting.',
  },
  {
    q: 'What is the shelf life advantage for food manufacturers?',
    a: 'Freeze-dried ingredients maintain quality for 18 to 24 months at ambient temperature with no refrigeration. This dramatically simplifies inventory planning, reduces cold storage costs, and enables manufacturers to stockpile ingredients during off-season without risk of deterioration.',
  },
  {
    q: 'How does weight reduction affect shipping cost for export buyers?',
    a: 'Removing up to 95% of water weight means a full container load carries significantly more usable product than fresh or even conventionally dried alternatives. For an export buyer, this translates directly to lower freight cost per kilogram of end-use ingredient.',
  },
  {
    q: 'Is rehydration quality consistent for bulk production lines?',
    a: 'Yes. Freeze-dried ingredients rehydrate rapidly and consistently — typically within 3 to 5 minutes in hot water or during cooking. The restored product closely matches the colour, texture, and flavour of fresh, making it a reliable input for automated food production lines without batch variation.',
  },
];

function SpecRow({ label, value, Icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '8px',
      padding: '8px 0',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      <Icon size={13} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: '90px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-dark)', lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

function ProductMedia({ product }) {
  const videoRef = useRef(null);
  const hasVideo = Boolean(product.video);

  const handleEnter = () => {
    if (!hasVideo || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => { });
  };

  const handleLeave = () => {
    if (!hasVideo || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden', background: '#f0f0f0', borderBottom: '1px solid var(--border-light)' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          inset: 0,
          opacity: hasVideo ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      {hasVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={product.video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
      if (faqRef.current) {
        gsap.fromTo(faqRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: faqRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section style={{ background: 'var(--white)', overflow: 'hidden' }}>
      {/* Category Tabs */}
      <div style={{ borderBottom: '1px solid var(--border-light)', background: 'white', position: 'sticky', top: '72px', zIndex: 20 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const CatIcon = cat.Icon;
              const active = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat); setExpandedCard(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '20px 24px',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                    color: active ? cat.color : 'var(--text-muted)',
                    borderBottom: active ? '2px solid ' + cat.color : '2px solid transparent',
                    background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <CatIcon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div style={{ padding: '120px 0 40px', background: 'var(--light-grey)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div ref={headerRef} style={{ opacity: 0 }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>{activeCategory.label}</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--text-body)', maxWidth: '640px', lineHeight: 1.7 }}>
              {activeCategory.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div style={{ padding: '64px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {activeCategory.products.map((product, idx) => {
              const isExpanded = expandedCard === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid ' + (isExpanded ? activeCategory.color + '44' : 'var(--border-light)'),
                    overflow: 'hidden',
                    boxShadow: isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <ProductMedia product={product} />

                  <div style={{ padding: '24px 24px 0', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--text-dark)', marginBottom: '4px' }}>
                          {product.name}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
                          Form: {product.form}
                        </span>
                      </div>
                      <div style={{
                        padding: '4px 10px',
                        background: activeCategory.color + '12',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px',
                        color: activeCategory.color,
                        whiteSpace: 'nowrap',
                      }}>
                        {product.price}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {[
                        { label: 'Moisture ' + product.moisture, Icon: Droplets },
                        { label: 'Shelf Life ' + product.shelf, Icon: Clock },
                      ].map(({ label, Icon: I }, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px',
                          background: 'var(--light-grey)',
                          borderRadius: '9999px',
                          fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'var(--text-body)',
                        }}>
                          <I size={11} color="var(--text-muted)" />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : idx)}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 24px',
                      background: isExpanded ? activeCategory.color + '08' : 'transparent',
                      borderTop: '1px solid var(--border-light)',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px',
                      color: isExpanded ? activeCategory.color : 'var(--text-muted)',
                      transition: 'all 0.25s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Info size={13} /> View Full Specification
                    </span>
                    <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--light-grey)' }}>
                      <SpecRow label="Rehydration" value={product.rehydration} Icon={Droplets} />
                      <SpecRow label="Packaging" value={product.packaging} Icon={Package} />
                      <SpecRow label="Applications" value={product.applications} Icon={CheckCircle2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOQ + Sample Request Banner */}
      <div style={{ padding: '64px 0', background: 'var(--light-grey)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="moq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '16px' }}>Sourcing Information</div>
              <h2 className="display-sm" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
                Minimum Order &amp;{' '}
                <span className="gradient-text-green">Sample Policy.</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '8px' }}>
                Minimum order quantity varies by product and packaging configuration. Standard bulk MOQ starts from 100 kg per SKU for most freeze-dried ingredients.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7 }}>
                Sample batches of 500g to 2 kg are available for qualified buyers, food technologists, and export distributors prior to a bulk commitment.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Request Product Catalogue', desc: 'Full specification sheet with technical data for all product lines.', href: '/contact', label: 'Download Catalogue' },
                { title: 'Request a Sample Batch', desc: 'Pre-shipment sample of any product for your quality team.', href: '/contact', label: 'Request Sample' },
                { title: 'Discuss Bulk Requirements', desc: 'Talk to our export team about volumes, pricing and lead times.', href: '/contact', label: 'Get in Touch' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '20px 24px',
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--text-dark)', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <a href={item.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px',
                    background: 'var(--green)', color: 'white',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    transition: 'background 0.25s ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--green-deep)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--green)'; }}
                  >
                    {item.label} <ArrowRight size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Education */}
      <div ref={faqRef} style={{ padding: '80px 0', background: 'white', opacity: 0 }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-label" style={{ margin: '0 auto 16px' }}>Buyer Education</div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)' }}>
              Understanding Freeze-Dried{' '}
              <span className="gradient-text-green">Ingredient Value.</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {buyerEducation.map((item, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid ' + (activeFaq === idx ? 'var(--green)' : 'var(--border-light)'),
                  overflow: 'hidden',
                  background: activeFaq === idx ? 'rgba(45,122,58,0.02)' : 'white',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%', padding: '22px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--text-dark)', maxWidth: '90%', lineHeight: 1.4 }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    color="var(--text-muted)"
                    style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', flexShrink: 0 }}
                  />
                </button>
                {activeFaq === idx && (
                  <div style={{ padding: '0 24px 24px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.75, borderTop: '1px solid var(--border-light)' }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}