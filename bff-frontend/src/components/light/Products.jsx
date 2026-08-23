import { useState } from 'react';
import { Leaf, Minus, Plus, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/whatsapp';

const isVideoUrl = (url) => typeof url === 'string' && (/\.(mp4|webm|ogv|mov)(\?.*)?$/i.test(url) || url.includes('/video/') || url.startsWith('data:video/'));

function LightProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [qty, setQty] = useState(1);
  const waLink = buildWhatsAppLink(product.name, qty);

  const isVideo = isVideoUrl(product.ingredientImage);
  const packDisplayImg = product.packImage;
  const ingDisplayImg = product.ingredientImage;

  return <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => setHovered((value) => !value)} style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: `1.5px solid ${hovered ? product.accent : 'var(--border-light)'}`, overflow: 'hidden', boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.12)' : 'var(--shadow-sm)', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer' }}>
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', overflow: 'hidden', background: '#0F1A28' }}>
      <img src={packDisplayImg} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'all 0.5s ease' }} />
      {isVideo ? (
        <video src={ingDisplayImg} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.08)', transition: 'all 0.5s ease' }} />
      ) : (
        <img src={ingDisplayImg} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.08)', transition: 'all 0.5s ease' }} />
      )}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5 }}>{product.organic && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, background: '#2D7A3A', color: 'white', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}><Leaf size={11} /> Organic</span>}</div>{product.whiteLabel && <span style={{ position: 'absolute', top: 12, right: 12, zIndex: 5, padding: '4px 10px', borderRadius: 9999, background: 'rgba(0,0,0,0.65)', color: 'white', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>White-label</span>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px 16px', background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)', display: 'flex', flexDirection: 'column', gap: 10, opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.3s ease', zIndex: 10 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-dark)', textTransform: 'uppercase' }}>Select Quantity:</span><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 8px', borderRadius: 9999, background: 'var(--light-grey)' }}><button onClick={(event) => { event.stopPropagation(); setQty((value) => Math.max(1, value - 1)); }}><Minus size={13} /></button><span>{qty}</span><button onClick={(event) => { event.stopPropagation(); setQty((value) => Math.min(20, value + 1)); }}><Plus size={13} /></button></div></div><a href={waLink} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="btn btn-whatsapp" style={{ padding: 10, fontSize: 12, justifyContent: 'center' }}><MessageCircle size={14} /> Inquire on WhatsApp</a></div>
    </div><div style={{ padding: 20, flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ fontWeight: 800, fontSize: 10, color: product.accent, textTransform: 'uppercase' }}>{product.category}</span><span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-dark)' }}>{product.price}</span></div><h3 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-dark)', marginBottom: 6 }}>{product.name}</h3><p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.5 }}>{product.blurb}</p></div>
  </div>;
}

export default function Products({ products = [], categories = [], isLoading = false, error = null }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory);
  if (isLoading) return <section style={{ padding: '64px 0', background: 'white' }}><div className="container"><p>Loading products...</p></div></section>;
  if (error) return <section style={{ padding: '64px 0', background: 'white' }}><div className="container"><p style={{ color: 'var(--red)' }}>{error}</p></div></section>;
  return <div><div style={{ position: 'sticky', top: 72, zIndex: 30, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)', padding: '14px 0' }}><div className="container" style={{ overflowX: 'auto' }}><div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>{['All', ...categories.map((category) => category.name)].map((category) => <button key={category} onClick={() => setActiveCategory(category)} style={{ padding: '8px 18px', borderRadius: 9999, border: `1.5px solid ${activeCategory === category ? 'var(--green)' : 'var(--border-light)'}`, background: activeCategory === category ? 'var(--green)' : 'white', color: activeCategory === category ? 'white' : 'var(--text-dark)', fontWeight: 700, fontSize: 12 }}>{category}</button>)}</div></div></div><div style={{ padding: '64px 0', background: 'white' }}><div className="container"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>{filtered.map((product) => <LightProductCard key={product.id} product={product} />)}</div>{filtered.length === 0 && <p style={{ padding: '64px 0', textAlign: 'center' }}>No products available right now.</p>}</div></div></div>;
}
