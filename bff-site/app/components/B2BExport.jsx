'use client';
import { useState } from 'react';
import {
  Globe2, Sparkles, ShieldCheck, CheckCircle2, Send, CheckSquare, FileCheck2, Award,
  Factory, Utensils, Zap, ShoppingBag, Tag, Ship, Shield, HeartHandshake, Plane,
  Activity, PawPrint, Compass
} from 'lucide-react';

const PRODUCT_OPTIONS = [
  'Freeze-Dried Fruits',
  'Freeze-Dried Vegetables',
  'Gravy & Sauce Bases',
  'Freeze-Dried Spices',
  'Superfood Powders',
  'Pre-Cooked Ready Meals',
  'Pet Food Ingredients',
  'Custom Blends / Ingredients',
];

const EXPORT_HIGHLIGHTS = [
  '100% Export Grade Sourcing & Full Traceability',
  'Zero Cold Chain Needed — 2-Year Shelf Life',
  'FCL & LCL Container-Load Shipping Worldwide',
  'HACCP, ISO 22000 & FSSAI Export Certified',
  'Custom Private Label & Physical Pouch Design',
];

const TRUST_BADGES = [
  { label: 'ISO 22000 Certified', Icon: ShieldCheck },
  { label: 'HACCP Aligned', Icon: Award },
  { label: 'Global Compliance', Icon: Globe2 },
  { label: 'Custom OEM Packaging', Icon: FileCheck2 },
];

const INDUSTRIES = [
  { id: 'food-manufacturers', name: 'Food Manufacturers', description: 'Premium freeze-dried fruit powders, dice & cuts for bakery, cereal, confectionery & dairy formulations.', Icon: Factory, accent: '#2D7A3A' },
  { id: 'hotels-restaurants', name: 'Hotels & Restaurants', description: 'Chef-grade shelf-stable produce, curry bases & instant rehydration ingredients for high-volume kitchens.', Icon: Utensils, accent: '#D19A2E' },
  { id: 'qsr', name: 'Quick Service Restaurants', description: 'Ready-to-use gravy bases & real fruit crunches ensuring fast, consistent menu execution across outlets.', Icon: Zap, accent: '#E65100' },
  { id: 'retail-supermarkets', name: 'Retail & Supermarkets', description: 'Consumer-packaged freeze-dried fruit snacks & pantry staples preserved at peak nutrition.', Icon: ShoppingBag, accent: '#2D7A3A' },
  { id: 'private-label', name: 'Private Label Brands', description: 'End-to-end turnkey contract manufacturing, custom pouch printing & formulation development.', Icon: Tag, accent: '#558B2F' },
  { id: 'export-distributors', name: 'Export Distributors', description: 'Full container-load (FCL) shipments with complete export documentation, phytosanitary & HACCP compliance.', Icon: Ship, accent: '#0277BD' },
  { id: 'military-defence', name: 'Military & Defence Food Supply', description: 'Lightweight, high-calorie field rations with 25-year shelf life for defence & tactical operations.', Icon: Shield, accent: '#B71C1C' },
  { id: 'emergency-relief', name: 'Emergency Relief & Disaster Food', description: 'Nutrient-dense instant meal packs designed for immediate deployment in humanitarian relief.', Icon: HeartHandshake, accent: '#558B2F' },
  { id: 'travel-aviation', name: 'Travel & Aviation Catering', description: 'Weight-optimized, flight-ready gourmet snack packs & instant meals for airlines & cruise liners.', Icon: Plane, accent: '#D19A2E' },
  { id: 'health-wellness', name: 'Health & Wellness Brands', description: 'Organic superfood powders like Moringa, Turmeric & Blueberry extracts for dietary supplements.', Icon: Activity, accent: '#2D7A3A' },
  { id: 'pet-food', name: 'Pet Food Manufacturers', description: 'High-protein freeze-dried chicken, liver, & salmon ingredients for premium pet treats & toppers.', Icon: PawPrint, accent: '#D97B3D' },
  { id: 'outdoor-adventure', name: 'Outdoor & Adventure Food', description: 'Ultralight, calorie-dense freeze-dried meals for mountaineering, trekking & expedition gear brands.', Icon: Compass, accent: '#0277BD' },
];

/* ─── Hero Component (Light Theme UI for B2BHero) ────────── */
export function LightB2BHero() {
  const scrollToForm = () => {
    const el = document.getElementById('enquiry-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{
      position: 'relative',
      padding: '160px 0 100px',
      background: 'linear-gradient(135deg, #081A0C 0%, #0D2314 50%, #0A1A0A 100%)',
      overflow: 'hidden',
      color: 'white',
      textAlign: 'center',
    }}>
      <video
        autoPlay muted loop playsInline preload="metadata"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.65,
        }}
      >
        <source src="/videos/export_bg.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,15,8,0.25)', zIndex: 1 }} />

      <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '900px' }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', borderRadius: '9999px',
          background: 'rgba(139,195,74,0.15)', border: '1px solid rgba(139,195,74,0.3)',
          marginBottom: '32px',
        }}>
          <Globe2 size={14} color="#8BC34A" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C5E1A5' }}>
            Global Bulk & Export Solutions
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(40px, 6.5vw, 96px)', lineHeight: 1.05, letterSpacing: '-0.04em',
          color: 'white', marginBottom: '24px',
        }}>
          Export-Grade Freeze-Dried Foods,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #8BC34A 0%, #C5E1A5 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Delivered Worldwide.</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 20px)',
          fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)',
          maxWidth: '660px', margin: '0 auto 40px',
        }}>
          Partner with Bharat Freeze Dry Foods for premium, shelf-stable ingredients, private labeling, and full container-load export solutions.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <button
            onClick={scrollToForm}
            className="btn btn-primary"
            style={{ padding: '16px 36px', fontSize: '15px', gap: '8px' }}
          >
            <Sparkles size={16} /> Start Export Enquiry
          </button>
          <a href="#industries" className="btn btn-outline" style={{ padding: '16px 36px', fontSize: '15px' }}>
            Industries We Serve
          </a>
        </div>

        {/* Bottom Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-display)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} color="#8BC34A" /> ISO 22000 & HACCP</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Globe2 size={16} color="#8BC34A" /> 25+ Export Nations</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={16} color="#8BC34A" /> Custom Private Label</span>
        </div>
      </div>
    </section>
  );
}

/* ─── B2B Enquiry Form (Light Theme UI) ──────────────────── */
function B2BEnquiryForm() {
  const [form, setForm] = useState({
    companyName: '', contactPerson: '', businessEmail: '', phoneNumber: '',
    country: '', industry: '', interestedProducts: [], estimatedQuantity: '1 - 5 Tons',
    privateLabelRequired: 'No', packagingPreference: 'Bulk', targetMarket: '',
    additionalRequirements: '', agreeToTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border-light)',
    fontFamily: 'var(--font-body)', fontSize: '14px',
    color: 'var(--text-dark)', background: 'white',
    outline: 'none', transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '12px', color: 'var(--text-dark)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: '6px',
  };

  const handleProductToggle = (p) => {
    setForm(f => ({
      ...f,
      interestedProducts: f.interestedProducts.includes(p)
        ? f.interestedProducts.filter(x => x !== p)
        : [...f.interestedProducts, p],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitted(true); setSubmitting(false); }, 1200);
  };

  if (submitted) {
    return (
      <div id="enquiry-form" style={{ padding: '80px 0', background: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(45,122,58,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={32} color="var(--green)" />
          </div>
          <h2 className="display-sm" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>Enquiry Received!</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.7 }}>
            Thank you for your B2B enquiry. Our export team will review your requirements and get back to you within 1 business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section id="enquiry-form" style={{ padding: '80px 0', background: 'var(--light-grey)', borderBottom: '1px solid var(--border-light)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
          {/* Highlights */}
          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>Export Enquiry</div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
              Start Your{' '}
              <span className="gradient-text-green">B2B Partnership.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '32px' }}>
              Fill in your requirements and our export team will prepare a customised proposal within 24 hours.
            </p>

            {EXPORT_HIGHLIGHTS.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <CheckCircle2 size={16} color="var(--green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--text-body)' }}>{h}</span>
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '32px' }}>
              {TRUST_BADGES.map(({ label, Icon }, i) => (
                <div key={i} style={{
                  padding: '12px 16px', background: 'white',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Icon size={16} color="var(--green)" />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Company Name *</label>
                <input required style={inputStyle} placeholder="Acme Foods Ltd." value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Contact Person *</label>
                <input required style={inputStyle} placeholder="John Smith" value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Business Email *</label>
                <input required type="email" style={inputStyle} placeholder="john@company.com" value={form.businessEmail} onChange={e => setForm(f => ({ ...f, businessEmail: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input required style={inputStyle} placeholder="+1 555 000 1234" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Country *</label>
                <input required style={inputStyle} placeholder="United States" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Industry Sector *</label>
                <input required style={inputStyle} placeholder="Food Manufacturing" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Interested Products *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {PRODUCT_OPTIONS.map((p) => {
                  const checked = form.interestedProducts.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handleProductToggle(p)}
                      style={{
                        padding: '10px 12px', textAlign: 'left',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid ' + (checked ? 'var(--green)' : 'var(--border-light)'),
                        background: checked ? 'rgba(45,122,58,0.06)' : 'white',
                        fontFamily: 'var(--font-body)', fontSize: '12.5px',
                        color: checked ? 'var(--green-deep)' : 'var(--text-body)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <CheckSquare size={13} color={checked ? 'var(--green)' : 'var(--text-muted)'} />
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Est. Quantity</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={form.estimatedQuantity} onChange={e => setForm(f => ({ ...f, estimatedQuantity: e.target.value }))}>
                  {['< 1 Ton', '1 - 5 Tons', '5 - 20 Tons', '20 - 100 Tons', '100+ Tons'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Private Label?</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={form.privateLabelRequired} onChange={e => setForm(f => ({ ...f, privateLabelRequired: e.target.value }))}>
                  {['No', 'Yes', 'Not Sure'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Packaging</label>
                <select style={{ ...inputStyle, appearance: 'none' }} value={form.packagingPreference} onChange={e => setForm(f => ({ ...f, packagingPreference: e.target.value }))}>
                  {['Bulk', 'Retail Pouches', 'Custom'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Target Market</label>
              <input style={inputStyle} placeholder="USA, EU, Middle East..." value={form.targetMarket} onChange={e => setForm(f => ({ ...f, targetMarket: e.target.value }))} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Additional Requirements</label>
              <textarea
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Certifications needed, specific formulations, custom packaging details..."
                value={form.additionalRequirements}
                onChange={e => setForm(f => ({ ...f, additionalRequirements: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={form.agreeToTerms}
                onChange={e => setForm(f => ({ ...f, agreeToTerms: e.target.checked }))}
                style={{ marginTop: '2px', accentColor: 'var(--green)' }}
                required
              />
              <label htmlFor="agreeTerms" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5 }}>
                I agree to be contacted by BFF regarding my enquiry and understand that my information will be handled professionally.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {submitting ? 'Submitting…' : <><Send size={16} /> Submit B2B Enquiry</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─── 12 Industries Grid (Light Theme UI) ───────────────── */
function B2BIndustries() {
  return (
    <section id="industries" style={{ padding: '80px 0', background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-label" style={{ margin: '0 auto 16px' }}>Diverse Applications</div>
          <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
            The Industries{' '}
            <span className="gradient-text-green">We Serve</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-body)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Supplying premium freeze-dried food solutions across diverse industries worldwide.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {INDUSTRIES.map(({ id, name, description, Icon, accent }) => (
            <div
              key={id}
              style={{
                padding: '28px',
                background: 'var(--light-grey)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = accent + '44';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: '16px',
                background: accent + '12',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${accent}22`,
              }}>
                <Icon size={22} color={accent} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--text-dark)', marginBottom: '8px' }}>
                {name}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function B2BExport() {
  return (
    <>
      <B2BEnquiryForm />
      <B2BIndustries />
    </>
  );
}
