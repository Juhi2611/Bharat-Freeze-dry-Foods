import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Package,
  UploadCloud,
  Globe2,
  Save,
  Send,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useCatalogData } from "@/hooks/useCatalogData";
import type { AdminTab } from "./AdminSidebar";
import { api } from "@/services/api";

interface AdminAddProductProps {
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminAddProduct({ setActiveTab }: AdminAddProductProps) {
  const { categories } = useCatalogData();
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<"pack" | "ingredient" | null>(null);
  const packInputRef = useRef<HTMLInputElement>(null);
  const ingredientInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    blurb: "",
    description: "",
    packImage: "",
    ingredientImage: "",
    stock: "0",
    privateLabel: true,
    exportReady: true,
    isOrganic: false,
    status: "Published" as "Published" | "Draft",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File | undefined, field: "pack" | "ingredient") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploadingField(field);
    try {
      const uploaded = await api.uploadMediaFile(file, "Products");
      setFormData((prev) => ({
        ...prev,
        [field === "pack" ? "packImage" : "ingredientImage"]: uploaded.file_url,
      }));
      toast.success(field === "pack" ? "Pack image uploaded" : "Ingredient image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = (publishState: "Published" | "Draft") => {
    if (!formData.name.trim()) {
      toast.error("Product name required");
      return;
    }

    setLoading(true);
    void api
      .createProduct({
        sku: `BFF-${Date.now()}`,
        name: formData.name.trim(),
        slug: formData.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        category: formData.categoryId || undefined,
        pack_image: formData.packImage || "https://placehold.co/800x800/0F1A28/EAF6FB?text=BFF",
        ingredient_image:
          formData.ingredientImage || formData.packImage || "https://placehold.co/800x800/0F1A28/EAF6FB?text=BFF",
        price_inr: Number(formData.price) || 0,
        blurb: formData.blurb || formData.name,
        full_description: formData.description,
        stock_quantity: Number(formData.stock) || 0,
        white_label_available: formData.privateLabel,
        export_ready: formData.exportReady,
        is_organic: formData.isOrganic,
        status: publishState,
      })
      .then(() => {
        toast.success(publishState === "Published" ? "Product published" : "Draft saved", {
          description: `${formData.name} is in the catalog.`,
        });
        setActiveTab("products");
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to save product.");
      })
      .finally(() => setLoading(false));
  };

  const ImageSlot = ({
    label,
    hint,
    url,
    field,
    inputRef,
  }: {
    label: string;
    hint: string;
    url: string;
    field: "pack" | "ingredient";
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div className="space-y-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">{label}</p>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-deep-navy/60">
        {url ? (
          <div className="relative h-36">
            <img src={url} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  [field === "pack" ? "packImage" : "ingredientImage"]: "",
                }))
              }
              className="absolute right-2 top-2 rounded-lg bg-deep-navy/80 p-1 text-steel-silver hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploadingField === field}
            onClick={() => inputRef.current?.click()}
            className="flex h-36 w-full flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-white/5"
          >
            {uploadingField === field ? (
              <Loader2 className="h-6 w-6 animate-spin text-ice-blue" />
            ) : (
              <UploadCloud className="h-7 w-7 text-ice-blue" />
            )}
            <span className="text-xs font-semibold text-frost-white">
              {uploadingField === field ? "Uploading…" : "Upload from device"}
            </span>
            <span className="px-3 text-[0.6rem] text-steel-silver">{hint}</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void uploadImage(e.target.files?.[0], field);
          e.target.value = "";
        }}
      />
      <input
        type="url"
        value={url}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [field === "pack" ? "packImage" : "ingredientImage"]: e.target.value,
          }))
        }
        placeholder="Or paste image URL…"
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[0.7rem] text-frost-white focus:border-ice-blue focus:outline-none"
      />
    </div>
  );

  return (
    <div className="w-full space-y-4 pb-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("products")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-frost-white hover:border-ice-blue hover:text-ice-blue"
            title="Back to inventory"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-ice-blue">
              <Sparkles className="h-3 w-3" /> New SKU
            </span>
            <h2 className="text-xl font-bold text-frost-white">Add Product</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSave("Draft")}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-frost-white hover:bg-white/10 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" /> Draft
          </button>
          <button
            onClick={() => handleSave("Published")}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <section className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-frost-white">
              <Package className="h-4 w-4 text-ice-blue" /> Basics
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Product name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Freeze-Dried Alphonso Mango Chunks"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Price / pack (INR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="399"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Short blurb
                </label>
                <input
                  type="text"
                  name="blurb"
                  value={formData.blurb}
                  onChange={handleChange}
                  placeholder="100% natural, 0% added sugar, sublime crunch."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Full description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Sourcing, process, flavor, rehydration…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-frost-white">
              <ImageIcon className="h-4 w-4 text-ice-blue" /> Images
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImageSlot
                label="Pack render"
                hint="PNG / WebP / JPG · max 10MB"
                url={formData.packImage}
                field="pack"
                inputRef={packInputRef}
              />
              <ImageSlot
                label="Ingredient shot"
                hint="Shown on hover / detail"
                url={formData.ingredientImage}
                field="ingredient"
                inputRef={ingredientInputRef}
              />
            </div>
          </section>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <section className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl sm:p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-frost-white">
              <ShieldCheck className="h-4 w-4 text-ice-blue" /> Commerce
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Stock quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-frost-white">
                Private label / OEM
                <input
                  type="checkbox"
                  name="privateLabel"
                  checked={formData.privateLabel}
                  onChange={handleChange}
                  className="h-4 w-4 accent-ice-blue"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-frost-white">
                Export ready
                <input
                  type="checkbox"
                  name="exportReady"
                  checked={formData.exportReady}
                  onChange={handleChange}
                  className="h-4 w-4 accent-ice-blue"
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-frost-white">
                Organic
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  className="h-4 w-4 accent-ice-blue"
                />
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ice-blue/10 via-card/70 to-deep-navy p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-frost-white">
              <Globe2 className="h-4 w-4 text-ice-blue" /> Live preview
            </h3>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-deep-navy/80">
              <div className="relative h-40 bg-white/5">
                {formData.packImage ? (
                  <img src={formData.packImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-steel-silver">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="text-sm font-bold text-frost-white">
                  {formData.name.trim() || "Product name"}
                </p>
                <p className="line-clamp-2 text-[0.7rem] text-steel-silver">
                  {formData.blurb || "Short blurb appears here"}
                </p>
                <p className="pt-1 font-mono text-sm font-bold text-ice-blue">
                  ₹{formData.price || "0"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
