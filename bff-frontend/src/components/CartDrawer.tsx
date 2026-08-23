import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, FileText, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    openCheckout,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay fixed inset-0 z-[10000] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex w-full max-w-full sm:w-auto sm:pl-10">
        <div className="cart-drawer-panel flex h-full w-full flex-col justify-between border-l border-sky-500/20 bg-[#0F172A] text-slate-100 shadow-2xl sm:w-screen sm:max-w-md">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Selected Sample / Cart Items</h3>
                <p className="text-xs text-slate-400">{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-slate-300 font-medium text-sm">Your sample cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Add freeze-dried ingredients or retail products to request custom bulk quotes & export samples.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex gap-4 items-center hover:border-sky-500/30 transition group"
                >
                  <img
                    src={item.pack_image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-lg bg-slate-950/80 p-2 border border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-100 truncate">{item.name}</h4>
                    <p className="text-xs text-sky-400 font-mono mt-0.5">{item.pack_size || 'Retail Pouch'}</p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">
                      ₹{item.price_inr.toLocaleString('en-IN')} <span className="text-[10px] text-slate-500">/ unit</span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono text-slate-200 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between text-sm">
                  <span>Total (INR)</span>
                  <span className="font-bold text-slate-100">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    openCheckout('pay');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.99]"
                >
                  <CreditCard className="w-4 h-4" /> Pay Now
                </button>
                <p className="text-[10px] text-slate-500 text-center">
                  Instant order — secure payment via Razorpay
                </p>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    openCheckout('quote');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl text-sm border border-slate-600 flex items-center justify-center gap-2 transition"
                >
                  <FileText className="w-4 h-4" /> Request Quote
                </button>
                <p className="text-[10px] text-slate-500 text-center">
                  Bulk / export pricing — no payment required
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Direct from factory — no middlemen
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
