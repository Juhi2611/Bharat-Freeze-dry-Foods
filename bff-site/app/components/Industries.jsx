'use client';
import { useRef, useEffect, useState } from 'react';
import {
  Factory, UtensilsCrossed, ShoppingBag, Globe, Plane,
  Tent, Building2, FlaskConical, Layers, Package,
  ArrowRight, ChevronDown,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    id: 'food-manufacturers',
    Icon: Factory,
    title: 'Food Manufacturers',
    subtitle: 'Reliable bulk ingredient supply for production lines',
    desc: 'Food processing companies require consistent, specification-controlled ingredients year-round. Our freeze-dried vegetables, garlic range, and herb powders serve as direct inputs for seasoning manufacturers, snack producers, and packaged food brands — with guaranteed moisture levels, batch consistency, and clean-label compliance.',
    applications: ['Seasoning and spice blends', 'Instant meal formulations', 'Snack coatings and flavour systems', 'Bakery enrichment'],
    color: '#2D7A3A',
    image: '/images/industry_food_manufacturers.png',
  },
  {
    id: 'seasoning',
    Icon: FlaskConical,
    title: 'Seasoning Companies',
    subtitle: 'High-concentration flavour inputs with long shelf life',
    desc: 'Freeze-dried garlic, onion, chilli, and herb powders deliver concentrated flavour without the moisture variability of fresh or spray-dried alternatives. Our garlic range alone offers six distinct particle sizes — from whole flakes to fine powder — giving seasoning formulators precision control over flavour intensity and texture.',
    applications: ['Dry rub blends', 'Chip and snack seasoning', 'Soup and noodle flavour sachets', 'Table condiment mixes'],
    color: '#558B2F',
    image: '/images/industry_seasoning.png',
  },
  {
    id: 'noodles',
    Icon: Layers,
    title: 'Instant Noodle Brands',
    subtitle: 'Dried vegetable and herb inclusions for noodle packs',
    desc: 'Our freeze-dried vegetable cubes and flakes are engineered to rehydrate rapidly in hot water — matching the 3-minute cook cycle of modern instant noodle products. We supply onion flakes, green chilli flakes, tomato dices, and herb blends that retain colour and texture through the packaging and rehydration cycle.',
    applications: ['Noodle vegetable sachet inclusions', 'Soup block fortification', 'Flavour oil carrier blends', 'Garnish flakes'],
    color: '#E65100',
    image: '/images/industry_noodles.png',
  },
  {
    id: 'soup-sauce',
    Icon: UtensilsCrossed,
    title: 'Soup and Sauce Companies',
    subtitle: 'Dehydrated base ingredients for ambient-temperature production',
    desc: 'For soup manufacturers, ambient shelf life, zero cold chain, and rapid rehydration are non-negotiable. Our tomato powder, onion powder, garlic powder, and curry base mixes serve as foundational ingredients for ambient soups, sauces, and ready-to-mix meal kits — reducing procurement and storage complexity at scale.',
    applications: ['Instant soup base powders', 'Tomato and onion paste powders', 'Sauce concentrates', 'Bouillon cube inputs'],
    color: '#BF360C',
    image: '/images/industry_soup_sauce.png',
  },
  {
    id: 'ready-meals',
    Icon: Package,
    title: 'Ready-Meal Brands',
    subtitle: 'Complete freeze-dried meal components for retail and export',
    desc: 'We supply both ingredient-level inputs and complete ready-to-eat freeze-dried meal bases — dal makhni, paneer gravies, curry bases, and regional Indian dishes — for retail meal kit brands, subscription meal services, and export-oriented ready-meal manufacturers looking for ambient-stable, low-weight SKUs.',
    applications: ['Indian meal kits for retail', 'Export-packaged ready meals', 'Subscription food boxes', 'Camping and travel meal range'],
    color: '#4A148C',
    image: '/images/industry_ready_meals.png',
  },
  {
    id: 'horeca',
    Icon: Building2,
    title: 'HoReCa Suppliers',
    subtitle: 'Premium ingredients for hotels, restaurants, and catering chains',
    desc: 'Hotels and large catering operations benefit from freeze-dried ingredients through consistent quality regardless of seasonal supply variation, zero waste from spoilage, and labour savings from pre-processed formats. Our vegetable dices, garlic flakes, and herb powders serve as direct kitchen inputs that reduce prep time without compromising dish quality.',
    applications: ['Bulk vegetable and herb supply', 'Pre-portioned ingredient kits', 'Central kitchen formulations', 'Banquet and buffet preparation'],
    color: '#1565C0',
    image: '/images/industry_horeca.png',
  },
  {
    id: 'exporters',
    Icon: Globe,
    title: 'Exporters and Trading Houses',
    subtitle: 'Export-ready packaging, certifications, and documentation',
    desc: 'For Indian export trading companies, we function as a white-label manufacturing partner. Our products are packaged in export-compliant multi-layer foil with full technical data sheets, FSSAI certification, and APEDA registration support. With no cold chain requirement and 24-month shelf life, our products move efficiently across global freight routes.',
    applications: ['Branded or unbranded bulk export', 'Container load consolidation', 'Private label for overseas markets', 'FOB and CIF trade terms'],
    color: '#006064',
    image: '/images/industries1.png',
  },
  {
    id: 'military',
    Icon: Tent,
    title: 'Military and Outdoor Supply',
    subtitle: 'Calorie-dense, lightweight, long-life field rations',
    desc: 'Defence procurement and outdoor equipment distributors require food products that are lightweight, calorie-dense, shelf-stable for 2 to 5 years, and require no refrigeration or complex preparation. Freeze-dried meals and ingredient components meet these requirements precisely — making them the standard for military rations, expedition food, and emergency preparedness kits.',
    applications: ['Army and paramilitary ration kits', 'Mountaineering and trekking food', 'Disaster relief supply', 'Survival and emergency kits'],
    color: '#4E342E',
    image: '/images/farm_to_freeze.png',
  },
  {
    id: 'airlines',
    Icon: Plane,
    title: 'Airlines and Institutional Catering',
    subtitle: 'Consistent, lightweight galley ingredients for flight catering',
    desc: 'Airlines and institutional caterers manage food at massive scale under strict weight and consistency constraints. Our freeze-dried ingredients reduce the overall weight of meal preparation, eliminate batch variation across multiple production kitchens, and simplify procurement by replacing seasonal fresh inputs with year-round ambient-stable alternatives.',
    applications: ['In-flight meal ingredient supply', 'Institutional cafeteria kitchens', 'Hospital and healthcare catering', 'Railway and transit catering'],
    color: '#37474F',
    image: '/images/industries2.webp',
  },
  {
    id: 'retail',
    Icon: ShoppingBag,
    title: 'Retail Private Labels',
    subtitle: 'White-label freeze-dried products for supermarket own brands',
    desc: 'Retail chains and FMCG distributors looking to launch freeze-dried product ranges can work with us on turnkey private label manufacturing — from product formulation to branded retail-ready packaging. We handle production, quality testing, regulatory compliance, and export documentation while you focus on distribution and marketing.',
    applications: ['Supermarket own-brand ranges', 'Health and wellness retail', 'Export-market branded lines', 'D2C and e-commerce product ranges'],
    color: '#6A1B9A',
    image: '/images/private_label.png',
  },
];

export default function Industries() {
  const introRef = useRef(null);
  const bottomGridRef = useRef(null);

  // GSAP scroll reveals
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (introRef.current) {
        gsap.fromTo(introRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
      if (bottomGridRef.current) {
        gsap.fromTo(bottomGridRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bottomGridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const [activeIndustry, setActiveIndustry] = useState(industries[0]);
  const [displayIndustry, setDisplayIndustry] = useState(industries[0]);
  const [animState, setAnimState] = useState('visible'); // 'visible', 'leaving', 'entering'
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => {
      obs.disconnect();
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleSelectIndustry = (ind) => {
    if (ind.id !== activeIndustry.id) {
      setActiveIndustry(ind);
      setAnimState('leaving');
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setDisplayIndustry(ind);
        setAnimState('entering');
      }, 150);
    }
  };

  useEffect(() => {
    if (animState === 'entering') {
      const timer2 = setTimeout(() => {
        setAnimState('visible');
      }, 50);
      return () => clearTimeout(timer2);
    }
  }, [animState]);

  return (
    <section id="sectors" ref={sectionRef} style={{ background: 'var(--white)', overflow: 'hidden' }}>

      {/* ── Intro ── */}
      <div style={{ padding: '80px 0 64px', borderBottom: '1px solid var(--border-light)', background: 'var(--light-grey)' }}>
        <div className="container">
          <div ref={introRef} style={{
            opacity: 0,
            maxWidth: '640px',
          }}>
            <div className="section-label" style={{ marginBottom: '16px' }}>Target Sectors</div>
            <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '20px' }}>
              Built for the Buyers{' '}
              <span className="gradient-text-green">That Scale.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.72 }}>
              From food manufacturers to defence procurement, our freeze-dried ingredients serve ten distinct industries — each with its own sourcing requirements, quality standards, and supply chain expectations.
            </p>
          </div>
        </div>
      </div>
      <div style={{ height: '0px', background: 'var(--white)' }} />

      {/* ── Industry Selector ── */}
      <div className="industries-selector-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr' }}>

        {/* Sidebar Nav */}
        <div className="industries-sidebar" style={{
          borderRight: '1px solid var(--border-light)',
          background: 'var(--light-grey)',
          padding: '32px 0',
          minHeight: '600px',
        }}>
          {industries.map((ind) => {
            const IndIcon = ind.Icon;
            const active = activeIndustry.id === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => handleSelectIndustry(ind)}
                className={active ? 'active-industry-btn' : ''}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 24px',
                  background: active ? 'white' : 'transparent',
                  borderLeft: active ? `3px solid ${ind.color}` : '3px solid transparent',
                  color: active ? ind.color : 'var(--text-muted)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  '--active-color': ind.color,
                }}
              >
                <IndIcon size={15} style={{ flexShrink: 0 }} />
                {ind.title}
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="industries-detail-panel" style={{
          position: 'relative',
          padding: '56px 64px',
          minHeight: '600px',
          overflow: 'hidden',
          background: '#060a0f',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Dynamic Background Image */}
          {/* Dynamic Background Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${displayIndustry.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.05)', // prevents blurred edges from showing as a thin gap
            opacity: animState === 'leaving' ? 0 : 0.70,
            transition: 'opacity 0.3s ease-in-out, background-image 0.3s ease-in-out',
            zIndex: 0,
          }} />

          {/* Dark Overlay matching Hero */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(8,26,12,0.30) 0%, rgba(5,15,8,0.42) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          {/* Animating Content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            opacity: animState === 'visible' ? 1 : 0,
            transform: animState === 'leaving' ? 'translateY(-16px)' : animState === 'entering' ? 'translateY(16px)' : 'translateY(0)',
            transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 20px ${displayIndustry.color}40`,
                border: `1px solid ${displayIndustry.color}30`,
              }}>
                <displayIndustry.Icon size={22} color={displayIndustry.color} />
              </div>
              <div>
                <h2 className="industry-detail-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '34px', color: 'white', lineHeight: 1.05, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
                  {displayIndustry.title}
                </h2>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: '#A5D86A', marginBottom: '20px', letterSpacing: '0.01em', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              {displayIndustry.subtitle}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '17px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.8, marginBottom: '36px', maxWidth: '620px', textShadow: '0 1px 8px rgba(0,0,0,0.75)' }}>
              {displayIndustry.desc}
            </p>

            {/* Applications */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                Key Applications
              </div>
              <div className="industry-apps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {displayIndustry.applications.map((app, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px 18px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(8px)',
                  }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#A5D86A', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: 'rgba(255,255,255,1)', lineHeight: 1.4, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px',
              background: displayIndustry.color,
              color: 'white',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Discuss Your Requirement <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ height: '80px', background: 'var(--white)' }} />

      {/* ── Why Freeze-Dried Costs More — Buyer Education ── */}
      <div style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0A1A0A 0%, #0D2314 50%, #081A0C 100%)', color: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-block', padding: '5px 16px',
              background: 'rgba(139,195,74,0.12)', border: '1px solid rgba(139,195,74,0.25)',
              borderRadius: '9999px', marginBottom: '20px',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', color: '#C5E1A5', textTransform: 'uppercase' }}>
                Procurement Insight
              </span>
            </div>
            <h2 className="display-sm" style={{ color: 'white', marginBottom: '16px' }}>
              Why Freeze-Dried Ingredients{' '}
              <span style={{ background: 'linear-gradient(135deg, #8BC34A, #C5E1A5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Deliver Better Value.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              The unit price per kilogram is higher. The total cost of sourcing, storage, preparation and waste is not.
            </p>
          </div>

          <div ref={bottomGridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { Icon: Package, title: 'Weight Reduction', body: 'Up to 90% of water weight is removed. A single kilogram of freeze-dried onion replaces 5 to 6 kg of fresh onion in end-use — dramatically reducing freight cost per unit of flavour.' },
              { Icon: FlaskConical, title: 'Zero Spoilage', body: 'Fresh ingredients carry 15 to 30% spoilage and wastage in transit and storage. Freeze-dried ingredients have near-zero spoilage at ambient temperature for up to 24 months.' },
              { Icon: Layers, title: 'Consistent Quality', body: 'Seasonal variation in fresh produce leads to inconsistent flavour and colour in production. Freeze-dried inputs provide stable, specification-controlled quality every batch.' },
              { Icon: Globe, title: 'No Cold Chain', body: 'Eliminating refrigerated logistics removes a significant cost and complexity layer — particularly for export buyers who face cold chain risks in long-haul international freight.' },
              { Icon: Factory, title: 'Instant Use', body: 'No peeling, chopping, or pre-cooking required. Freeze-dried ingredients reduce kitchen labour by 40 to 60% for high-volume production environments.' },
              { Icon: Building2, title: 'Long Shelf Life', body: '18 to 24 months at ambient temperature enables bulk procurement when prices are favourable, without the inventory risk associated with fresh or chilled ingredients.' },
            ].map(({ Icon: I, title, body }, idx) => (
              <div
                key={idx}
                style={{
                  padding: '28px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,195,74,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(139,195,74,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <I size={18} color="#8BC34A" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'white', marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
