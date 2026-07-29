'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Sprout, Tractor, HeartPulse, ShieldOff, CalendarCheck,
  PlaneTakeoff, Tag, FlaskConical, Leaf, Settings2, Wind,
} from 'lucide-react';

const reasons = [
  { Icon: Sprout,        title: 'Central Indian Agri Belt',       desc: 'Located in Madhya Pradesh, sourcing onion, garlic, potato, tomato, fruits, and herbs directly at peak harvest for unmatched cost efficiency.', accent: '#2D7A3A', size: 'large' },
  { Icon: Tractor,       title: 'Direct Sourcing Traceability',  desc: 'Direct partnerships with local growers ensuring supply security and full harvest traceability.', accent: '#558B2F', size: 'normal' },
  { Icon: HeartPulse,    title: '97% Nutrient Retention',        desc: 'Advanced low-temperature vacuum drying preserves natural cell structure, colour, aroma, and bioactive elements.', accent: '#1565C0', size: 'normal' },
  { Icon: ShieldOff,     title: '100% Clean Label',              desc: 'Completely free from additives, chemical preservatives, or added sodium — simple, pure ingredients.', accent: '#C62828', size: 'large' },
  { Icon: CalendarCheck, title: '24-Month Ambient Life',         desc: 'Stable room-temperature shelf life eliminates cold chain logistics and storage losses for global distributors.', accent: '#E65100', size: 'normal' },
  { Icon: PlaneTakeoff,  title: 'Export-Optimised Freight',       desc: 'Up to 90% weight reduction allows maximum payload utilisation in dry shipping containers.', accent: '#1A237E', size: 'normal' },
  { Icon: Tag,           title: 'OEM & Private Label Services',  desc: 'Turnkey custom packaging, recipe formulation, and branding options from bulk bags to retail pouches.', accent: '#4A148C', size: 'large' },
  { Icon: FlaskConical,  title: 'Industrial Lyophilizers',       desc: 'State-of-the-art freeze-drying chambers with micro-climatic control for uniform, stable moisture extraction.', accent: '#006064', size: 'normal' },
  { Icon: Leaf,          title: 'Zero-Waste Institutional Sourcing', desc: 'No preparation waste, no peel loss, and 100% yield recovery for catering chains and noodle brands.', accent: '#2D7A3A', size: 'normal' },
  { Icon: Settings2,     title: 'Custom Particle Sizes',         desc: 'Flexible processing formats: whole, slices, dices, flakes, granules, or fine functional powders.', accent: '#37474F', size: 'normal' },
];

const marqueeItems = [
  'B2B Sourcing Partner', '100% Clean Label', 'Export Compliance Roadmap', 'OEM Manufacturing',
  'Advanced Lyophilization', 'Madhya Pradesh Agri Belt', 'Zero Cold Chain Required', 'Global Container Shipping',
  'Specification Controlled', '24mo Ambient Shelf Life', 'Private Label Ready', 'Sustainable Sourcing',
];

function FreezeChamberCard({ reason, index, defrostProgress, mousePos }) {
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const cardRef = useRef(null);
  const { Icon } = reason;

  // Individual card defrost calculation with a staggered offset
  const cardStart = index * 0.08;
  const cardEnd = Math.min(1.0, cardStart + 0.35);
  // Calculate relative defrost factor for this card (0 = fully frozen, 1 = fully clear)
  let cardDefrost = (defrostProgress - cardStart) / (cardEnd - cardStart);
  cardDefrost = Math.max(0, Math.min(1, cardDefrost));

  // Parallax translation from mouse coords (2-5px maximum)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!cardRef.current || !mousePos) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    // Calculate distance scaling
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 500) {
      const factor = (500 - distance) / 500; // stronger closer to center
      setParallax({
        x: (dx / 500) * 5 * factor,
        y: (dy / 500) * 5 * factor
      });
    } else {
      setParallax({ x: 0, y: 0 });
    }
  }, [mousePos]);

  // Spawn sparkles on hover
  useEffect(() => {
    if (!hovered) return;
    const interval = setInterval(() => {
      setSparkles(prev => [
        ...prev.slice(-12), // keep max 12 sparkles
        {
          id: Math.random(),
          x: 20 + Math.random() * 60, // percentage from left
          y: 70 + Math.random() * 20, // start near bottom/icon
          size: 2 + Math.random() * 3,
          speedY: 0.8 + Math.random() * 1.2,
          opacity: 1,
        }
      ]);
    }, 180);

    return () => clearInterval(interval);
  }, [hovered]);

  // Tick sparkles upward
  useEffect(() => {
    if (sparkles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setSparkles(prev =>
        prev
          .map(s => ({
            ...s,
            y: s.y - s.speedY,
            opacity: s.opacity - 0.015,
          }))
          .filter(s => s.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [sparkles]);

  // Frozen stats style
  const blurVal = (1 - cardDefrost) * 12; // starts blurred at 12px
  const opacityVal = 0.25 + cardDefrost * 0.75; // starts transparent
  const contrastVal = 0.7 + cardDefrost * 0.3; // low contrast initially
  const meltPercent = cardDefrost * 100; // used for top-to-bottom clip path reveal

  // Accent color transitions from icy blue to original vibrant color
  const currentAccent = cardDefrost > 0.8 ? reason.accent : '#29B6F6';
  const displayColor = cardDefrost > 0.65 ? 'var(--text-dark)' : 'rgba(10,10,10,0.4)';

  return (
    <div
      ref={cardRef}
      className="why-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setSparkles([]); }}
      style={{
        gridColumn: reason.size === 'large' ? 'span 2' : 'span 1',
        background: hovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        border: `1px solid ${hovered ? currentAccent + '80' : 'rgba(255, 255, 255, 0.45)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: reason.size === 'large' ? '44px 40px' : '36px 32px',
        cursor: 'default',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        transform: `translate3d(${parallax.x}px, ${parallax.y + (hovered ? -8 : 0)}px, 0)`,
        boxShadow: hovered 
          ? `0 24px 60px ${currentAccent}22, inset 0 0 20px rgba(255,255,255,0.8)` 
          : '0 4px 20px rgba(0,0,0,0.02)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: `blur(${blurVal}px)`,
        WebkitBackdropFilter: `blur(${blurVal}px)`,
      }}
    >
      {/* Dynamic Frost Texture Layer (Dissolves as defrost increases) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(240,248,255,0.45) 50%, rgba(255,255,255,0.1) 100%)',
          clipPath: `polygon(0% ${meltPercent}%, 100% ${meltPercent}%, 100% 100%, 0% 100%)`, // melts top-to-bottom
          opacity: 1 - cardDefrost,
          pointerEvents: 'none',
          zIndex: 4,
          transition: 'clip-path 0.4s ease-out',
        }}
      />

      {/* Condensation water droplets overlay (fades as card defrosts) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 12px 18px, rgba(255,255,255,0.85) 1px, transparent 2px), radial-gradient(circle at 35px 22px, rgba(255,255,255,0.7) 1.5px, transparent 3px), radial-gradient(circle at 75px 50px, rgba(255,255,255,0.8) 1px, transparent 2.5px)',
          backgroundSize: '120px 120px',
          opacity: (1 - cardDefrost) * 0.8,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Sparkles floating up on hover */}
      {sparkles.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            boxShadow: `0 0 10px 2px ${currentAccent}`,
            opacity: s.opacity,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      ))}

      {/* Background card number */}
      <div style={{
        position: 'absolute', bottom: '-10px', right: '20px',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '88px',
        color: hovered ? `${currentAccent}0c` : `${currentAccent}05`,
        lineHeight: 1, userSelect: 'none',
        transition: 'color 0.4s ease',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content wrapper with matching blur & contrast adjustments */}
      <div style={{
        opacity: opacityVal,
        filter: `contrast(${contrastVal})`,
        transition: 'all 0.5s ease',
      }}>
        {/* Icon Container */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: reason.size === 'large' ? '72px' : '60px',
          height: reason.size === 'large' ? '72px' : '60px',
          background: hovered ? `${currentAccent}15` : `${currentAccent}08`,
          borderRadius: '18px', marginBottom: '20px',
          transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: hovered ? `0 0 20px 4px ${currentAccent}25` : 'none',
          position: 'relative',
        }}>
          <Icon size={reason.size === 'large' ? 28 : 24} color={currentAccent} strokeWidth={2} />
          {/* Subtle ice orbit ring on hover */}
          {hovered && (
            <div style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '22px',
              border: `2px dashed ${currentAccent}40`,
              animation: 'spin 10s linear infinite',
            }} />
          )}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: reason.size === 'large' ? '21px' : '17px',
          color: displayColor, marginBottom: '10px',
          lineHeight: 1.2, letterSpacing: '-0.01em',
          transition: 'color 0.4s ease',
        }}>
          {reason.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '14px',
          color: cardDefrost > 0.7 ? 'var(--text-body)' : 'rgba(74,74,74,0.5)',
          lineHeight: 1.7,
          maxWidth: reason.size === 'large' ? '420px' : undefined,
          transition: 'color 0.4s ease',
        }}>
          {reason.desc}
        </p>
      </div>

      {/* Interactive Top Border Highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, ${currentAccent}, ${currentAccent}33)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        borderRadius: '0 0 4px 4px',
      }} />
    </div>
  );
}

export default function WhyBFF() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [defrostProgress, setDefrostProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Scroll defrost listener
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Start defrosting when section top enters bottom of viewport
      const startScroll = sectionTop - viewportHeight;
      // Complete defrosting when the section has scrolled halfway up the viewport
      const endScroll = sectionTop + rect.height * 0.35;
      const currentScroll = window.scrollY;

      let progress = (currentScroll - startScroll) / (endScroll - startScroll);
      progress = Math.max(0.01, Math.min(1.0, progress)); // clamp between 0.01 and 1.0

      setDefrostProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial layout check
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse coordinates for interactive parallax and canvas reactions
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Canvas particle simulation (ice crystals + cold mist)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crystals class definition
    class IceCrystal {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // distribute on start
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = 2 + Math.random() * 5;
        this.speedY = 0.2 + Math.random() * 0.6;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.15 + Math.random() * 0.45;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      }

      update(mouse, defrost) {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;

        // Diminish opacity as chamber defrosts
        const targetOpacity = this.opacity * (1 - defrost * 0.8);

        // React slightly to mouse coordinates
        if (mouse.x && mouse.y) {
          const rect = canvas.getBoundingClientRect();
          const mx = mouse.x - rect.left;
          const my = mouse.y - rect.top;
          const dx = this.x - mx;
          const dy = this.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
          }
        }

        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }

        return targetOpacity;
      }

      draw(opacity) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(235, 245, 255, ${opacity * 0.35})`;

        // Draw crystal hexagon shape
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const rx = Math.cos(angle) * this.size;
          const ry = Math.sin(angle) * this.size;
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    const crystals = Array.from({ length: 32 }, () => new IceCrystal());

    // Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Light beam rays inside chamber
      ctx.fillStyle = `rgba(139, 195, 74, ${0.01 * defrostProgress})`; // pulse rays
      const grad = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.1, 10,
        canvas.width * 0.3, canvas.height * 0.3, canvas.width * 0.8
      );
      grad.addColorStop(0, `rgba(41, 182, 246, ${0.08 * (1 - defrostProgress)})`); // cool blue light
      grad.addColorStop(0.5, `rgba(139, 195, 74, ${0.03 * defrostProgress})`); // warm lime light
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render crystals
      crystals.forEach(c => {
        const op = c.update(mousePos, defrostProgress);
        if (op > 0.01) {
          c.draw(op);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, defrostProgress]);

  // Chamber defrost progress text label
  const frostStateText = 
    defrostProgress < 0.25 ? 'CHAMBER: FROZEN (-50°C)' :
    defrostProgress < 0.55 ? 'CHAMBER: DEFROSTING...' :
    defrostProgress < 0.85 ? 'CHAMBER: RELEASING CONDENSATION' :
    'CHAMBER: PROCESS COMPLETE (98% MOISTURE FREE)';

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{
        background: `linear-gradient(185deg, #F3F8FC 0%, ${defrostProgress > 0.6 ? '#F4F9F4' : '#E8F2FA'} 50%, #F5F9FD 100%)`,
        overflow: 'hidden',
        position: 'relative',
        transition: 'background 0.8s ease',
      }}
      className="section"
    >
      {/* Interactive canvas backdrop (floating crystals & cooling rays) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Global screen frost overlay (dissolves as defrostProgress increases) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(240, 248, 255, 0.08)',
          backdropFilter: `blur(${Math.max(0, (1 - defrostProgress) * 20)}px)`,
          WebkitBackdropFilter: `blur(${Math.max(0, (1 - defrostProgress) * 20)}px)`,
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1 - defrostProgress,
          transition: 'opacity 0.4s ease-out',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        
        {/* Chamber Status Bar Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: defrostProgress > 0.8 ? 'rgba(45,122,58,0.1)' : 'rgba(21,101,192,0.1)',
            border: `1px solid ${defrostProgress > 0.8 ? 'rgba(45,122,58,0.2)' : 'rgba(21,101,192,0.25)'}`,
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '11px',
            color: defrostProgress > 0.8 ? 'var(--green)' : '#1565C0',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'all 0.5s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <Wind size={12} className={defrostProgress < 0.8 ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
            {frostStateText}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div className="section-label">Why Choose BFF</div>
          <h2 className="display-md" style={{ marginBottom: '20px', color: 'var(--text-dark)' }}>
            Nature&apos;s{' '}
            <span className="gradient-text-green">BFF.</span>
          </h2>
          <p className="body-lg" style={{ color: 'var(--text-body)', maxWidth: '520px', margin: '0 auto' }}>
            10 reasons why leading brands, exporters, and chefs choose Bharat Freeze Dried Foods.
          </p>
        </div>

        {/* Responsive Grid of Frozen Cards */}
        <div className="why-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
        }}>
          {reasons.map((r, i) => (
            <FreezeChamberCard 
              key={i} 
              reason={r} 
              index={i} 
              defrostProgress={defrostProgress} 
              mousePos={mousePos}
            />
          ))}
        </div>
      </div>

      {/* Green marquee strip */}
      <div style={{ marginTop: '80px', overflow: 'hidden', background: 'var(--green)', padding: '16px 0', position: 'relative', zIndex: 10 }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 32px',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '13px', letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap',
            }}>
              {item}
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '8px' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) { .why-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .why-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
