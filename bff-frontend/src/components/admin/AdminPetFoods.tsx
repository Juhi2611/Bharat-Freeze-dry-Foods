import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, PawPrint, Plus, Edit2, Package } from "lucide-react";
import { api, type ApiCategory, type ApiProduct } from "@/services/api";
import type { AdminTab } from "./AdminSidebar";

interface AdminPetFoodsProps {
  setActiveTab: (tab: AdminTab) => void;
  onEditProduct: (slug: string) => void;
  onAddPetProduct: (categoryId: string) => void;
}

export function AdminPetFoods({ setActiveTab, onEditProduct, onAddPetProduct }: AdminPetFoodsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [petCategory, setPetCategory] = useState<ApiCategory | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [categories, productResponse] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      const pet = categories.find((c) => c.name.toLowerCase() === "pet food") ?? null;
      setPetCategory(pet);
      const all = Array.isArray(productResponse) ? productResponse : productResponse.results;
      setProducts(
        pet
          ? all.filter((p) => p.category === pet.id || p.category_name?.toLowerCase() === "pet food")
          : [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load pet foods.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createPetFoodCategory = async () => {
    setSaving(true);
    try {
      const coverUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/images/pet_treats.png`
          : "";
      const created = await api.createCategory({
        name: "Pet Food",
        description: "Premium freeze-dried pet nutrition for the /pet-foods storefront page.",
        cover_image: coverUrl,
        availability: "available",
        display_order: 7,
      });
      setPetCategory(created);
      toast.success("Pet Food category created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to create Pet Food category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-steel-silver">
        <Loader2 className="h-5 w-5 animate-spin text-ice-blue" /> Loading pet foods…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!petCategory) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[#D97B3D]/30 bg-card/60 p-8 text-center backdrop-blur-xl">
        <PawPrint className="mx-auto h-12 w-12 text-[#D97B3D]" />
        <h2 className="mt-4 text-xl font-bold text-frost-white">Set up Pet Foods</h2>
        <p className="mt-2 text-sm text-steel-silver">
          Create the <strong>Pet Food</strong> category to manage SKUs shown on the storefront pet foods page.
        </p>
        <button
          type="button"
          disabled={saving}
          onClick={() => void createPetFoodCategory()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D97B3D] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create Pet Food category
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D97B3D]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#D97B3D]">
            <PawPrint className="h-3.5 w-3.5" /> Pet Foods
          </span>
          <h2 className="mt-2 text-2xl font-bold text-frost-white">Pet Food catalog</h2>
          <p className="text-xs text-steel-silver">
            {products.length} product{products.length === 1 ? "" : "s"} · appears on /pet-foods
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAddPetProduct(petCategory.id)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
        >
          <Plus className="h-4 w-4" /> Add pet product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-card/40 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-steel-silver opacity-50" />
          <p className="mt-4 text-sm font-semibold text-frost-white">No pet food products yet</p>
          <p className="mt-1 text-xs text-steel-silver">Add your first pet SKU to show on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl"
            >
              <img
                src={product.pack_image}
                alt={product.name}
                className="h-40 w-full object-cover"
              />
              <div className="flex items-start justify-between gap-2 p-4">
                <div>
                  <p className="font-bold text-frost-white">{product.name}</p>
                  <p className="text-xs text-steel-silver">₹{product.price_inr} · {product.status}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onEditProduct(product.slug)}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-steel-silver hover:border-ice-blue hover:text-ice-blue"
                  title="Edit product"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-steel-silver">
        Category settings (cover image, description) are in{" "}
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className="font-semibold text-ice-blue hover:underline"
        >
          Categories
        </button>
        .
      </p>
    </div>
  );
}
