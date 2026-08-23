import { Package } from 'lucide-react';
import type { CartItem } from '@/context/CartContext';

interface PayOrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

/** INR-only cart summary for instant Pay Now checkout — no FX. */
export function PayOrderSummary({ items, totalPrice }: PayOrderSummaryProps) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6 space-y-2">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5 text-emerald-400" /> Order Summary ({items.length})
      </div>
      <div className="max-h-24 overflow-y-auto divide-y divide-slate-800/50 pr-1">
        {items.map((item) => (
          <div key={item.id} className="py-1 flex justify-between text-xs text-slate-300">
            <span className="truncate max-w-[280px]">
              {item.name} × {item.quantity}
            </span>
            <span className="font-mono text-emerald-400">
              ₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
        <span>Total (INR)</span>
        <span className="text-emerald-400 font-mono">₹{totalPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
