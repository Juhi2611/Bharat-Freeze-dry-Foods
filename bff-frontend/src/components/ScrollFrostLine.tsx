import { useEffect, useState } from "react";

export function ScrollFrostLine() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 top-0 z-[100] h-[2px] w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-ice-blue via-frost-white to-ice-blue shadow-[0_0_12px_rgba(79,168,216,0.8)] transition-[width] duration-150"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
