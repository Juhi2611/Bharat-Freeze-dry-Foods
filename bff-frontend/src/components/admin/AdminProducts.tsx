import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Package,
  Sparkles,
} from "lucide-react";
import { DUMMY_PRODUCTS, type AdminProductItem } from "./adminData";
import { CATEGORIES } from "@/lib/products";
import type { AdminTab } from "./AdminSidebar";

interface AdminProductsProps {
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminProducts({ setActiveTab }: AdminProductsProps) {
  const [products, setProducts] = useState<AdminProductItem[]>(DUMMY_PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-frost-white">Product Catalog Management</h2>
          <p className="text-xs text-steel-silver">
            {filtered.length} products found in database
          </p>
        </div>

        <button
          onClick={() => setActiveTab("add-product")}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white placeholder-white/30 focus:border-ice-blue focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Pet Food">Pet Food</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-2xl">
        <table className="w-full text-left text-xs text-frost-white">
          <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-steel-silver text-[0.65rem]">
            <tr>
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Export Compliance</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.packImage}
                      alt={p.name}
                      className="h-12 w-12 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <p className="font-bold text-frost-white">{p.name}</p>
                      <p className="text-[0.65rem] font-mono text-steel-silver">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-steel-silver font-medium">{p.category}</td>
                <td className="py-4 px-4 font-bold">{p.price}</td>
                <td className="py-4 px-4 font-mono">{p.stock} units</td>
                <td className="py-4 px-4">
                  {p.exportReady ? (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] text-forest-green font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> HACCP Certified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] text-amber-400 font-semibold">
                      <XCircle className="h-3.5 w-3.5" /> Pending Docs
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${
                      p.status === "Published"
                        ? "bg-forest-green/20 text-emerald-300 border border-forest-green/30"
                        : "bg-white/10 text-steel-silver border border-white/10"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => alert(`Editing SKU: ${p.name}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-steel-silver hover:border-ice-blue hover:text-ice-blue transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.packImage}
                alt={p.name}
                className="h-14 w-14 rounded-xl object-cover border border-white/10"
              />
              <div>
                <h4 className="font-bold text-frost-white">{p.name}</h4>
                <p className="text-xs text-steel-silver">{p.category} · {p.price}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${
                    p.status === "Published"
                      ? "bg-forest-green/20 text-emerald-300"
                      : "bg-white/10 text-steel-silver"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
              <span className="text-steel-silver font-mono">Stock: {p.stock}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Editing SKU: ${p.name}`)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-frost-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-frost-white">Delete Product SKU?</h3>
              <p className="mt-2 text-xs text-steel-silver">
                Are you sure you want to remove this SKU from the catalog? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-lg"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
