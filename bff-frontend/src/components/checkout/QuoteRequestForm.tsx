import { Send } from 'lucide-react';

export interface QuoteFormValues {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  shippingMethod: string;
  incoterm: string;
  paymentTerms: string;
  message: string;
}

interface QuoteRequestFormProps {
  values: QuoteFormValues;
  onChange: (patch: Partial<QuoteFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onSwitchToPay: () => void;
}

const inputClass =
  'w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500';

/** Full B2B/export enquiry form — unchanged from original quote flow. */
export function QuoteRequestForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  onSwitchToPay,
}: QuoteRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
          <input
            type="text"
            required
            value={values.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="BFF Global LLC"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person *</label>
          <input
            type="text"
            required
            value={values.contactPerson}
            onChange={(e) => onChange({ contactPerson: e.target.value })}
            placeholder="Jane Smith"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="jane@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
          <input
            type="text"
            value={values.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 555 123 4567"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Destination Country *</label>
          <input
            type="text"
            required
            value={values.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="Germany"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Shipping Method</label>
          <select
            value={values.shippingMethod}
            onChange={(e) => onChange({ shippingMethod: e.target.value })}
            className={inputClass}
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
            value={values.incoterm}
            onChange={(e) => onChange({ incoterm: e.target.value })}
            className={inputClass}
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
            value={values.paymentTerms}
            onChange={(e) => onChange({ paymentTerms: e.target.value })}
            className={inputClass}
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
          value={values.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Specify packaging sizes, private label requirements, or target delivery date..."
          className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 font-semibold rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 transition bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25"
      >
        {isSubmitting ? 'Submitting Quote Request...' : 'Submit Quotation Request'}{' '}
        <Send className="w-4 h-4" />
      </button>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onSwitchToPay}
        className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 underline transition"
      >
        Ready to pay now? Switch to secure checkout
      </button>
    </form>
  );
}
