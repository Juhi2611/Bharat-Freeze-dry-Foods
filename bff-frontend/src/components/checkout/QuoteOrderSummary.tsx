import { Package } from 'lucide-react';
import { useFxRate } from '@/hooks/useFxRate';
import type { CartItem } from '@/context/CartContext';

interface QuoteOrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

/** B2B quote summary with indicative USD conversion. */
export function QuoteOrderSummary({ items, totalPrice }: QuoteOrderSummaryProps) {
  const { inrPerUsd, inrToUsd, meta } = useFxRate();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6 space-y-2">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5 text-sky-400" /> Selected Items ({items.length})
      </div>
      <div className="max-h-24 overflow-y-auto divide-y divide-slate-800/50 pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-1 flex justify-between text-xs text-slate-300">
            <span className="truncate max-w-[280px]">
              {item.name} × {item.quantity}
            </span>
            <span className="font-mono text-sky-400">
              ₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold text-white">
        <span>Estimated Value (INR)</span>
        <span className="text-sky-400 font-mono">₹{totalPrice.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>
          Approx. USD
          {meta.fallback ? ' (fallback' : ' (live'}
          {meta.cached ? ', cached' : ''} ~₹{inrPerUsd.toFixed(2)}/USD)
        </span>
        <span className="font-mono text-sky-400/90">~${inrToUsd(totalPrice).toFixed(2)}</span>
      </div>
      <p className="text-[10px] text-slate-500 italic">
        * Indicative FX{meta.source ? ` via ${meta.source}` : ''} — not a binding quote. Final pricing
        depends on export FOB/CIF incoterm & order volume.
      </p>
    </div>
  );
}
