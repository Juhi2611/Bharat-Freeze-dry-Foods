import { useMemo } from "react";

export function FrostParticles({ count = 24, className = "" }: { count?: number; className?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 5,
        dur: `${14 + Math.random() * 22}s`,
        delay: `${-Math.random() * 20}s`,
        tx: `${(Math.random() - 0.5) * 80}px`,
        opacity: 0.2 + Math.random() * 0.5,
        key: i,
      })),
    [count],
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((p) => (
        <span
          key={p.key}
          className="animate-drift absolute bottom-[-20px] rounded-full bg-ice-blue blur-[1px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            // @ts-expect-error CSS var
            "--dur": p.dur,
            "--tx": p.tx,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
