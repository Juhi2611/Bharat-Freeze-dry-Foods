import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Edit2,
  Eye,
  Package,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { AdminTab } from "./AdminSidebar";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  skuCount: number;
  description: string;
  coverImage: string;
  status: "Active" | "Hidden";
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Freeze-Dried Fruits",
    slug: "fruits",
    skuCount: 14,
    description: "Premium tropical fruits, mangoes, strawberries & bananas preserved with 0% moisture.",
    coverImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
  {
    id: "cat-2",
    name: "Freeze-Dried Vegetables",
    slug: "vegetables",
    skuCount: 10,
    description: "Farm-fresh sweet corn, green peas, okra, and diced tomatoes retain full nutritional value.",
    coverImage: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
  {
    id: "cat-3",
    name: "Gravy & Sauce Bases",
    slug: "gravies",
    skuCount: 6,
    description: "Instant HoReCa grade gravy powders — Makhani, Red Velvet, White Gravy & Dal Tadka.",
    coverImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
  {
    id: "cat-4",
    name: "Freeze-Dried Spices",
    slug: "spices",
    skuCount: 8,
    description: "Aromatic garlic, ginger, green chillies & coriander leaves with full essential oils.",
    coverImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
  {
    id: "cat-5",
    name: "Superfood Powders",
    slug: "superfoods",
    skuCount: 5,
    description: "Organic Moringa leaf powder, Turmeric curcumin extracts, and Beetroot powders.",
    coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
  {
    id: "cat-6",
    name: "Pre-Cooked Meals",
    slug: "pre-cooked-meals",
    skuCount: 5,
    description: "Instant gourmet meals: Biryani, Poha, Pav Bhaji, and Dal Khichdi ready in 3 minutes.",
    coverImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
  {
    id: "cat-7",
    name: "Pet Food Ingredients",
    slug: "pet-food",
    skuCount: 4,
    description: "100% human-grade freeze-dried salmon, chicken breast & liver treats for pets.",
    coverImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400",
    status: "Active",
  },
];

interface AdminCategoriesProps {
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminCategories({ setActiveTab }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      toast.error("Category name required");
      return;
    }
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, "-"),
      skuCount: 0,
      description: newCatDesc || "New product line",
      coverImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
      status: "Active",
    };
    setCategories((prev) => [...prev, newCat]);
    toast.success("New Category Created!", { description: `${newCatName} added to catalog structure.` });
    setShowAddModal(false);
    setNewCatName("");
    setNewCatDesc("");
  };

  const handleSaveEdit = () => {
    if (!editingCat) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCat.id ? editingCat : c))
    );
    toast.success("Category Details Updated");
    setEditingCat(null);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ice-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ice-blue">
            <Layers className="h-3.5 w-3.5" /> Catalog Taxonomy
          </span>
          <h2 className="mt-2 text-2xl font-bold text-frost-white">Product Categories & Line Management</h2>
          <p className="text-xs text-steel-silver">
            Organize human food product lines & pet treats taxonomy ({categories.length} Active Categories)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <Plus className="h-4 w-4" /> Add New Category
        </button>
      </div>

      {/* EXPLANATION BANNER */}
      <div className="rounded-2xl border border-ice-blue/30 bg-gradient-to-r from-ice-blue/10 via-card/60 to-deep-navy p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-frost-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ice-blue" /> Category vs. Product Management
          </h4>
          <p className="text-xs text-steel-silver max-w-2xl">
            <strong>Categories</strong> define the high-level food lines (e.g. Fruits, Superfoods). <strong>Products</strong> are individual sellable SKUs within each category.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("products")}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-ice-blue hover:bg-white/10"
        >
          View All Products ({categories.reduce((acc, c) => acc + c.skuCount, 0)} SKUs) <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 w-full overflow-hidden rounded-xl bg-deep-navy mb-4">
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 right-3 rounded-full bg-deep-navy/80 border border-white/15 px-2.5 py-1 text-[0.65rem] font-bold text-ice-blue">
                  {cat.skuCount} SKUs
                </span>
              </div>

              <h3 className="text-lg font-bold text-frost-white group-hover:text-ice-blue transition-colors">
                {cat.name}
              </h3>
              <p className="mt-2 text-xs text-steel-silver leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="rounded-full bg-forest-green/20 text-emerald-300 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider">
                {cat.status}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCat(cat)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-frost-white hover:border-ice-blue hover:text-ice-blue"
                >
                  Edit Category
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className="rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1.5 text-xs font-bold text-ice-blue hover:bg-ice-blue hover:text-deep-navy transition-all"
                >
                  Manage SKUs →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADD CATEGORY MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-frost-white">Create New Category</h3>
                <button onClick={() => setShowAddModal(false)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Freeze-Dried Desserts"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Category Description
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Describe target food line, flavor range and applications..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="rounded-xl bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
                >
                  Create Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CATEGORY MODAL */}
      <AnimatePresence>
        {editingCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-frost-white">Edit Category: {editingCat.name}</h3>
                <button onClick={() => setEditingCat(null)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Category Description
                </label>
                <textarea
                  rows={3}
                  value={editingCat.description}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => setEditingCat(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-xl bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
