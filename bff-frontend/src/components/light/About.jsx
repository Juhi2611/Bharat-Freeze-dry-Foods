import { useEffect, useRef } from 'react';
import {
  Sprout, Snowflake,
  Droplets, CalendarCheck, Shield, RefreshCw, BarChart2,
  CheckCircle2, XCircle,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ──────────────────────────────────────────────────────────── */
const scrollSteps = [
  {
    video: '/videos/farm2freeze_1.mp4',
    tag: 'Sourcing Strength',
    title: 'Premium Raw Materials',
    desc: 'Sourced from the fertile agricultural belts of Madhya Pradesh. We procure fresh onion, garlic, tomato, potato, fruits, and herbs directly from farm gates at peak harvest.',
  },
  {
    video: '/videos/farm2freeze_2.mp4',
    tag: '−50°C Flash',
    title: 'Rapid Freezing at −50°C',
    desc: 'Flash-freezing locks the cell structure, preserving organic properties, colour, and taste without structural cell wall damage.',
  },
  {
    video: '/videos/farm2freeze_3.mp4',
    tag: 'Vacuum Sublimation',
    title: 'Vacuum Lyophilization',
    desc: 'Frozen products enter the vacuum chamber. Low pressure allows water to sublimate directly from ice to vapour without a liquid phase.',
  },
  {
    video: '/videos/farm2freeze_4.mp4',
    tag: 'Core Phase',
    title: 'Sublimation Extraction',
    desc: 'Gentle heat is applied under strict vacuum to remove moisture while maintaining structural integrity and shape.',
  },
  {
    video: '/videos/farm2freeze_5.mp4',
    tag: 'Moisture < 4%',
    title: 'Moisture Control Check',
    desc: 'Moisture is reduced below the critical 4% threshold, ensuring complete microbiological stability and ambient storage suitability.',
  },
  {
    video: '/videos/farm2freeze_6.mp4',
    tag: 'Industrial Sealing',
    title: 'Protective Barrier Packaging',
    desc: 'Hermetically sealed in multi-layer barrier foil with nitrogen flushing to isolate the product from oxygen and moisture.',
  },
  {
    video: '/videos/farm2freeze_7.mp4',
    tag: 'No Cold Chain',
    title: '24-Month Ambient Shelf Life',
    desc: 'Achieves extended stability without chemical preservatives, cold chain infrastructure, or temperature-controlled warehousing.',
  },
  {
    video: '/videos/farm2freeze_8.mp4',
    tag: 'Global Delivery',
    title: 'Ready for Global Supply Chains',
    desc: 'Lightweight format drastically reduces freight costs while enabling efficient international shipping and institutional integration.',
  },
];

const compareLeft = [
  { text: 'Requires continuous cold chain logistics' },
  { text: 'High risk of temperature abuse and spoilage' },
  { text: 'Cellular damage and water leakage upon thawing' },
  { text: 'Shortened shelf life, typically 6-12 months max' },
  { text: 'High transport costs due to shipping raw water weight' },
  { text: 'Demands expensive cold-storage warehousing' },
];

const compareRight = [
  { text: 'Zero cold chain requirement at any point' },
  { text: 'Ambient stability removes storage spoilage risk' },
  { text: 'Retains original shape, colour, and 97% nutrition' },
  { text: 'Guaranteed 18-24 months ambient shelf life' },
  { text: 'Up to 90% lighter, reducing shipping emissions' },
  { text: 'Standard dry warehouse storage is sufficient' },
];

const techPillars = [
  { icon: Droplets,      title: 'Low Moisture',       desc: 'Moisture is reduced below 4% to stop microbiological activity while keeping cells intact.' },
  { icon: CalendarCheck, title: 'Long Shelf Life',     desc: '18 to 24 months stability in standard conditions, protecting inventory from seasonal price spikes.' },
  { icon: BarChart2,     title: 'Lightweight Payload', desc: 'Water weight is removed, lowering dry freight costs and improving logistics efficiency.' },
  { icon: RefreshCw,     title: 'Quick Rehydration',   desc: 'Reconstitutes to original state within minutes when exposed to warm water or cooking bases.' },
  { icon: Shield,        title: 'Clean Label Purity',  desc: 'Pure single-ingredient options with absolutely no added salt, chemical preservatives, or carriers.' },
  { icon: Snowflake,     title: 'No Refrigeration',    desc: 'Enables global shipping and ambient distribution without dependence on cold chain networks.' },
];

/* ─── FarmToFreeze — pinned scroll story ─────────────────────────── */
function FarmToFreeze() {
  const panelRef      = useRef(null);
  const videosRef     = useRef([]);   // 8 <video> elements
  const textsRef      = useRef([]);   // 8 text-content wrappers
  const dotCirclesRef = useRef([]);   // 8 dot fills (opacity-driven)
  const dotLinesRef   = useRef([]);   // 7 connecting line fills (scaleY-driven)

  useEffect(() => {
    const panel      = panelRef.current;
    const videos     = videosRef.current;
    const texts      = textsRef.current;
    const dotCircles = dotCirclesRef.current;
    const dotLines   = dotLinesRef.current;
    const N          = scrollSteps.length; // 8

    if (!panel) return;

    /*
     * Timeline geometry (per stage = 1 unit):
     *
     *   t ─ DRIFT ─ t+DRIFT ────────── XFADE ───────── t+1
     *     35%      [───────────── 65% cinematic overlap ─────────────]
     *
     * The crossfade window is intentionally long (65% of stage) so that
     * the simultaneous upward movement of both videos is clearly perceived.
     */
    const DRIFT = 0.35; // short settling drift before crossfade begins
    const XFADE = 0.65; // long cinematic crossfade (the main event)

    /*
     * Y travel distances.
     * Videos are CSS-oversized (top: -20%; height: 140%) giving ±160px
     * of safe bleed before any gap appears at the panel edges.
     *
     *  DRIFT_Y  how far the active video slowly rises during DRIFT window
     *  EXIT_Y   final resting position of the outgoing video (far above)
     *  ENTER_Y  starting position of the incoming video (far below)
     */
    const DRIFT_Y = -70;  // clearly visible slow upward drift
    const EXIT_Y  = -240; // exits well above the panel — unambiguous motion
    const ENTER_Y =  180; // enters from clearly below — unambiguous motion

    /* ── Set initial states ────────────────────────────────────── */
    gsap.set(videos,        { opacity: 0, y: 0 });
    gsap.set(videos[0],     { opacity: 1 });
    gsap.set(texts,         { opacity: 0, y: 28, filter: 'blur(8px)' });
    gsap.set(texts[0],      { opacity: 1, y: 0,  filter: 'blur(0px)' });
    gsap.set(dotCircles,    { opacity: 0.18 });
    gsap.set(dotCircles[0], { opacity: 1 });
    gsap.set(dotLines,      { scaleY: 0, transformOrigin: 'top center' });

    /* ── Build master timeline ─────────────────────────────────── */
    const tl = gsap.timeline({ paused: true });

    for (let i = 0; i < N; i++) {
      const t      = i;
      const xStart = t + DRIFT;

      /*
       * 1. Settling drift: active video rises slowly while user reads the content.
       *    ease:'none' — position is always exactly proportional to scroll.
       */
      tl.fromTo(
        videos[i],
        { y: 0 },
        { y: DRIFT_Y, ease: 'none', duration: DRIFT },
        t
      );

      /* 2. Dot-line fills across the full stage duration */
      if (i < N - 1) {
        tl.fromTo(
          dotLines[i],
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', duration: 1 },
          t
        );
      }

      /* 3. Cinematic crossfade — the core of the experience */
      if (i < N - 1) {
        /*
         * OUTGOING: continues rising from DRIFT_Y all the way to EXIT_Y.
         * The total Y travel through the crossfade window is:
         *   EXIT_Y − DRIFT_Y = -240 − (-70) = -170px of additional movement.
         * Very clearly visible at ease:'none' with scroll control.
         */
        tl.to(videos[i], {
          y: EXIT_Y,
          opacity: 0,
          ease: 'none',
          duration: XFADE,
        }, xStart);

        /*
         * INCOMING: starts at ENTER_Y (180px below) and rises to y:0.
         * 180px of upward travel, perfectly in sync with scroll.
         * The two videos are in view simultaneously for the entire XFADE window.
         */
        tl.fromTo(videos[i + 1],
          { y: ENTER_Y, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none', duration: XFADE },
          xStart
        );

        /* Text OUT: fades and lifts before halfway point of crossfade */
        tl.to(texts[i], {
          opacity: 0,
          y: -22,
          filter: 'blur(14px)',
          ease: 'none',
          duration: XFADE * 0.45,
        }, xStart);

        /* Text IN: appears in the second half of the crossfade */
        tl.fromTo(texts[i + 1],
          { opacity: 0, y: 28, filter: 'blur(8px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', ease: 'power2.out', duration: XFADE * 0.65 },
          xStart + XFADE * 0.38
        );

        /* Progress dot brightens near crossfade midpoint */
        tl.to(dotCircles[i + 1],
          { opacity: 1, duration: 0.12 },
          xStart + XFADE * 0.10
        );
      }
    }

    /*
     * ── ScrollTrigger ────────────────────────────────────────────
     * 240vh per stage → 1680vh total for 8 stages.
     * Each scene now requires significant, deliberate scrolling.
     * scrub: 3.5 → very heavy cinematic lag.
     */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger : panel,
        start   : 'top top',
        end     : `+=${(N - 1) * 240}vh`,
        scrub   : 3.5,
        pin     : true,
        anticipatePin: 1,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate(self) {
          /* Performance: only play current ±1 videos */
          const stage = Math.min(N - 1, Math.floor(self.progress * N));
          videos.forEach((v, i) => {
            if (!v) return;
            if (Math.abs(i - stage) <= 1) {
              v.paused && v.play().catch(() => {});
              if (v.preload === 'none') v.preload = 'auto';
            } else {
              !v.paused && v.pause();
            }
          });
        },
      });
    });

    /* Kick off video[0] immediately */
    videos[0]?.play().catch(() => {});

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" style={{ background: '#060a0f' }}>

      {/* ── Intro header — scrolls past before panel pins ─────── */}
      <div className="f2f-header">
        <div className="section-label f2f-header-label">Our Process</div>
        <h2 className="display-md f2f-header-title">
          From Farm to{' '}
          <span className="gradient-text-green">Freeze.</span>
        </h2>
        <p className="body-lg f2f-header-sub">
          Eight precisely controlled steps that transform fresh produce into
          nature&apos;s most perfectly preserved food.
        </p>
      </div>

      {/* ── Single pinned cinematic panel ─────────────────────── */}
      <div ref={panelRef} className="f2f-panel">

        {/* All 8 videos, stacked absolutely — only one visible at a time */}
        {scrollSteps.map((step, i) => (
          <video
            key={i}
            ref={(el) => { videosRef.current[i] = el; }}
            src={step.video}
            muted
            loop
            playsInline
            preload={i < 2 ? 'auto' : 'none'}
            className="f2f-video-abs"
          />
        ))}

        {/* Uniform dark veil over videos */}
        <div className="f2f-overlay" />

        {/* All 8 text blocks at the same position — GSAP owns visibility */}
        {scrollSteps.map((step, i) => (
          <div
            key={i}
            ref={(el) => { textsRef.current[i] = el; }}
            className="f2f-content"
          >
            <div className="f2f-step-num">Step {String(i + 1).padStart(2, '0')}</div>
            <h2 className="f2f-title">{step.title}</h2>
            <p className="f2f-desc">{step.desc}</p>
            <span className="f2f-tag">{step.tag}</span>
          </div>
        ))}

        {/* Vertical progress indicator — right edge */}
        <nav className="f2f-progress-indicator" aria-label="Production stage progress">
          {scrollSteps.map((_, i) => (
            <div key={i} className="f2f-prog-group">
              {/* Dot */}
              <div className="f2f-prog-dot-bg">
                <div
                  ref={(el) => { dotCirclesRef.current[i] = el; }}
                  className="f2f-prog-dot-fill"
                />
              </div>
              {/* Connecting line to next dot */}
              {i < scrollSteps.length - 1 && (
                <div className="f2f-prog-line-bg">
                  <div
                    ref={(el) => { dotLinesRef.current[i] = el; }}
                    className="f2f-prog-line-fill"
                  />
                </div>
              )}
            </div>
          ))}
        </nav>

      </div>
    </section>
  );
}

/* ─── Main About Component ────────────────────────────────────────── */
export default function About() {
  const compareRef = useRef(null);
  const techRef    = useRef(null);
  const storyRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: storyRef.current, start: 'top 85%', toggleActions: 'play none none none' },
          }
        );
      }
      if (techRef.current) {
        const cards = techRef.current.querySelectorAll('[data-tech-card]');
        if (cards.length) {
          gsap.fromTo(cards,
            { opacity: 0, y: 28 },
            {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: techRef.current, start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        }
      }
      if (compareRef.current) {
        const cols = compareRef.current.querySelectorAll('[data-compare-col]');
        if (cols.length) {
          gsap.fromTo(cols,
            { opacity: 0, y: 24 },
            {
              opacity: 1, y: 0, duration: 0.7, stagger: 0.10, ease: 'power3.out',
              scrollTrigger: { trigger: compareRef.current, start: 'top 85%', toggleActions: 'play none none none' },
            }
          );
        }
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── Story Section ───────────────────────────────────── */}
      <section
        className="section"
        style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-light)' }}
      >
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="section-label" style={{ margin: '0 auto 16px' }}>
              Agri-Processing Platform
            </div>
            <h2 className="display-sm" style={{ color: 'var(--text-dark)' }}>
              Corporate Sourcing &amp;{' '}
              <span className="gradient-text-green">Processing Power.</span>
            </h2>
          </div>
          <div
            ref={storyRef}
            className="story-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'start',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'var(--text-body)',
            }}
          >
            <div>
              <p style={{ marginBottom: '20px' }}>
                Bharat Freeze-Dried Foods is building a modern food-processing venture
                strategically located in Madhya Pradesh, India. This central hub places our
                facility close to the core agricultural belts of central India, ensuring
                quick transit from harvesting fields to freeze-drying chambers.
              </p>
              <p>
                Our location guarantees direct access to premium onion, garlic, potato,
                tomato, regional fruits, and herbs. Sourcing directly at harvest allows us
                to maintain strict raw material standards and deliver high-retention food
                technology for modern global supply chains.
              </p>
            </div>
            <div
              style={{
                background: 'var(--light-grey)',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: 'var(--text-dark)',
                  marginBottom: '16px',
                }}
              >
                Agri-Sourcing Highlights
              </h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>
                  <strong>Local Raw Material Sourcing:</strong> Direct links with grower
                  networks across Malwa and central agri-zones.
                </li>
                <li>
                  <strong>Industrial Competence:</strong> Designed as a heavy commercial
                  partner for global food brands, seasoning companies, and institutional
                  buyers.
                </li>
                <li>
                  <strong>Location Advantage:</strong> Lower logistics transit time helps
                  retain natural colour, aroma, and structural integrity.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Farm to Freeze Cinematic Story ──────────────────── */}
      <FarmToFreeze />

      {/* ─── Technology Section ───────────────────────────────── */}
      <section
        ref={techRef}
        className="section"
        style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-light)' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label">Technology &amp; Credibility</div>
            <h2 className="display-md" style={{ marginBottom: '16px' }}>
              Advanced Lyophilization{'  '}
              <span className="gradient-text-green">Capabilities.</span>
            </h2>
            <p
              className="body-lg"
              style={{ color: 'var(--text-body)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}
            >
              Freeze-drying removes moisture under low temperature and vacuum. This process
              helps retain natural colour, flavour, aroma, nutrition, and cell structure far
              better than conventional thermal dehydration.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {techPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  data-tech-card
                  style={{
                    padding: '32px',
                    background: 'var(--light-grey)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    opacity: 0,
                    transition: 'all 0.35s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--green-light)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'rgba(45,122,58,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={20} color="var(--green)" />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: '16px', color: 'var(--text-dark)', marginBottom: '8px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '13.5px',
                      color: 'var(--text-body)', lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Freeze Dry vs Traditional ───────────────────────── */}
      <section
        ref={compareRef}
        className="section"
        style={{ background: 'var(--light-grey)' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-label">Science Meets Food</div>
            <h2 className="display-md" style={{ marginBottom: '16px' }}>
              Why Freeze Drying{' '}
              <span className="gradient-text-green">Wins.</span>
            </h2>
            <p
              className="body-md"
              style={{ color: 'var(--text-body)', maxWidth: '480px', margin: '0 auto' }}
            >
              Not all preservation is equal. Lyophilization is the gold standard — and
              here is why.
            </p>
          </div>

          <div
            className="compare-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '28px',
              alignItems: 'start',
              maxWidth: '920px',
              margin: '0 auto',
            }}
          >
            {/* Traditional Frozen */}
            <div
              data-compare-col
              style={{
                background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 36px',
                border: '1px solid rgba(21,101,192,0.15)',
                opacity: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(21,101,192,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Snowflake size={24} color="#1565C0" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '20px', color: '#1565C0',
                  }}
                >
                  Traditional Frozen
                </h3>
              </div>
              {compareLeft.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    marginBottom: '12px', padding: '12px 14px',
                    background: 'rgba(21,101,192,0.06)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(21,101,192,0.1)',
                  }}
                >
                  <XCircle size={16} color="#EF5350" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      color: '#1A237E', lineHeight: 1.5,
                    }}
                  >
                    {pt.text}
                  </span>
                </div>
              ))}
            </div>

            {/* VS badge */}
            <div
              className="compare-vs-column"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px' }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--green), var(--lime))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '13px', color: 'white',
                  boxShadow: '0 8px 24px rgba(45,122,58,0.35)',
                }}
              >
                VS
              </div>
              <div
                className="compare-vs-line"
                style={{
                  width: '2px', height: '60px', marginTop: '12px',
                  background: 'linear-gradient(to bottom, var(--green), transparent)',
                }}
              />
            </div>

            {/* Freeze Dried — BFF */}
            <div
              data-compare-col
              style={{
                background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 36px',
                border: '2px solid rgba(45,122,58,0.25)',
                position: 'relative',
                opacity: 0,
                boxShadow: '0 20px 60px rgba(45,122,58,0.12)',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--green), var(--lime))',
                  color: 'white', padding: '5px 18px', borderRadius: '9999px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  boxShadow: '0 4px 16px rgba(45,122,58,0.35)', whiteSpace: 'nowrap',
                }}
              >
                Superior Choice
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(45,122,58,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Sprout size={24} color="#2D7A3A" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '20px', color: '#2D7A3A',
                  }}
                >
                  Freeze Dried — BFF
                </h3>
              </div>
              {compareRight.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    marginBottom: '12px', padding: '12px 14px',
                    background: 'rgba(45,122,58,0.06)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(45,122,58,0.12)',
                  }}
                >
                  <CheckCircle2 size={16} color="#2D7A3A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      color: '#1B5E20', lineHeight: 1.5, fontWeight: 500,
                    }}
                  >
                    {pt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
