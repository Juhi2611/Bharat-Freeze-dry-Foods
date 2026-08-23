import { Send } from 'lucide-react';

export interface PayNowFormValues {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PayNowCheckoutFormProps {
  values: PayNowFormValues;
  onChange: (patch: Partial<PayNowFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onSwitchToQuote: () => void;
}

const inputClass =
  'w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500';

/** Minimal retail checkout — name, contact, shipping address only. */
export function PayNowCheckoutForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  onSwitchToQuote,
}: PayNowCheckoutFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
        <input
          type="text"
          required
          value={values.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Jane Smith"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="jane@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Phone *</label>
          <input
            type="tel"
            required
            value={values.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
      </div>

      <div className="pt-1 border-t border-slate-800">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Shipping Address
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Address Line *</label>
            <input
              type="text"
              required
              value={values.addressLine}
              onChange={(e) => onChange({ addressLine: e.target.value })}
              placeholder="House no., street, locality"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City *</label>
              <input
                type="text"
                required
                value={values.city}
                onChange={(e) => onChange({ city: e.target.value })}
                placeholder="Mumbai"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">State *</label>
              <input
                type="text"
                required
                value={values.state}
                onChange={(e) => onChange({ state: e.target.value })}
                placeholder="Maharashtra"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">PIN / Postal Code *</label>
              <input
                type="text"
                required
                value={values.postalCode}
                onChange={(e) => onChange({ postalCode: e.target.value })}
                placeholder="400001"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Country *</label>
              <input
                type="text"
                required
                value={values.country}
                onChange={(e) => onChange({ country: e.target.value })}
                placeholder="India"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 font-semibold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/25"
      >
        {isSubmitting ? 'Creating Order...' : 'Continue to Payment'} <Send className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onSwitchToQuote}
        className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 underline transition"
      >
        Need bulk/export pricing instead? Request a quote
      </button>
    </form>
  );
}

export function formatPayNowShippingMessage(values: PayNowFormValues): string {
  return [
    'Shipping address:',
    values.addressLine,
    `${values.city}, ${values.state} ${values.postalCode}`.trim(),
    values.country,
  ]
    .filter(Boolean)
    .join('\n');
}
