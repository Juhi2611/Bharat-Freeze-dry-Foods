'use client';
import { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const cardsRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', product: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Left Form reveal
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // Right Cards reveal (Staggered items)
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <Phone size={20} />,
      label: 'Phone / WhatsApp',
      value: '+91 99933 77038',
      link: 'tel:+919993377038',
      color: '#2D7A3A',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'exports@bharatfreezedried.com',
      link: 'mailto:exports@bharatfreezedried.com',
      color: '#1565C0',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Factory Location',
      value: 'Sector C, Industrial Growth Centre, Pithampur, Madhya Pradesh 454775',
      link: 'https://maps.google.com/?q=Pithampur+Industrial+Area+Indore+Madhya+Pradesh',
      color: '#C62828',
    },
    {
      icon: <Clock size={20} />,
      label: 'Business Hours',
      value: 'Mon–Sat: 9:00 AM – 6:00 PM IST',
      link: null,
      color: '#E65100',
    },
  ];

  return (
    <section id="contact" ref={containerRef} className="section" style={{ background: 'var(--light-grey)', overflow: 'hidden' }}>
      <div className="container">
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>Get in Touch</div>
          <h2 className="display-md" style={{ color: 'var(--text-dark)', marginBottom: '16px' }}>
            Let&apos;s Work{' '}
            <span className="gradient-text-green">Together.</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-body)', maxWidth: '480px', margin: '0 auto' }}>
            Ready to bring premium freeze-dried food to your brand? Let&apos;s talk.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start',
        }} className="grid-2">
          {/* Left: Form */}
          <div ref={formRef} style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(32px, 4vw, 56px)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--green)' }}>
                  <CheckCircle2 size={64} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '24px',
                  color: 'var(--green)',
                  marginBottom: '12px',
                }}>
                  Inquiry Received!
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', lineHeight: 1.7 }}>
                  Thank you for reaching out. Our team will contact you within 24 hours.
                  For urgent inquiries, WhatsApp us directly.
                </p>
                <a
                  href="https://wa.me/919993377038"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ marginTop: '24px', display: 'inline-flex', background: '#25D366', color: 'white' }}
                >
                  WhatsApp Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '22px',
                  color: 'var(--text-dark)',
                  marginBottom: '32px',
                }}>
                  Send an Inquiry
                </h3>

                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: 'var(--text-body)',
                      marginBottom: '6px',
                      display: 'block',
                      letterSpacing: '0.04em',
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your Name"
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: 'var(--text-body)',
                      marginBottom: '6px',
                      display: 'block',
                      letterSpacing: '0.04em',
                    }}>
                      Company
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                </div>

                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: 'var(--text-body)',
                      marginBottom: '6px',
                      display: 'block',
                      letterSpacing: '0.04em',
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: 'var(--text-body)',
                      marginBottom: '6px',
                      display: 'block',
                      letterSpacing: '0.04em',
                    }}>
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: 'var(--text-body)',
                    marginBottom: '6px',
                    display: 'block',
                    letterSpacing: '0.04em',
                  }}>
                    Product / Category of Interest
                  </label>
                  <select
                    className="form-input"
                    value={formData.product}
                    onChange={e => setFormData(p => ({ ...p, product: e.target.value }))}
                    style={{ cursor: 'pointer', width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'white' }}
                  >
                    <option value="">Select a category...</option>
                    <option value="fruits">Freeze Dried Fruits</option>
                    <option value="vegetables">Freeze Dried Vegetables</option>
                    <option value="precooked">Precooked Foods</option>
                    <option value="gravies">Freeze Dried Gravies</option>
                    <option value="spices">Freeze Dried Spices</option>
                    <option value="superfoods">Superfoods & Powders</option>
                    <option value="pet">Pet Nutrition</option>
                    <option value="private-label">Private Label</option>
                    <option value="export">Export Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: 'var(--text-body)',
                    marginBottom: '6px',
                    display: 'block',
                    letterSpacing: '0.04em',
                  }}>
                    Message *
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="Tell us about your requirements, quantities, and any specific needs..."
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    style={{ resize: 'vertical', fontFamily: 'var(--font-body)', width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '16px', gap: '8px' }}
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Inquiry
                    </>
                  )}
                </button>

                <div style={{
                  marginTop: '16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}>
                  We respond within 24 hours • Your data is safe with us
                </div>
              </form>
            )}
          </div>

          {/* Right: Contact Info + Map */}
          <div ref={cardsRef} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            {/* Contact cards */}
            {contactInfo.map((info, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '20px 24px',
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  transition: 'all 0.3s ease',
                  cursor: info.link ? 'pointer' : 'default',
                }}
                onClick={() => info.link && window.open(info.link, '_blank')}
                onMouseEnter={e => {
                  if (info.link) {
                    e.currentTarget.style.borderColor = `${info.color}30`;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${info.color}12`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: '12px',
                  background: `${info.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: info.color,
                  flexShrink: 0,
                }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '3px',
                  }}>
                    {info.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--text-dark)',
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}>
                    {info.value}
                  </div>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919993377038?text=Hi%20Bharat%20Freeze%20Fried%20Foods%2C%20I%27m%20interested%20in%20your%20products.%20Please%20contact%20me."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '24px 28px',
                background: 'linear-gradient(135deg, #25D366, #20bc5a)',
                borderRadius: 'var(--radius-lg)',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 24px rgba(37,211,102,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(37,211,102,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.3)';
              }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px' }}>
                  Chat on WhatsApp
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.85 }}>
                  Instant response — we reply fast!
                </div>
              </div>
            </a>

            {/* Download Catalogue Block */}
            <div style={{
              padding: '24px',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--text-dark)', marginBottom: '4px' }}>
                  Technical Product Catalogue
                </h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-body)', margin: 0 }}>
                  PDF specification sheets, moisture targets, and packaging details for all product lines.
                </p>
              </div>
              <a
                href="/catalogue.pdf"
                download
                className="btn btn-primary"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Download PDF
              </a>
            </div>

            {/* Map embed */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: '220px',
              border: '1px solid var(--border-light)',
              background: '#E8F5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.744!2d72.8776559!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNiJF!5e0!3m2!1sen!2sin!4v1688000000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="BFF Location"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
