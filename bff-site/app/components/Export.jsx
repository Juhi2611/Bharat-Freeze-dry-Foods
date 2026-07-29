'use client';
import { useRef, useEffect, useState } from 'react';
import {
  Package, PlaneTakeoff, Medal, Leaf, Globe, ShieldCheck, CheckCircle2,
  Anchor, ShieldAlert, Sparkles, MessageSquare, ClipboardCheck, Container,
  FileCheck, HelpCircle, ArrowRight, ChevronDown, Compass, Ship, Scale,
  Droplets, AlertCircle
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const activeCertifications = [
  { Icon: ShieldCheck, name: 'FSSAI License', status: 'Active', desc: 'Food Safety and Standards Authority of India manufacturing clearance' },
  { Icon: Globe, name: 'APEDA Registration', status: 'Active', desc: 'Agricultural and Processed Food Products Export Development Authority' },
  { Icon: FileCheck, name: 'IEC Registration', status: 'Active', desc: 'Import Export Code registered for commercial shipping' },
];

const roadmapCertifications = [
  { Icon: CheckCircle2, name: 'USFDA Sourcing', status: 'Planned', desc: 'Registered food facility clearance program' },
  { Icon: Medal, name: 'BRCGS Global Standard', status: 'In Progress', desc: 'Global food safety standard compliance certification' },
  { Icon: ShieldCheck, name: 'FSMA Compliance', status: 'Planned', desc: 'Food Safety Modernization Act procedural alignment' },
  { Icon: Leaf, name: 'Organic NPOP / NOP', status: 'Planned', desc: 'Certified organic processing certification' },
  { Icon: Globe, name: 'Halal Assurance', status: 'In Progress', desc: 'Halal certification for Middle Eastern markets' },
  { Icon: CheckCircle2, name: 'Kosher Certification', status: 'Planned', desc: 'Kosher global food standard compatibility' },
  { Icon: FileCheck, name: 'Global G.A.P Sourcing', status: 'Planned', desc: 'Good Agricultural Practices farm sourcing network' },
  { Icon: Medal, name: 'ISO 22000 / HACCP', status: 'In Progress', desc: 'Hazard Analysis and Critical Control Points management system' },
];

const exportSteps = [
  { step: '01', title: 'Custom RFQ', desc: 'Submit your technical specifications, cut sizes, and packaging layout requirements.' },
  { step: '02', title: 'Formulation & QC', desc: 'Our food scientists process samples and verify moisture content (<2%) meets target levels.' },
  { step: '03', title: 'Export Docs Prep', desc: 'We compile all required custom papers: Phytosanitary Certificates, COO, Lab Reports, FSSAI clearance.' },
  { step: '04', title: 'Palletized Packing', desc: 'Bulk goods are packed in food-grade multi-layer aluminum liners and double-wall master cartons.' },
  { step: '05', title: 'Port Dispatch', desc: 'Palletized shipments are sealed and delivered to JNPT, Mundra, or air cargo hubs.' },
  { step: '06', title: 'Global Delivery', desc: 'Customs-cleared goods ship via sea or air freight to your warehouse, completely ambient.' }
];

const exportAdvantages = [
  {
    Icon: ShieldCheck,
    title: 'No Cold Chain Required',
    desc: 'Freeze-dried products maintain structural integrity and color at room temperature. Bypassing cold-chain containers saves up to 60% of transit logistics budgets.'
  },
  {
    Icon: Package,
    title: 'Lightweight Packaging',
    desc: 'Since 90% of water weight is extracted, freight costs are calculated strictly on product bulk volume, making air cargo highly economical for speed-critical lanes.'
  },
  {
    Icon: Medal,
    title: '5-Year Shelf Stability',
    desc: 'BFF products lock in freshness with less than 2% moisture levels, completely immune to humidity shifts or transit delays in hot custom blocks.'
  },
  {
    Icon: Globe,
    title: 'Customs Compliance',
    desc: 'BFF export batches are double-sorted and pass metal detection checks, meeting strict US-FDA, European Food Safety, and Middle Eastern standard checks.'
  }
];

const faqs = [
  { q: 'Do you offer door-to-door shipping for exports?', a: 'We typically export under FOB or CIF terms. However, for specific air freight lanes, we can coordinate with our cargo partners for DDU/DDP delivery options.' },
  { q: 'What is the lead time for export shipping?', a: 'Standard export production takes 25 to 35 days from receipt of deposit, depending on the harvest availability of fresh ingredients and packing customization complexity.' },
  { q: 'What certifications accompany an export shipment?', a: 'Every shipment is accompanied by a Commercial Invoice, Packing List, Bill of Lading/AWB, Phytosanitary Certificate (from Ministry of Agriculture), Certificate of Origin, and Lab Analysis Certificate.' },
  { q: 'Are samples available for international distributors?', a: 'Yes. We routinely dispatch sample test boxes to international distributors via DHL/FedEx. Sourcing partners only pay shipping freight fees.' }
];


export default function Export() {
  const sectionRef = useRef(null);
  const calcRef = useRef(null);
  const advantagesRef = useRef(null);
  const stepsRef = useRef(null);
  const certsRef = useRef(null);
  const faqExportRef = useRef(null);


  const [activeFaq, setActiveFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [certTab, setCertTab] = useState('active');

  // Calculator states
  const [calcCategory, setCalcCategory] = useState('fruits');
  const [calcWeight, setCalcWeight] = useState(1); // Tons

  // Form states
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [volume, setVolume] = useState('1 Ton+ Trial');
  const [whatsapp, setWhatsapp] = useState('');

  // Sourcing weight multipliers (freeze-dry ratio)
  const ratios = {
    fruits: { ratio: 10, name: 'Strawberries / Mangoes' },
    vegetables: { ratio: 8, name: 'Sweet Corn / Green Peas' },
    powders: { ratio: 12, name: 'Superfood Powders' },
    readyMeals: { ratio: 5, name: 'Dal / Precooked Bases' }
  };

  // GSAP scroll reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = [
        { ref: calcRef, children: true, stagger: 0.15 },
        { ref: advantagesRef, children: true, stagger: 0.08 },
        { ref: stepsRef, children: true, stagger: 0.08 },
        { ref: certsRef, children: true, stagger: 0.08 },
        { ref: faqExportRef, children: false, stagger: 0 },
      ];

      reveals.forEach(({ ref, children, stagger }) => {
        if (!ref.current) return;
        const targets = children ? ref.current.children : [ref.current];
        gsap.fromTo(targets,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0,
            duration: 0.75,
            stagger: stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };


  // Calculator outputs
  const selectedRatio = ratios[calcCategory].ratio;
  const rawInputEquivalent = calcWeight * selectedRatio;
  const moistureRemoved = calcWeight * (selectedRatio - 1) * 1000; // in Liters/KG
  const containerLoadPercent = Math.min(100, Math.round((calcWeight / 8) * 100)); // Assume 8 Tons max per 20ft dry FCL due to volume limits of lightweight freeze-dried goods

  return (
    <section id="export-details" ref={sectionRef} style={{ background: 'var(--white)', overflow: 'hidden' }}>


      {/* ════════════════════════════════════════════════════════════
          SECTION 2: LOGISTICS & SOURCING CALCULATOR
         ════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: '120px 0',
        background: 'var(--light-grey)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label" style={{ margin: '0 auto 16px' }}>Logistics Intelligence</div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)' }}>
              Weight &amp; Sourcing{' '}
              <span className="gradient-text-green">Calculator.</span>
            </h2>
            <p className="body-md" style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '16px auto 0' }}>
              Slide to simulate a commercial contract volume and instantly calculate the raw ingredient logistics yield.
            </p>
          </div>

          <div ref={calcRef} className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'stretch' }}>

            {/* Calculator Inputs Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              padding: '40px 36px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--text-dark)', marginBottom: '28px' }}>
                  Choose Sourcing Parameters
                </h3>

                {/* Category selectors */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    1. Product Category
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { id: 'fruits', label: 'Fruits' },
                      { id: 'vegetables', label: 'Vegetables' },
                      { id: 'powders', label: 'Wellness Powders' },
                      { id: 'readyMeals', label: 'Precooked Bases' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCalcCategory(cat.id)}
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: calcCategory === cat.id ? 'var(--green)' : 'var(--border-light)',
                          background: calcCategory === cat.id ? 'rgba(45,122,58,0.04)' : 'transparent',
                          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                          color: calcCategory === cat.id ? 'var(--green)' : 'var(--text-dark)',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight Range Slider */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <label style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      2. Target Volume
                    </label>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--green)' }}>
                      {calcWeight} Metric {calcWeight === 1 ? 'Ton' : 'Tons'} (FD)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={calcWeight}
                    onChange={e => setCalcWeight(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--green)',
                      cursor: 'pointer',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'var(--border-light)'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>1 Ton (Trial)</span>
                    <span>10 Tons (FCL)</span>
                    <span>20 Tons (High Volume)</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--light-grey)',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginTop: '24px'
              }}>
                <AlertCircle size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                  Freeze drying ratio is approximately **{selectedRatio}:1** for {ratios[calcCategory].name}. Sourcing BFR products eliminates significant water freight overheads.
                </p>
              </div>
            </div>

            {/* Calculator Outputs Card (Visual HUD) */}
            <div style={{
              background: 'linear-gradient(135deg, #1b3823 0%, #0d1f14 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(139,195,74,0.15)',
              padding: '40px',
              boxShadow: 'var(--shadow-lg)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', background: 'rgba(255,255,255,0.08)',
                  borderRadius: '9999px', fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--lime)',
                  marginBottom: '20px'
                }}>
                  Calculated Logistics Advantage
                </span>

                {/* Multi-metrics grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                  {/* Equivalent Fresh Weight */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Equivalent Fresh Crop Sourced
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '42px', color: 'white', lineHeight: 1 }}>
                        {rawInputEquivalent}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: '#A5D86A', fontWeight: 600 }}>
                        Metric Tons
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      Required crop input processed at the farm base source.
                    </span>
                  </div>

                  {/* Moisture removed gauge */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                        Water Transported Saved
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: 'white' }}>
                          {moistureRemoved.toLocaleString()}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                          Liters
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                        Estimated Container Load
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: 'white' }}>
                          {containerLoadPercent}%
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                          of 20ft FCL
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Saved logistics costs metric */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '32px'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    TRANSIT BUDGET REDUCTION
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                    No refrigeration / ambient dry container shipping
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '32px',
                  color: 'var(--lime)', textShadow: '0 0 16px rgba(139,195,74,0.4)'
                }}>
                  -60%
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3: WHY FREEZE-DRIED IS PERFECT FOR EXPORT
         ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '120px 0', background: 'var(--white)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div className="section-label" style={{ margin: '0 auto 16px' }}>The Logistics Edge</div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)' }}>
              Export Advantage{' '}
              <span className="gradient-text-green">Unlocked.</span>
            </h2>
          </div>

          <div ref={advantagesRef} className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
            {exportAdvantages.map((adv, idx) => {
              const AdvIcon = adv.Icon;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '40px',
                    background: 'var(--light-grey)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-xs)',
                    transition: 'all 0.35s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--green-light)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'var(--light-grey)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}>
                    <AdvIcon size={22} color="var(--green)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '19px', color: 'var(--text-dark)', marginBottom: '12px' }}>
                    {adv.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.7 }}>
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4: EXPORT PROCESS TIMELINE
         ════════════════════════════════════════════════════════════ */}
      <div style={{
        padding: '120px 0',
        background: 'linear-gradient(135deg, #0A1A0A 0%, #0D2314 50%, #081A0C 100%)',
        borderBottom: '1px solid rgba(139,195,74,0.15)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div className="section-label" style={{
              margin: '0 auto 16px',
              color: 'var(--lime)',
              borderColor: 'rgba(139,195,74,0.3)',
              background: 'rgba(139,195,74,0.1)'
            }}>Workflow</div>
            <h2 className="display-sm" style={{ color: 'white' }}>
              Export Process{' '}
              <span className="gradient-text-green">Timeline.</span>
            </h2>
            <p className="body-md" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '460px', margin: '16px auto 0' }}>
              Our standardized global trade workflow from initial sample calibration to final port clearance.
            </p>
          </div>

          <div ref={stepsRef} className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {exportSteps.map((st, idx) => (
              <div
                key={idx}
                style={{
                  padding: '36px 32px',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  position: 'relative',
                  transition: 'all 0.35s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(139,195,74,0.3)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div style={{
                  position: 'absolute', top: '24px', right: '32px',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '32px',
                  color: 'rgba(139,195,74,0.12)'
                }}>
                  {st.step}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'white', marginBottom: '14px', marginTop: '12px' }}>
                  {st.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5: QUALITY & CERTIFICATIONS TABS
         ════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '120px 0', background: 'var(--white)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label" style={{ margin: '0 auto 16px' }}>Compliance Registry</div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)' }}>
              Quality &amp;{' '}
              <span className="gradient-text-green">Certifications.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--text-muted)', maxWidth: '580px', margin: '12px auto 0', lineHeight: 1.6 }}>
              Verifying credentials across Indian central agency clearances while acquiring global target market certifications.
            </p>
          </div>

          {/* Certificate Category Tab selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '44px' }}>
            <button
              onClick={() => setCertTab('active')}
              style={{
                padding: '14px 28px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: certTab === 'active' ? 'var(--green)' : 'var(--light-grey)',
                background: certTab === 'active' ? 'var(--green)' : 'transparent',
                color: certTab === 'active' ? 'white' : 'var(--text-dark)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                transition: 'all 0.3s ease'
              }}
            >
              Active Trade Clearances
            </button>
            <button
              onClick={() => setCertTab('roadmap')}
              style={{
                padding: '14px 28px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: certTab === 'roadmap' ? 'var(--green)' : 'var(--light-grey)',
                background: certTab === 'roadmap' ? 'var(--green)' : 'transparent',
                color: certTab === 'roadmap' ? 'white' : 'var(--text-dark)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                transition: 'all 0.3s ease'
              }}
            >
              Global Compliance Roadmap
            </button>
          </div>

          <div ref={certsRef}>
            {certTab === 'active' ? (
              <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {activeCertifications.map((cert, idx) => {
                  const CertIcon = cert.Icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '32px 28px',
                        background: 'var(--light-grey)',
                        borderRadius: '20px',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'flex-start',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <CertIcon size={20} color="var(--green)" />
                      </div>
                      <div>
                        <span style={{ display: 'inline-block', padding: '3px 8px', background: 'rgba(45,122,58,0.1)', color: 'var(--green)', borderRadius: '9999px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '9px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                          {cert.status}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--text-dark)', marginBottom: '6px' }}>
                          {cert.name}
                        </h4>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                          {cert.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {roadmapCertifications.map((cert, idx) => {
                  const CertIcon = cert.Icon;
                  const isInProgress = cert.status === 'In Progress';
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '24px 20px',
                        background: 'white',
                        borderRadius: '16px',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-xs)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '220px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = isInProgress ? '#FFB300' : 'var(--green-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isInProgress ? 'rgba(255,179,0,0.1)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: '16px' }}>
                          <CertIcon size={16} color={isInProgress ? '#FFB300' : 'var(--text-muted)'} />
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--text-dark)', marginBottom: '4px' }}>
                          {cert.name}
                        </h4>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                          {cert.desc}
                        </p>
                      </div>
                      <span style={{
                        display: 'inline-block', alignSelf: 'flex-start', padding: '3px 8px',
                        background: isInProgress ? 'rgba(255,179,0,0.1)' : 'rgba(0,0,0,0.05)',
                        color: isInProgress ? '#FFB300' : 'var(--text-muted)',
                        borderRadius: '9999px', fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '12px'
                      }}>
                        {cert.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6: FAQ ACCORDION
         ════════════════════════════════════════════════════════════ */}
      <div ref={faqExportRef} style={{ padding: '120px 0', borderBottom: '1px solid var(--border-light)', background: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label" style={{ margin: '0 auto 16px' }}>Export FAQ</div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)', marginBottom: '12px' }}>
              International Shipping{' '}
              <span className="gradient-text-green">FAQ.</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: activeFaq === idx ? 'white' : 'var(--light-grey)',
                  borderRadius: '16px',
                  border: '1px solid ' + (activeFaq === idx ? 'var(--green-light)' : 'var(--border-light)'),
                  boxShadow: activeFaq === idx ? '0 8px 32px rgba(45,122,58,0.08)' : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.35s ease',
                }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--text-dark)' }}>
                    {faq.q}
                  </span>
                  <ChevronDown size={18} style={{
                    color: 'var(--text-muted)', flexShrink: 0, marginLeft: '16px',
                    transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                  }} />
                </button>
                {activeFaq === idx && (
                  <div style={{
                    padding: '0 24px 24px',
                    fontFamily: 'var(--font-body)', fontSize: '13.5px',
                    color: 'var(--text-body)', lineHeight: 1.7,
                    borderTop: '1px solid rgba(0,0,0,0.04)'
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
          SECTION 7: EXPORT INQUIRY RFQ FORM
         ════════════════════════════════════════════════════════════ */}
      <div id="inquiry" style={{ padding: '120px 0', background: 'var(--light-grey)' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div style={{ background: 'white', padding: '48px 40px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-light)' }}>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <div className="section-label" style={{ margin: '0 auto 12px' }}>Export RFQ</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--text-dark)' }}>
                    Request Global CIF Quotation
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Please enter details of your destination port, requested packaging standards, and estimated quantities.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Company & Port details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="e.g. Globex Foods Ltd."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Destination Port / Country
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        placeholder="e.g. Port of Hamburg, Germany"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Sourcing details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Product Required
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Garlic granules, Onion flakes"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Required Product Form
                      </label>
                      <select
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', background: 'white', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="whole">Whole / Sliced</option>
                        <option value="flakes">Flakes</option>
                        <option value="dice">Diced</option>
                        <option value="powder">Powder</option>
                      </select>
                    </div>
                  </div>

                  {/* Volume & Price */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Monthly Sourcing Needs
                      </label>
                      <select
                        value={volume}
                        onChange={e => setVolume(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', background: 'white', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="Trial FCL">LCL Trial shipment (under 1 Ton)</option>
                        <option value="FCL Load">1 FCL Container (Full Container Load)</option>
                        <option value="Multiple FCL">Multiple Containers / Monthly contract</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Target Price (CIF/FOB USD)
                      </label>
                      <input
                        type="text"
                        placeholder="Optional target per kg"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Packaging & Private Label */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Packaging Requirement
                      </label>
                      <select
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', background: 'white', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="bulk">Bulk Foil Liners & Drums</option>
                        <option value="retail">Retail Ready Pack (pouches/jars)</option>
                        <option value="custom">Custom Packaging layout</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Private Label Required?
                      </label>
                      <select
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', background: 'white', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                        onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="No">No, bulk ingredient supply only</option>
                        <option value="Yes">Yes, private label required</option>
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp Contact Mobile */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      WhatsApp Contact / Mobile / Email
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="e.g. +31 6 12345678 / importer@foodgroup.com"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', fontSize: '13px', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(45,122,58,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: '14px',
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Submit Export RFQ
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(45,122,58,0.1)', display: 'flex', alignItems: 'center', margin: '0 auto 20px', justifyContent: 'center' }}>
                  <CheckCircle2 size={28} color="var(--green)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--text-dark)', marginBottom: '12px' }}>
                  Export RFQ Submitted Successfully
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Your inquiry for **{company}** (discharging to **{country}**) is received. Our export managers will email you a standard CIF price catalog.
                </p>
                <a
                  href={`https://wa.me/919993377038?text=Hi%20BFF%2C%20I%20just%20submitted%20an%20export%20inquiry%20for%20company%20${encodeURIComponent(company)}%20shipping%20to%20${encodeURIComponent(country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '13.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
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

      <style>{`
        .pulse-beacon {
          animation: pulse-ring 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
          transform-origin: center;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .route-path-pulse {
          stroke-dasharray: 8, 5;
          animation: march 20s linear infinite;
        }
        @keyframes march {
          to { stroke-dashoffset: -100; }
        }
      `}</style>

    </section>
  );
}
