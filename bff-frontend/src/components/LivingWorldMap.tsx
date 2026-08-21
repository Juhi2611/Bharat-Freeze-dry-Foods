import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

// --- Types & Data Interfaces ---
interface GeoLocation {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lon: number;
  role: string;
  desc: string;
  isOrigin?: boolean;
}

const DESTINATIONS: GeoLocation[] = [
  {
    id: "india",
    name: "India (Origin)",
    flag: "🇮🇳",
    lat: 20.5937,
    lon: 78.9629,
    role: "Primary Export Hub & Facility",
    desc: "Bharat Freeze-Dried Foods Processing HQ",
    isOrigin: true,
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    lat: 38.0,
    lon: -97.0,
    role: "North America Export Network",
    desc: "Premium Freeze-Dried Fruits & Vegetables",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    lat: 56.1304,
    lon: -106.3468,
    role: "Cold-Chain Free Distribution",
    desc: "Bulk Freeze-Dried Pantry Staples",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    lat: 51.1657,
    lon: 10.4515,
    role: "European Union Hub",
    desc: "Industrial & HoReCa Ingredients",
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    lat: 23.4241,
    lon: 53.8478,
    role: "Middle East Logistics Hub",
    desc: "Export-Grade Sealed Pouches & Containers",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    lat: -25.2744,
    lon: 133.7751,
    role: "Oceania Retail Network",
    desc: "Retail & Foodservice Grade Shipments",
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    lat: 36.2048,
    lon: 138.2529,
    role: "Asia-Pacific Hub",
    desc: "High-Purity Functional Ingredients",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    lat: 55.3781,
    lon: -3.436,
    role: "UK & Ireland Logistics",
    desc: "Private Label & Custom Contract Packaging",
  },
];

// Floating Product Badges
const FLOATING_PRODUCTS = [
  { emoji: "🍓", name: "Strawberry Crisp", top: "12%", left: "8%", delay: 0, speed: 4.2 },
  { emoji: "🥭", name: "Alphonso Mango", top: "20%", right: "6%", delay: 0.6, speed: 3.8 },
  { emoji: "🍍", name: "Pineapple Tidbits", top: "58%", left: "10%", delay: 1.2, speed: 4.5 },
  { emoji: "🌽", name: "Sweet Corn Kernels", top: "62%", right: "8%", delay: 0.4, speed: 4.0 },
  { emoji: "🧄", name: "Garlic Flakes", top: "35%", left: "5%", delay: 1.8, speed: 3.5 },
  { emoji: "🌶️", name: "Green Chilli Powder", top: "38%", right: "5%", delay: 1.0, speed: 4.8 },
  { emoji: "🥬", name: "Moringa & Herbs", top: "72%", left: "28%", delay: 1.5, speed: 4.1 },
];

// Floating Glassmorphism Information Cards
const INFO_CARDS = [
  { text: "Global Export", top: "10%", left: "24%" },
  { text: "Private Label", top: "14%", right: "22%" },
  { text: "Bulk Orders", top: "48%", left: "6%" },
  { text: "International Shipping", top: "52%", right: "6%" },
  { text: "Food Grade Packaging", top: "68%", left: "16%" },
  { text: "Worldwide Distribution", top: "70%", right: "18%" },
];

// Major Continent Simplified Polyline Coordinates (Lat, Lon)
const LANDMASS_POLYGONS: number[][][] = [
  // North America
  [
    [70, -165], [72, -140], [60, -135], [58, -140], [52, -130], [48, -125],
    [34, -118], [24, -110], [16, -92], [14, -88], [20, -88], [25, -80],
    [30, -84], [35, -75], [44, -64], [55, -60], [62, -75], [68, -85], [72, -120]
  ],
  // South America
  [
    [10, -75], [5, -78], [-5, -80], [-18, -70], [-34, -72], [-54, -70],
    [-52, -65], [-35, -55], [-23, -42], [-5, -35], [5, -50], [8, -60], [10, -75]
  ],
  // Eurasia (Europe + Asia)
  [
    [70, 25], [70, 70], [70, 140], [60, 170], [45, 140], [35, 140],
    [22, 120], [10, 105], [1, 104], [10, 98], [22, 90], [20, 70],
    [12, 44], [15, 38], [30, 32], [36, 36], [42, 28], [38, 20],
    [36, -5], [44, -9], [48, -4], [54, 5], [58, 10], [62, 20], [70, 25]
  ],
  // India Subcontinent Emphasis
  [
    [32, 75], [28, 70], [22, 70], [15, 74], [8, 77], [8, 80],
    [13, 80], [16, 82], [22, 89], [26, 90], [28, 88], [32, 78]
  ],
  // Africa
  [
    [35, -5], [37, 10], [32, 32], [12, 44], [11, 51], [0, 42],
    [-11, 40], [-25, 32], [-34, 20], [-34, 18], [-18, 12], [5, 9],
    [10, -14], [28, -13], [35, -5]
  ],
  // Australia
  [
    [-12, 130], [-15, 136], [-12, 142], [-24, 153], [-37, 150],
    [-35, 137], [-32, 115], [-22, 114], [-14, 126]
  ],
  // Greenland
  [
    [78, -70], [82, -30], [75, -20], [60, -45], [70, -55]
  ],
  // UK / Ireland
  [
    [58, -6], [56, -2], [51, 1], [50, -5], [54, -5]
  ],
  // Japan
  [
    [44, 144], [40, 140], [34, 135], [31, 130], [36, 137]
  ]
];

// Cargo Ocean Routes (Lat, Lon waypoints)
const OCEAN_ROUTES = [
  // India to Europe / UK via Red Sea & Suez
  [
    [18.9, 72.8], [15.0, 65.0], [12.5, 43.5], [22.0, 38.0], [29.9, 32.5],
    [36.0, 15.0], [36.5, -5.0], [48.0, -5.0], [50.5, 1.0], [53.5, 0.0]
  ],
  // India to East Asia / Japan via Malacca
  [
    [13.0, 80.2], [6.0, 95.0], [1.2, 103.8], [12.0, 110.0], [22.0, 120.0],
    [32.0, 130.0], [35.0, 139.0]
  ],
  // India to UAE / Persian Gulf
  [
    [18.9, 72.8], [20.0, 65.0], [24.0, 58.0], [25.2, 55.3]
  ],
  // India to Australia via Indian Ocean
  [
    [13.0, 80.2], [-5.0, 90.0], [-15.0, 105.0], [-25.0, 115.0], [-33.0, 135.0], [-34.0, 151.0]
  ]
];

export function LivingWorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDestination, setActiveDestination] = useState<GeoLocation | null>(null);
  const [hoveredDestination, setHoveredDestination] = useState<GeoLocation | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Handle Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 12,
      ry: x * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setHoveredDestination(null);
  };

  // Main 3D Orthographic Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0.8;
    let startTime = performance.now();

    // Responsive Canvas Resize
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = Math.max(380, Math.min(520, window.innerHeight * 0.55));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // --- 3D Projection Math Helper ---
    const project3D = (
      lat: number,
      lon: number,
      radius: number,
      cx: number,
      cy: number,
      rotY: number,
      tiltX: number,
      elevation: number = 0
    ) => {
      const radLat = (lat * Math.PI) / 180;
      const radLon = ((lon + rotY) * Math.PI) / 180;
      const radTiltX = (tiltX * Math.PI) / 180;

      const r = radius * (1 + elevation);

      const x0 = r * Math.cos(radLat) * Math.sin(radLon);
      const y0 = -r * Math.sin(radLat);
      const z0 = r * Math.cos(radLat) * Math.cos(radLon);

      const x = x0;
      const y = y0 * Math.cos(radTiltX) - z0 * Math.sin(radTiltX);
      const z = y0 * Math.sin(radTiltX) + z0 * Math.cos(radTiltX);

      return {
        x: cx + x,
        y: cy + y,
        z: z,
        visible: z > -radius * 0.15,
      };
    };

    // Spherical Linear Interpolation (SLERP) for 3D Arcs
    const slerpArc = (
      lat1: number, lon1: number,
      lat2: number, lon2: number,
      t: number,
      arcHeight: number
    ) => {
      const p1Lat = (lat1 * Math.PI) / 180;
      const p1Lon = (lon1 * Math.PI) / 180;
      const p2Lat = (lat2 * Math.PI) / 180;
      const p2Lon = (lon2 * Math.PI) / 180;

      const v1 = [
        Math.cos(p1Lat) * Math.sin(p1Lon),
        -Math.sin(p1Lat),
        Math.cos(p1Lat) * Math.cos(p1Lon),
      ];
      const v2 = [
        Math.cos(p2Lat) * Math.sin(p2Lon),
        -Math.sin(p2Lat),
        Math.cos(p2Lat) * Math.cos(p2Lon),
      ];

      const dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
      const omega = Math.acos(dot);

      let vt = [0, 0, 0];
      if (Math.abs(omega) < 1e-4) {
        vt = v1;
      } else {
        const sinOmega = Math.sin(omega);
        const s1 = Math.sin((1 - t) * omega) / sinOmega;
        const s2 = Math.sin(t * omega) / sinOmega;
        vt = [
          s1 * v1[0] + s2 * v2[0],
          s1 * v1[1] + s2 * v2[1],
          s1 * v1[2] + s2 * v2[2],
        ];
      }

      const len = Math.sqrt(vt[0] * vt[0] + vt[1] * vt[1] + vt[2] * vt[2]);
      const normLat = -Math.asin(vt[1] / len) * (180 / Math.PI);
      const normLon = Math.atan2(vt[0], vt[2]) * (180 / Math.PI);

      const elev = Math.sin(t * Math.PI) * arcHeight;

      return { lat: normLat, lon: normLon, elev };
    };

    // Render Loop
    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      rotationAngle += 0.12; // deg per frame

      const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width * 0.36, height * 0.44, 260);

      ctx.clearRect(0, 0, width, height);

      // --- 1. Outer Atmospheric Haze & Glow ---
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.35);
      outerGlow.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      outerGlow.addColorStop(0.5, "rgba(14, 165, 233, 0.06)");
      outerGlow.addColorStop(1, "rgba(3, 7, 18, 0)");

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // --- 2. Ocean Sphere (Deep Navy Specular Gradient) ---
      const oceanGrad = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.25,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      oceanGrad.addColorStop(0, "#0e1a38");
      oceanGrad.addColorStop(0.6, "#070e24");
      oceanGrad.addColorStop(1, "#030612");

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.shadowColor = "rgba(56, 189, 248, 0.35)";
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();

      // Ocean Ring Border
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // --- 3. Grid Lines (Latitude & Longitude Meridians) ---
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project3D(lat, lon, radius, cx, cy, rotationAngle, tilt.rx);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      for (let lon = -180; lon <= 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = project3D(lat, lon - rotationAngle, radius, cx, cy, rotationAngle, tilt.rx);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // --- 4. Continents & Landmass Vector Polygons ---
      LANDMASS_POLYGONS.forEach((polygon) => {
        ctx.beginPath();
        let first = true;

        polygon.forEach(([lat, lon]) => {
          const pt = project3D(lat, lon, radius, cx, cy, rotationAngle, tilt.rx);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        });

        ctx.closePath();
        ctx.fillStyle = "rgba(56, 189, 248, 0.14)";
        ctx.fill();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Matrix Dot Grid overlay on landmasses
      ctx.fillStyle = "rgba(224, 242, 254, 0.35)";
      for (let lat = -70; lat <= 70; lat += 6) {
        for (let lon = -180; lon <= 180; lon += 8) {
          const pt = project3D(lat, lon, radius, cx, cy, rotationAngle, tilt.rx);
          if (pt.visible && pt.z > radius * 0.1) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // --- 5. Cargo Ocean Ships Animation ---
      OCEAN_ROUTES.forEach((routeWaypoints, routeIdx) => {
        const shipSpeed = 0.03;
        const routeProgress = (elapsed * shipSpeed + routeIdx * 0.25) % 1;
        const totalSegs = routeWaypoints.length - 1;
        const segIdx = Math.floor(routeProgress * totalSegs);
        const segT = (routeProgress * totalSegs) % 1;

        const wp1 = routeWaypoints[segIdx];
        const wp2 = routeWaypoints[Math.min(segIdx + 1, totalSegs)];

        const currLat = wp1[0] + (wp2[0] - wp1[0]) * segT;
        const currLon = wp1[1] + (wp2[1] - wp1[1]) * segT;

        const shipPt = project3D(currLat, currLon, radius, cx, cy, rotationAngle, tilt.rx, 0.005);

        if (shipPt.visible && shipPt.z > 0) {
          ctx.save();
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(shipPt.x, shipPt.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.arc(shipPt.x + 2, shipPt.y - 1, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // --- 6. India Golden Primary Export Origin Hub ---
      const india = DESTINATIONS[0];
      const indiaPt = project3D(india.lat, india.lon, radius, cx, cy, rotationAngle, tilt.rx, 0.01);

      if (indiaPt.visible) {
        const pulse = (elapsed * 2) % 1;
        ctx.save();
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 18;

        ctx.strokeStyle = `rgba(245, 158, 11, ${1 - pulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(indiaPt.x, indiaPt.y, 6 + pulse * 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(indiaPt.x, indiaPt.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(indiaPt.x, indiaPt.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 7. Golden Export Routes & Aircraft Flights ---
      DESTINATIONS.slice(1).forEach((dest, idx) => {
        const arcHeight = 0.24 + (idx % 3) * 0.05;
        const steps = 40;
        const points: { x: number; y: number; z: number; visible: boolean; elev: number }[] = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const arc = slerpArc(india.lat, india.lon, dest.lat, dest.lon, t, arcHeight);
          const pt = project3D(arc.lat, arc.lon, radius, cx, cy, rotationAngle, tilt.rx, arc.elev);
          points.push({ ...pt, elev: arc.elev });
        }

        ctx.save();
        ctx.lineWidth = 1.8;
        const pulseAlpha = 0.4 + 0.4 * Math.sin(elapsed * 2.5 + idx);

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          if (p1.visible && p2.visible && p1.z > -radius * 0.1) {
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            const fadeNearEdge = Math.max(0, Math.min(1, (p1.z + radius * 0.1) / (radius * 0.3)));
            grad.addColorStop(0, `rgba(245, 158, 11, ${pulseAlpha * fadeNearEdge})`);
            grad.addColorStop(1, `rgba(251, 191, 36, ${pulseAlpha * 0.8 * fadeNearEdge})`);

            ctx.strokeStyle = grad;
            ctx.shadowColor = "#f59e0b";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        ctx.restore();

        const flightSpeed = 0.18;
        const flightT = (elapsed * flightSpeed + idx * 0.14) % 1;
        const planeArc = slerpArc(india.lat, india.lon, dest.lat, dest.lon, flightT, arcHeight);
        const planePt = project3D(planeArc.lat, planeArc.lon, radius, cx, cy, rotationAngle, tilt.rx, planeArc.elev);

        const planeNextArc = slerpArc(india.lat, india.lon, dest.lat, dest.lon, Math.min(1, flightT + 0.02), arcHeight);
        const planeNextPt = project3D(planeNextArc.lat, planeNextArc.lon, radius, cx, cy, rotationAngle, tilt.rx, planeNextArc.elev);

        if (planePt.visible && planePt.z > 0) {
          const angle = Math.atan2(planeNextPt.y - planePt.y, planeNextPt.x - planePt.x);
          const planeFade = Math.sin(flightT * Math.PI);

          ctx.save();
          ctx.translate(planePt.x, planePt.y);
          ctx.rotate(angle);

          const trailGrad = ctx.createLinearGradient(-16, 0, 0, 0);
          trailGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
          trailGrad.addColorStop(1, `rgba(251, 191, 36, ${0.9 * planeFade})`);
          ctx.fillStyle = trailGrad;
          ctx.fillRect(-16, -1, 16, 2);

          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(255, 255, 255, ${planeFade})`;

          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(1, -3);
          ctx.lineTo(-2, -8);
          ctx.lineTo(-4, -3);
          ctx.lineTo(-7, -4);
          ctx.lineTo(-6, 0);
          ctx.lineTo(-7, 4);
          ctx.lineTo(-4, 3);
          ctx.lineTo(-2, 8);
          ctx.lineTo(1, 3);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      // --- 8. Destination Markers & Pulsing Pings ---
      DESTINATIONS.forEach((dest) => {
        const pt = project3D(dest.lat, dest.lon, radius, cx, cy, rotationAngle, tilt.rx, 0.015);

        if (pt.visible && pt.z > radius * 0.05) {
          const isIndia = dest.isOrigin;
          const markerColor = isIndia ? "#fbbf24" : "#38bdf8";

          ctx.save();
          ctx.shadowColor = markerColor;
          ctx.shadowBlur = 12;

          const pingTime = (elapsed + (dest.lat + dest.lon)) % 3.5;
          if (pingTime < 1.5) {
            const pingRadius = 4 + pingTime * 10;
            const pingAlpha = (1 - pingTime / 1.5) * 0.8;
            ctx.strokeStyle = isIndia
              ? `rgba(251, 191, 36, ${pingAlpha})`
              : `rgba(56, 189, 248, ${pingAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pingRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = markerColor;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isIndia ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [tilt]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#030712] pt-20 pb-12 sm:pt-24 sm:pb-16 select-none"
    >
      {/* --- Ambient Space Background & Deep Navy Glows --- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[180px]" />
        <div className="absolute left-1/4 top-1/3 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-[160px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[160px]" />

        {/* Twinkling Starfield */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 100px 150px, #38bdf8, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 240px 80px, #fbbf24, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 450px 300px, #ffffff, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 600px 120px, #38bdf8, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 800px 420px, #ffffff, rgba(0,0,0,0))`,
            backgroundSize: "900px 600px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center">

        {/* --- 1. MAIN SCREEN HERO GLOBE (First element, visible above fold without scrolling) --- */}
        <div className="relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[500px] flex items-center justify-center">
          <motion.div
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.2s ease-out",
            }}
            className="relative w-full max-w-3xl h-full flex items-center justify-center"
          >
            <canvas ref={canvasRef} className="block w-full h-auto cursor-grab active:cursor-grabbing" />
          </motion.div>

          {/* --- Floating Product Badges (Around Globe Space) --- */}
          {FLOATING_PRODUCTS.map((prod) => (
            <motion.div
              key={prod.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [-6, 6, -6],
                rotate: [-3, 3, -3],
              }}
              transition={{
                duration: prod.speed,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: prod.delay,
              }}
              style={{
                top: prod.top,
                left: prod.left,
                right: prod.right,
              }}
              className="hidden lg:flex absolute items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-frost-white backdrop-blur-xl shadow-lg hover:border-cyan-400/50 transition-all pointer-events-auto cursor-pointer group"
            >
              <span className="text-base group-hover:scale-125 transition-transform">{prod.emoji}</span>
              <span className="text-slate-200 group-hover:text-cyan-300 transition-colors">{prod.name}</span>
            </motion.div>
          ))}

          {/* --- Floating Glassmorphism Information Cards --- */}
          {INFO_CARDS.map((card, idx) => (
            <motion.div
              key={card.text}
              initial={{ opacity: 0, y: 15 }}
              animate={{
                opacity: 0.9,
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 4 + (idx % 3),
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: idx * 0.4,
              }}
              style={{
                top: card.top,
                left: card.left,
                right: card.right,
              }}
              className="hidden md:flex absolute items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md shadow-xl"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{card.text}</span>
            </motion.div>
          ))}
        </div>

        {/* --- 2. TITLES & DETAILS MOVED BELOW THE GLOBE --- */}
        <div className="text-center max-w-3xl mx-auto mt-6 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 backdrop-blur-md mb-3"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Interactive Global Network</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display text-3xl sm:text-4xl md:text-5xl font-bold text-frost-white tracking-tight leading-tight"
          >
            FROM BHARAT TO <span className="text-gradient-ice">THE WORLD</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-steel-silver font-medium max-w-xl mx-auto"
          >
            Delivering Premium Freeze-Dried Foods Across Global Markets.
          </motion.p>

          {/* Interactive Destination Country Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto px-4 z-20">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setActiveDestination(dest)}
                onMouseEnter={() => setHoveredDestination(dest)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  dest.isOrigin
                    ? "border border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 backdrop-blur-md hover:border-cyan-400/40 hover:text-cyan-300"
                }`}
              >
                <span>{dest.flag}</span>
                <span>{dest.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Tooltip Card Modal */}
          <AnimatePresence>
            {(hoveredDestination || activeDestination) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative mx-auto mt-6 max-w-lg rounded-3xl border border-white/15 bg-slate-950/80 p-6 text-left backdrop-blur-2xl shadow-2xl z-30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {(hoveredDestination || activeDestination)?.flag}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-frost-white flex items-center gap-2">
                        {(hoveredDestination || activeDestination)?.name}
                        {(hoveredDestination || activeDestination)?.isOrigin && (
                          <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] uppercase font-bold text-amber-400">
                            Export Origin
                          </span>
                        )}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                        {(hoveredDestination || activeDestination)?.role}
                      </p>
                    </div>
                  </div>
                  {activeDestination && (
                    <button
                      onClick={() => setActiveDestination(null)}
                      className="text-slate-400 hover:text-white text-sm px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <p className="mt-3 text-sm text-steel-silver leading-relaxed">
                  {(hoveredDestination || activeDestination)?.desc}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <ShieldCheck className="h-4 w-4" /> Export Grade Sealed & Certified
                  </span>
                  <span className="text-cyan-300 font-medium">100% Cold-Chain Free</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Action Button */}
          <div className="mt-8">
            <Link
              to="/inquiry"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-primary-cta px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-frost transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/25"
            >
              <span>Explore B2B Export</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
