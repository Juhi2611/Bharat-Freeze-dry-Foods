import { useEffect, useRef, useState } from 'react';
import {
  Sprout, Tractor, HeartPulse, ShieldOff, CalendarCheck,
  PlaneTakeoff, Tag, FlaskConical, Leaf, Settings2, Wind,
} from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
  { Icon: Sprout, title: 'Central Indian Agri Belt', desc: 'Located in Madhya Pradesh, sourcing onion, garlic, potato, tomato, fruits, and herbs directly at peak harvest for unmatched cost efficiency.', accent: '#76caff', size: 'large' },
  { Icon: Tractor, title: 'Direct Sourcing Traceability', desc: 'Direct partnerships with local growers ensuring supply security and full harvest traceability.', accent: '#4ade80', size: 'normal' },
  { Icon: HeartPulse, title: '97% Nutrient Retention', desc: 'Advanced low-temperature vacuum drying preserves natural cell structure, colour, aroma, and bioactive elements.', accent: '#a78bfa', size: 'normal' },
  { Icon: ShieldOff, title: '100% Clean Label', desc: 'Completely free from additives, chemical preservatives, or added sodium — simple, pure ingredients.', accent: '#f87171', size: 'large' },
  { Icon: CalendarCheck, title: '24-Month Ambient Life', desc: 'Stable room-temperature shelf life eliminates cold chain logistics and storage losses for global distributors.', accent: '#fb923c', size: 'normal' },
  { Icon: PlaneTakeoff, title: 'Export-Optimised Freight', desc: 'Up to 90% weight reduction allows maximum payload utilisation in dry shipping containers.', accent: '#76caff', size: 'normal' },
  { Icon: Tag, title: 'OEM & Private Label Services', desc: 'Turnkey custom packaging, recipe formulation, and branding options from bulk bags to retail pouches.', accent: '#c084fc', size: 'large' },
  { Icon: FlaskConical, title: 'Industrial Lyophilizers', desc: 'State-of-the-art freeze-drying chambers with micro-climatic control for uniform, stable moisture extraction.', accent: '#22d3ee', size: 'normal' },
  { Icon: Leaf, title: 'Zero-Waste Institutional Sourcing', desc: 'No preparation waste, no peel loss, and 100% yield recovery for catering chains and noodle brands.', accent: '#4ade80', size: 'normal' },
  { Icon: Settings2, title: 'Custom Particle Sizes', desc: 'Flexible processing formats: whole, slices, dices, flakes, granules, or fine functional powders.', accent: '#a855f7', size: 'normal' },
];

const marqueeItems = [
  'B2B Sourcing Partner', '100% Clean Label', 'Export Compliance Roadmap', 'OEM Manufacturing',
  'Advanced Lyophilization', 'Madhya Pradesh Agri Belt', 'Zero Cold Chain Required', 'Global Container Shipping',
  'Specification Controlled', '24mo Ambient Shelf Life', 'Private Label Ready', 'Sustainable Sourcing',
];

function FreezeChamberCard({ reason, index, defrostProgress, mousePos }: any) {
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState<any[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = reason.Icon;

  const cardStart = index * 0.08;
  const cardEnd = Math.min(1.0, cardStart + 0.35);
  let cardDefrost = (defrostProgress - cardStart) / (cardEnd - cardStart);
  cardDefrost = Math.max(0, Math.min(1, cardDefrost));

  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!cardRef.current || !mousePos) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 500) {
      const factor = (500 - distance) / 500;
      setParallax({ x: (dx / 500) * 5 * factor, y: (dy / 500) * 5 * factor });
    } else {
      setParallax({ x: 0, y: 0 });
    }
  }, [mousePos]);

  useEffect(() => {
    if (!hovered) return;
    const interval = setInterval(() => {
      setSparkles(prev => [
        ...prev.slice(-12),
        {
          id: Math.random(),
          x: 20 + Math.random() * 60,
          y: 70 + Math.random() * 20,
          size: 2 + Math.random() * 3,
          speedY: 0.8 + Math.random() * 1.2,
          opacity: 1,
        }
      ]);
    }, 180);
    return () => clearInterval(interval);
  }, [hovered]);

  useEffect(() => {
    if (sparkles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setSparkles(prev =>
        prev
          .map(s => ({ ...s, y: s.y - s.speedY, opacity: s.opacity - 0.015 }))
          .filter(s => s.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [sparkles]);

  const blurVal = (1 - cardDefrost) * 12;
  const opacityVal = 0.35 + cardDefrost * 0.65;
  const meltPercent = cardDefrost * 100;
  const currentAccent = cardDefrost > 0.8 ? reason.accent : '#76caff';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setSparkles([]); }}
      className={`${reason.size === 'large' ? 'col-span-1 lg:col-span-2' : 'col-span-1'} group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500`}
      style={{
        background: hovered ? 'rgba(15, 23, 42, 0.90)' : 'rgba(10, 16, 26, 0.70)',
        borderColor: hovered ? `${currentAccent}80` : 'rgba(255, 255, 255, 0.08)',
        padding: reason.size === 'large' ? '40px 36px' : '32px 28px',
        transform: `translate3d(${parallax.x}px, ${parallax.y + (hovered ? -6 : 0)}px, 0)`,
        boxShadow: hovered ? `0 24px 60px ${currentAccent}25` : 'none',
      }}
    >
      <div 
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(118,202,255,0.05) 50%, transparent 100%)',
          clipPath: `polygon(0% ${meltPercent}%, 100% ${meltPercent}%, 100% 100%, 0% 100%)`,
          opacity: 1 - cardDefrost,
          pointerEvents: 'none', zIndex: 4,
        }}
      />

      {sparkles.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size, borderRadius: '50%',
            background: 'white', boxShadow: `0 0 10px 2px ${currentAccent}`,
            opacity: s.opacity, pointerEvents: 'none', zIndex: 5,
          }}
        />
      ))}

      <div style={{ position: 'absolute', bottom: '-10px', right: '20px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '88px', color: `${currentAccent}12`, userSelect: 'none' }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      <div style={{ opacity: opacityVal, filter: `blur(${blurVal * 0.2}px)` }}>
        <div 
          className="mb-5 flex items-center justify-center rounded-2xl border transition-all duration-500"
          style={{
            width: reason.size === 'large' ? '68px' : '56px',
            height: reason.size === 'large' ? '68px' : '56px',
            background: hovered ? `${currentAccent}25` : `${currentAccent}15`,
            borderColor: `${currentAccent}30`,
            color: currentAccent,
          }}
        >
          <Icon size={reason.size === 'large' ? 28 : 24} />
        </div>

        <h3 className="text-xl font-bold text-frost-white mb-2 leading-snug">{reason.title}</h3>
        <p className="text-sm text-steel-silver leading-relaxed" style={{ maxWidth: reason.size === 'large' ? '420px' : undefined }}>{reason.desc}</p>
      </div>
    </div>
  );
}

export function WhyBFFDark() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [defrostProgress, setDefrostProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const viewportHeight = window.innerHeight;
      const startScroll = sectionTop - viewportHeight;
      const endScroll = sectionTop + rect.height * 0.35;
      const currentScroll = window.scrollY;

      let progress = (currentScroll - startScroll) / (endScroll - startScroll);
      progress = Math.max(0.01, Math.min(1.0, progress));
      setDefrostProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class IceCrystal {
      x: number = 0; y: number = 0; size: number = 0; speedY: number = 0; speedX: number = 0; opacity: number = 0; rotation: number = 0; rotSpeed: number = 0;
      constructor() {
        this.reset();
        this.y = Math.random() * (canvas?.height || 500);
      }
      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = 2 + Math.random() * 5;
        this.speedY = 0.2 + Math.random() * 0.6;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.15 + Math.random() * 0.45;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      }
      update(mouse: { x: number; y: number }, defrost: number) {
        if (!canvas) return 0;
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        const targetOpacity = this.opacity * (1 - defrost * 0.8);

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
      draw(opacity: number) {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(118, 202, 255, ${opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(118, 202, 255, ${opacity * 0.15})`;

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

    const crystals = Array.from({ length: 32 }, () => new IceCrystal());

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      crystals.forEach(c => {
        const op = c.update(mousePos, defrostProgress);
        if (op > 0.01) c.draw(op);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, defrostProgress]);

  const frostStateText = 
    defrostProgress < 0.25 ? 'CHAMBER: FROZEN (-50°C)' :
    defrostProgress < 0.55 ? 'CHAMBER: DEFROSTING...' :
    defrostProgress < 0.85 ? 'CHAMBER: RELEASING CONDENSATION' :
    'CHAMBER: PROCESS COMPLETE (98% MOISTURE FREE)';

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative bg-deep-navy py-20 md:py-28 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-1 w-full h-full" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        {/* Status indicator */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-ice-blue/30 bg-ice-blue/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-ice-blue backdrop-blur-md">
            <Wind className="h-3.5 w-3.5 animate-spin" />
            {frostStateText}
          </div>
        </div>

        <div className="mb-14 text-center">
          <p className="text-eyebrow mb-4">Why Choose BFF</p>
          <h2 className="text-display text-3xl text-frost-white sm:text-5xl">
            Nature&apos;s <span className="text-gradient-ice italic font-medium">BFF.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-steel-silver text-base">
            10 reasons why leading brands, exporters, and chefs choose Bharat Freeze Dried Foods.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <FreezeChamberCard key={i} reason={r} index={i} defrostProgress={defrostProgress} mousePos={mousePos} />
          ))}
        </div>
      </div>

      {/* Marquee Strip */}
      <div className="mt-20 overflow-hidden bg-ice-blue/10 border-y border-ice-blue/20 py-4">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-8 font-bold text-xs uppercase tracking-widest text-frost-white">
              {item} <span className="text-ice-blue text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
