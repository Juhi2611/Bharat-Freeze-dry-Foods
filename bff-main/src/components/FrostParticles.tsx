import { useMemo } from "react";

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999 + 1) * 10000;
  return x - Math.floor(x);
}

export function FrostParticles({ count = 24, className = "" }: { count?: number; className?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const r1 = pseudoRandom(i * 6 + 1);
        const r2 = pseudoRandom(i * 6 + 2);
        const r3 = pseudoRandom(i * 6 + 3);
        const r4 = pseudoRandom(i * 6 + 4);
        const r5 = pseudoRandom(i * 6 + 5);
        const r6 = pseudoRandom(i * 6 + 6);

        return {
          left: `${(r1 * 100).toFixed(2)}%`,
          size: +(2 + r2 * 5).toFixed(2),
          dur: `${(14 + r3 * 22).toFixed(2)}s`,
          delay: `${(-r4 * 20).toFixed(2)}s`,
          tx: `${((r5 - 0.5) * 80).toFixed(2)}px`,
          opacity: +(0.2 + r6 * 0.5).toFixed(2),
          key: i,
        };
      }),
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
