import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Send, CheckCircle, Package, ShieldCheck, FileText } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, clearCart, totalPrice } = useCart();
  const { user } = useAuth();

  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [contactPerson, setContactPerson] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(user?.country || 'India');
  const [shippingMethod, setShippingMethod] = useState('sea_fcl');
  const [incoterm, setIncoterm] = useState('FOB');
  const [paymentTerms, setPaymentTerms] = useState('advance_tt');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const productNames = items.map((i) => `${i.name} (${i.quantity}x ${i.pack_size || 'Retail'})`);

    const payload = {
      company_name: companyName,
      contact_person: contactPerson,
      email,
      phone,
      country,
      interested_products: productNames,
      quantity_requirement: `${items.reduce((acc, curr) => acc + curr.quantity, 0)} units total`,
      shipping_method: shippingMethod,
      incoterm,
      payment_terms: paymentTerms,
      message,
    };

    try {
      const res: any = await api.submitEnquiry(payload);
      setSubmittedCode(res.enquiry_code || 'ENQ-SUCCESS');
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedCode(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-xl bg-[#0F172A] border border-sky-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedCode ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/30 rounded-full flex items-center justify-center mx-auto text-sky-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Quotation Request Received!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your official quotation request reference code is{' '}
              <span className="font-mono text-sky-400 font-bold">{submittedCode}</span>. Our export sales manager will reach out within 12 business hours.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-sm transition"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" /> B2B Export Quotation Request
              </div>
              <h2 className="text-2xl font-bold text-white">Request Factory Direct Quote</h2>
              <p className="text-xs text-slate-400 mt-1">
                Submitting {items.length} selected product line(s) for customized volume pricing & shipping estimate.
              </p>
            </div>

            {/* Selected Products Summary */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 mb-6 space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-sky-400" /> Selected Items ({items.length})
              </div>
              <div className="max-h-24 overflow-y-auto divide-y divide-slate-800/50 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-1 flex justify-between text-xs text-slate-300">
                    <span className="truncate max-w-[280px]">{item.name} × {item.quantity}</span>
                    <span className="font-mono text-sky-400">₹{(item.price_inr * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold text-white">
                <span>Estimated Value</span>
                <span className="text-sky-400 font-mono">₹{totalPrice.toLocaleString('en-IN')} (~${(totalPrice / 85).toFixed(2)} USD)</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="BFF Global LLC"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Destination Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Germany"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Shipping Method</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="sea_fcl">Sea FCL (Full Container)</option>
                    <option value="sea_lcl">Sea LCL (Shared Box)</option>
                    <option value="air">Air Freight</option>
                    <option value="courier">Courier Express Sample</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Incoterm</label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Term</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="advance_tt">Advance TT Transfer</option>
                    <option value="lc_sight">Letter of Credit (LC)</option>
                    <option value="partial_advance">Partial Advance + Balance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify packaging sizes, private label requirements, or target delivery date..."
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition"
              >
                {isSubmitting ? 'Sending Request...' : 'Submit Quotation Request'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
