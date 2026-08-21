import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  UploadCloud,
  CheckCircle2,
  Tag,
  Globe2,
  FileText,
  Sparkles,
  Save,
  Send,
  Loader2,
  Leaf,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import type { AdminTab } from "./AdminSidebar";

interface AdminAddProductProps {
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminAddProduct({ setActiveTab }: AdminAddProductProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Fruits",
    price: "",
    blurb: "",
    description: "",
    packImage: "",
    ingredientImage: "",
    benefits: "",
    specMoisture: "Under 2%",
    specShelfLife: "24 Months",
    privateLabel: "Yes",
    status: "Published",
    seoTitle: "",
    seoDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (publishState: "Published" | "Draft") => {
    if (!formData.name.trim()) {
      toast.error("Product Name Required", { description: "Please enter a product title." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(
        publishState === "Published" ? "Product SKU Published!" : "Draft Saved",
        {
          description: `${formData.name} has been saved to catalog with status ${publishState}.`,
        }
      );
      setActiveTab("products");
    }, 600);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-frost-white hover:border-ice-blue hover:text-ice-blue transition-colors"
            title="Back to Product Inventory"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ice-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ice-blue">
              <Sparkles className="h-3.5 w-3.5" /> Catalog Management
            </span>
            <h2 className="mt-1.5 text-2xl font-bold text-frost-white">Add New Freeze-Dried SKU</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("Draft")}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-frost-white hover:bg-white/10"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button
            onClick={() => handleSave("Published")}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Publish Product
          </button>
        </div>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT 8 COLUMNS */}
        <div className="lg:col-span-8 space-y-6">
          {/* BASIC INFO */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <Package className="h-5 w-5 text-ice-blue" /> Basic Information
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Freeze-Dried Alphonso Mango Chunks"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-deep-navy py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Pet Food">Pet Food</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Price / Pack (INR)
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. ₹399"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Short Tagline / Blurb
              </label>
              <input
                type="text"
                name="blurb"
                value={formData.blurb}
                onChange={handleChange}
                placeholder="100% natural, 0% added sugar, sublime crunch."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Detailed Product Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe raw material sourcing, freeze drying process, flavor profile, and rehydration instructions..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
          </div>

          {/* IMAGE UPLOADS */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-ice-blue" /> Renders & Media Assets
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Pack Image Upload Box */}
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 p-6 text-center hover:border-ice-blue/40 transition-colors cursor-pointer">
                <UploadCloud className="h-8 w-8 text-ice-blue mb-2" />
                <span className="text-xs font-bold text-frost-white">Upload 4K Pack Render</span>
                <span className="text-[0.65rem] text-steel-silver mt-1">PNG or WebP up to 10MB</span>
              </div>

              {/* Ingredient Image Upload Box */}
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 p-6 text-center hover:border-ice-blue/40 transition-colors cursor-pointer">
                <UploadCloud className="h-8 w-8 text-ice-blue mb-2" />
                <span className="text-xs font-bold text-frost-white">Upload Fresh Ingredient Shot</span>
                <span className="text-[0.65rem] text-steel-silver mt-1">Revealed on hover animation</span>
              </div>
            </div>
          </div>

          {/* SEO METADATA */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-ice-blue" /> Search Engine Optimization (SEO)
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Meta Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                placeholder="Alphonso Mango Freeze-Dried Chunks — BFF Export"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Meta Description
              </label>
              <textarea
                name="seoDescription"
                rows={2}
                value={formData.seoDescription}
                onChange={handleChange}
                placeholder="Buy export-grade freeze-dried Alphonso mango chunks. 100% natural fruit preserved at peak sweetness."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: SPECIFICATIONS & STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-ice-blue" /> Export Specifications
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Moisture Content %
              </label>
              <input
                type="text"
                name="specMoisture"
                value={formData.specMoisture}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Shelf Life
              </label>
              <input
                type="text"
                name="specShelfLife"
                value={formData.specShelfLife}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Private Labeling Available?
              </label>
              <select
                name="privateLabel"
                value={formData.privateLabel}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-deep-navy py-2.5 px-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              >
                <option value="Yes">Yes — OEM / Custom Pouch</option>
                <option value="No">No — BFF Brand Only</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Publish Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-deep-navy py-2.5 px-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              >
                <option value="Published">Published to Site</option>
                <option value="Draft">Draft Mode</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
