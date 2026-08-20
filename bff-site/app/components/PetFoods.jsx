'use client';
import { useState } from 'react';
import { PawPrint, Minus, Plus, MessageCircle } from 'lucide-react';

export const PET_FOODS = [
  {
    id: 'dog-chicken',
    name: 'Chicken & Rice',
    category: 'Pet Food',
    packImage: '/images/pet_treats.png',
    ingredientImage: '/images/pet_veg_treats.png',
    accent: '#D97B3D',
    price: '₹599',
    blurb: "Your Dog's BFF — real chicken & rice, freeze-dried, zero fillers.",
  },
  {
    id: 'dog-liver',
    name: 'Vegetable & Liver',
    category: 'Pet Food',
    packImage: '/images/pet_veg_treats.png',
    ingredientImage: '/images/pet_treats.png',
    accent: '#8B7F3E',
    price: '₹579',
    blurb: "Iron-rich liver with garden vegetables — a dog's dream, preserved.",
  },
  {
    id: 'dog-salmon',
    name: 'Salmon & Sweet Potato',
    category: 'Pet Food',
    packImage: '/images/pet_treats.png',
    ingredientImage: '/images/pet_veg_treats.png',
    accent: '#E89B8A',
    price: '₹649',
    blurb: 'Omega-rich salmon with sweet potato — grain-free, freeze-dried.',
  },
];

function LightPetCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [qty, setQty] = useState(1);

  const waLink = `https://wa.me/919993377038?text=${encodeURIComponent(
    `Hi BFF, I would like to inquire about Pet Food: ${product.name} (Quantity: ${qty}).`
  )}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: `1.5px solid ${hovered ? product.accent : 'var(--border-light)'}`,
        overflow: 'hidden',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : 'var(--shadow-sm)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Image Stack with Flip Reveal */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: 'var(--light-grey)' }}>
        <img
          src={product.packImage}
          alt={product.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'all 0.5s ease',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        <img
          src={product.ingredientImage}
          alt={product.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'all 0.5s ease',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(1.08)',
          }}
        />

        {/* Badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 5,
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px', borderRadius: '9999px',
          background: 'rgba(217,123,61,0.90)', color: 'white',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          fontFamily: 'var(--font-display)',
        }}>
          <PawPrint size={11} /> For Pets
        </div>

        {/* Hover overlay actions */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 16px 16px',
          background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 70%, transparent 100%)',
          display: 'flex', flexDirection: 'column', gap: '10px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.3s ease',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>
              Select Quantity:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--light-grey)', padding: '2px 8px', borderRadius: '9999px', border: '1px solid var(--border-light)' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setQty((q) => Math.max(1, q - 1)); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
              >
                <Minus size={13} color="var(--text-dark)" />
              </button>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--text-dark)', minWidth: '16px', textAlign: 'center' }}>{qty}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setQty((q) => Math.min(20, q + 1)); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
              >
                <Plus size={13} color="var(--text-dark)" />
              </button>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-whatsapp"
            style={{ padding: '10px', fontSize: '12px', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}
          >
            <MessageCircle size={14} /> Inquire on WhatsApp
          </a>
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '10px', color: product.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {product.category}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--text-dark)' }}>
              {product.price}
            </span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--text-dark)', marginBottom: '6px' }}>
            {product.name}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.5 }}>
            {product.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PetFoods() {
  return (
    <section style={{ padding: '64px 0', background: 'white' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {PET_FOODS.map((p) => (
            <LightPetCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
