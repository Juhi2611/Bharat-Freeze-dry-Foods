import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe2,
  Briefcase,
  Package,
  Boxes,
  Tag,
  CheckSquare,
  Send,
  Loader2,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

export interface B2BEnquiryFormData {
  companyName: string;
  contactPerson: string;
  businessEmail: string;
  phoneNumber: string;
  country: string;
  industry: string;
  interestedProducts: string[];
  estimatedQuantity: string;
  privateLabelRequired: string;
  packagingPreference: string;
  targetMarket: string;
  additionalRequirements: string;
  agreeToTerms: boolean;
}

const INITIAL_FORM_DATA: B2BEnquiryFormData = {
  companyName: "",
  contactPerson: "",
  businessEmail: "",
  phoneNumber: "",
  country: "",
  industry: "",
  interestedProducts: [],
  estimatedQuantity: "1 - 5 Tons",
  privateLabelRequired: "No",
  packagingPreference: "Bulk",
  targetMarket: "",
  additionalRequirements: "",
  agreeToTerms: false,
};

const PRODUCT_OPTIONS = [
  "Freeze-Dried Fruits",
  "Freeze-Dried Vegetables",
  "Gravy & Sauce Bases",
  "Freeze-Dried Spices",
  "Superfood Powders",
  "Pre-Cooked Ready Meals",
  "Pet Food Ingredients",
  "Custom Blends / Ingredients",
];

const EXPORT_HIGHLIGHTS = [
  "100% Export Grade Sourcing & Full Traceability",
  "Zero Cold Chain Needed — 2-Year Shelf Life",
  "FCL & LCL Container-Load Shipping Worldwide",
  "HACCP, ISO 22000 & FSSAI Export Certified",
  "Custom Private Label & Physical Pouch Design",
];

const TRUST_BADGES = [
  { label: "ISO 22000 Certified", icon: ShieldCheck },
  { label: "HACCP Aligned", icon: Award },
  { label: "Global Compliance", icon: Globe2 },
  { label: "Custom OEM Packaging", icon: FileCheck2 },
];

export function B2BEnquiryForm() {
  const [formData, setFormData] = useState<B2BEnquiryFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleProduct = (product: string) => {
    setFormData((prev) => {
      const exists = prev.interestedProducts.includes(product);
      return {
        ...prev,
        interestedProducts: exists
          ? prev.interestedProducts.filter((p) => p !== product)
          : [...prev.interestedProducts, product],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast.error("Terms Agreement Required", {
        description: "Please check the agreement box before submitting.",
      });
      return;
    }

    if (formData.interestedProducts.length === 0) {
      toast.error("Product Selection Required", {
        description: "Please select at least one interested product category.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay for smooth UX (Backend-ready structure)
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log(">>> B2B Export Enquiry Submitted:", formData);

    toast.success("Enquiry Sent Successfully!", {
      description:
        "Thank you! Our global export specialists will review your requirements and reach out within 24 hours.",
    });

    setFormData(INITIAL_FORM_DATA);
    setIsSubmitting(false);
  };

  return (
    <section id="enquiry-form" className="relative bg-background py-20 md:py-32">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-ice-blue/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-[#D97B3D]/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-12 text-center md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-eyebrow mb-3"
          >
            Global Trade & Export
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-display text-3xl text-frost-white sm:text-5xl md:text-6xl"
          >
            Start Your <span className="text-gradient-ice">Global Partnership</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-steel-silver"
          >
            Tell us about your requirements and our export specialists will get back to you within 24 hours.
          </motion.p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN: Overview & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="rounded-3xl border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-ice-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ice-blue">
                <Sparkles className="h-3.5 w-3.5" /> Direct Manufacturer
              </span>
              <h3 className="mt-4 text-2xl font-bold text-frost-white sm:text-3xl">
                Export Infrastructure Designed For Scale
              </h3>
              <p className="mt-4 leading-relaxed text-steel-silver text-sm sm:text-base">
                Whether you need bulk container-load raw materials, custom ingredient cuts, or full private-label turnkey solutions, Bharat Freeze Dry Foods delivers export-grade excellence from India to over 25+ nations.
              </p>

              {/* Highlights List */}
              <div className="mt-8 space-y-3">
                {EXPORT_HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ice-blue" />
                    <span className="text-sm font-medium text-frost-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Globe / World Graphic Illustration */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-deep-navy via-card/50 to-deep-navy p-6 sm:p-8 text-center">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-ice-blue/10 blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-ice-blue/30 bg-ice-blue/10 text-ice-blue shadow-frost">
                  <Globe2 className="h-8 w-8 animate-spin-slow" />
                </div>
                <h4 className="text-lg font-bold text-frost-white">Worldwide Cold-Chain-Free Shipping</h4>
                <p className="mt-2 text-xs sm:text-sm text-steel-silver">
                  98% water weight removed during sublimation allows for ambient, lightweight freight options via ocean container or air cargo.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {TRUST_BADGES.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-md"
                >
                  <badge.icon className="h-5 w-5 text-ice-blue shrink-0" />
                  <span className="text-xs font-semibold text-frost-white/90">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Glassmorphism Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="relative overflow-hidden rounded-[24px] border border-white/12 bg-card/70 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-ice-blue/20 to-transparent blur-3xl pointer-events-none" />

              <div className="mb-8 border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold text-frost-white sm:text-2xl flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-ice-blue" /> Export Enquiry Form
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-steel-silver">
                  Fields marked with <span className="text-red-400">*</span> are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name & Contact Person */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleTextChange}
                        placeholder="e.g. Apex Global Foods LLC"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Contact Person <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleTextChange}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Business Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <input
                        type="email"
                        name="businessEmail"
                        required
                        value={formData.businessEmail}
                        onChange={handleTextChange}
                        placeholder="sarah@apexglobal.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleTextChange}
                        placeholder="+1 (555) 019-2834"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      />
                    </div>
                  </div>
                </div>

                {/* Country & Industry */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Globe2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <input
                        type="text"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleTextChange}
                        placeholder="e.g. United States, Germany, UAE"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Industry <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <select
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleTextChange}
                        className="w-full rounded-xl border border-white/10 bg-deep-navy py-3 pl-10 pr-4 text-sm text-frost-white transition-all focus:border-ice-blue focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      >
                        <option value="">Select your industry</option>
                        <option value="Food Manufacturer">Food Manufacturer</option>
                        <option value="Hotels & Restaurants">Hotels & Restaurants (HoReCa)</option>
                        <option value="Quick Service Restaurants">Quick Service Restaurants (QSR)</option>
                        <option value="Retail & Supermarkets">Retail & Supermarkets</option>
                        <option value="Private Label Brand">Private Label Brand</option>
                        <option value="Export Distributor">Export Distributor / Importer</option>
                        <option value="Military & Defence">Military & Defence Food Supply</option>
                        <option value="Emergency Relief">Emergency Relief & Disaster Food</option>
                        <option value="Travel & Aviation">Travel & Aviation Catering</option>
                        <option value="Health & Wellness">Health & Wellness Brand</option>
                        <option value="Pet Food Manufacturer">Pet Food Manufacturer</option>
                        <option value="Outdoor & Adventure">Outdoor & Adventure Food</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Interested Products (Multi-select pills) */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                    Interested Products <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_OPTIONS.map((prod) => {
                      const selected = formData.interestedProducts.includes(prod);
                      return (
                        <button
                          key={prod}
                          type="button"
                          onClick={() => toggleProduct(prod)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                            selected
                              ? "border-ice-blue bg-ice-blue text-deep-navy shadow-frost"
                              : "border-white/10 bg-white/5 text-frost-white/80 hover:border-white/30 hover:text-frost-white"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {prod}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & Private Label & Packaging */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Estimated Quantity
                    </label>
                    <div className="relative">
                      <Boxes className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <select
                        name="estimatedQuantity"
                        value={formData.estimatedQuantity}
                        onChange={handleTextChange}
                        className="w-full rounded-xl border border-white/10 bg-deep-navy py-3 pl-10 pr-4 text-xs sm:text-sm text-frost-white transition-all focus:border-ice-blue focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      >
                        <option value="< 500 kg">&lt; 500 kg (Sample / Trial)</option>
                        <option value="500 kg - 1 Ton">500 kg - 1 Ton</option>
                        <option value="1 - 5 Tons">1 - 5 Tons</option>
                        <option value="5 - 20 Tons (FCL)">5 - 20 Tons (FCL)</option>
                        <option value="20+ Tons">20+ Tons (Multiple Containers)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Private Label Required?
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <select
                        name="privateLabelRequired"
                        value={formData.privateLabelRequired}
                        onChange={handleTextChange}
                        className="w-full rounded-xl border border-white/10 bg-deep-navy py-3 pl-10 pr-4 text-xs sm:text-sm text-frost-white transition-all focus:border-ice-blue focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                      Packaging Preference
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
                      <select
                        name="packagingPreference"
                        value={formData.packagingPreference}
                        onChange={handleTextChange}
                        className="w-full rounded-xl border border-white/10 bg-deep-navy py-3 pl-10 pr-4 text-xs sm:text-sm text-frost-white transition-all focus:border-ice-blue focus:outline-none focus:ring-1 focus:ring-ice-blue"
                      >
                        <option value="Retail Packs">Retail Packs</option>
                        <option value="Bulk">Bulk Packaging</option>
                        <option value="Food Service">Food Service</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Target Market */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                    Target Market / Region
                  </label>
                  <input
                    type="text"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleTextChange}
                    placeholder="e.g. North America, EU Supermarkets, Domestic HoReCa"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                  />
                </div>

                {/* Additional Requirements Textarea */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-frost-white/90">
                    Additional Requirements
                  </label>
                  <textarea
                    name="additionalRequirements"
                    rows={4}
                    value={formData.additionalRequirements}
                    onChange={handleTextChange}
                    placeholder="Please specify any custom powder mesh size, moisture specifications, certification requirements, target timeline, or custom packaging preferences..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
                  />
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-ice-blue focus:ring-ice-blue"
                  />
                  <label htmlFor="agreeToTerms" className="text-xs text-steel-silver leading-relaxed cursor-pointer select-none">
                    I agree to be contacted by BFF regarding my enquiry. We respect your privacy and process all trade data under strict non-disclosure.
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-primary-cta py-4 text-sm font-bold uppercase tracking-widest text-white shadow-frost transition-all duration-300 hover:shadow-ice disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      <span>Processing Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      <span>Send Export Enquiry</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
