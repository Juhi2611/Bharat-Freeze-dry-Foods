import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Package,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  Search,
  Upload,
} from "lucide-react";
import { api, type ApiCategory, type ApiMediaFile } from "@/services/api";
import type { AdminTab } from "./AdminSidebar";

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400";

const AVAILABILITY_LABELS: Record<ApiCategory["availability"], string> = {
  available: "Available",
  coming_soon: "Coming Soon",
  custom_dev: "Custom Dev Only",
};

interface CategoryFormState {
  name: string;
  description: string;
  cover_image: string;
  availability: ApiCategory["availability"];
  display_order: number;
}

const EMPTY_FORM: CategoryFormState = {
  name: "",
  description: "",
  cover_image: "",
  availability: "available",
  display_order: 0,
};

interface AdminCategoriesProps {
  setActiveTab: (tab: AdminTab) => void;
}

function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<ApiMediaFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void api
      .getMediaFiles()
      .then(setFiles)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load media library."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = files.filter(
    (f) =>
      f.file_name.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-deep-navy shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h3 className="text-base font-bold text-frost-white">Select Cover Image</h3>
          <button onClick={onClose} className="text-steel-silver hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-white/10 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media library..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-steel-silver">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading media...
            </div>
          )}
          {error && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-steel-silver">
              No media files found. Upload assets in the Media Library tab first, or paste a URL directly.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => onSelect(file.file_url)}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left hover:border-ice-blue"
              >
                <div className="relative h-24 w-full overflow-hidden bg-deep-navy">
                  <img src={file.file_url} alt={file.file_name} className="h-full w-full object-cover" />
                </div>
                <p className="truncate px-2 py-1.5 text-[0.65rem] text-steel-silver group-hover:text-frost-white">
                  {file.file_name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CategoryFormModal({
  title,
  form,
  setForm,
  onSave,
  onClose,
  saving,
  saveLabel,
}: {
  title: string;
  form: CategoryFormState;
  setForm: React.Dispatch<React.SetStateAction<CategoryFormState>>;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  saveLabel: string;
}) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPEG, PNG, WEBP, or GIF).");
      return;
    }
    setUploading(true);
    try {
      const uploaded = await api.uploadMediaFile(file, "Categories");
      setForm((prev) => ({ ...prev, cover_image: uploaded.file_url }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/15 bg-deep-navy shadow-2xl"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
            <h3 className="text-base font-bold text-frost-white">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-steel-silver hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Category Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
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
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe target food line, flavor range and applications..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Cover Image
              </label>
              {form.cover_image ? (
                <div className="relative mb-2 h-28 overflow-hidden rounded-xl border border-white/10">
                  <img src={form.cover_image} alt="Cover preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, cover_image: "" }))}
                    className="absolute top-2 right-2 rounded-lg bg-deep-navy/80 p-1 text-steel-silver hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mb-2 flex h-28 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 text-steel-silver">
                  <ImageIcon className="h-8 w-8 opacity-40" />
                </div>
              )}
              <input
                type="url"
                value={form.cover_image}
                onChange={(e) => setForm((prev) => ({ ...prev, cover_image: e.target.value }))}
                placeholder="https://... or upload / pick from library"
                className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => void handleDeviceUpload(e.target.files?.[0])}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1.5 text-xs font-semibold text-ice-blue hover:bg-ice-blue/20 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {uploading ? "Uploading..." : "Upload from device"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="text-xs font-semibold text-ice-blue hover:underline"
                >
                  Browse Media Library →
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Availability
              </label>
              <select
                value={form.availability}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    availability: e.target.value as ApiCategory["availability"],
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-deep-navy py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="custom_dev">Custom Development Only</option>
              </select>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saveLabel}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMediaPicker && (
          <MediaPickerModal
            onSelect={(url) => {
              setForm((prev) => ({ ...prev, cover_image: url }));
              setShowMediaPicker(false);
            }}
            onClose={() => setShowMediaPicker(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function AdminCategories({ setActiveTab }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiCategory | null>(null);

  const loadCategories = useCallback(async () => {
    setLoadError(null);
    try {
      setCategories(await api.getCategories());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const totalSkus = categories.reduce((acc, cat) => acc + (cat.product_count ?? 0), 0);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const openEditModal = (cat: ApiCategory) => {
    setForm({
      name: cat.name,
      description: cat.description,
      cover_image: cat.cover_image,
      availability: cat.availability,
      display_order: cat.display_order,
    });
    setEditingCategory(cat);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Category name required");
      return;
    }
    setSaving(true);
    try {
      const created = await api.createCategory({
        name: form.name.trim(),
        description: form.description.trim(),
        cover_image: form.cover_image.trim(),
        availability: form.availability,
        display_order: form.display_order,
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)));
      toast.success("Category created", { description: `${created.name} added to catalog.` });
      setShowAddModal(false);
      setForm(EMPTY_FORM);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create category.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !form.name.trim()) {
      toast.error("Category name required");
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateCategory(editingCategory.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        cover_image: form.cover_image.trim(),
        availability: form.availability,
        display_order: form.display_order,
      });
      setCategories((prev) =>
        prev
          .map((c) => (c.id === updated.id ? updated : c))
          .sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)),
      );
      toast.success("Category updated");
      setEditingCategory(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update category.");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (cat: ApiCategory) => {
    if (cat.product_count > 0) {
      toast.error(`Cannot delete: ${cat.product_count} product(s) assigned`, {
        description: "Reassign or delete those products first.",
      });
      return;
    }
    setDeleteTarget(cat);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const cat = deleteTarget;
    setDeletingId(cat.id);
    try {
      await api.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setDeleteTarget(null);
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ice-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ice-blue">
            <Layers className="h-3.5 w-3.5" /> Catalog Taxonomy
          </span>
          <h2 className="mt-2 text-2xl font-bold text-frost-white">Product Categories & Line Management</h2>
          <p className="text-xs text-steel-silver">
            Live catalog taxonomy ({categories.length} categor{categories.length === 1 ? "y" : "ies"}, {totalSkus} SKUs)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <Plus className="h-4 w-4" /> Add New Category
        </button>
      </div>

      <div className="rounded-2xl border border-ice-blue/30 bg-gradient-to-r from-ice-blue/10 via-card/60 to-deep-navy p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-frost-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ice-blue" /> Category vs. Product Management
          </h4>
          <p className="text-xs text-steel-silver max-w-2xl">
            <strong>Categories</strong> define high-level food lines. <strong>Products</strong> are individual SKUs within each category. SKU counts update live from the database.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("products")}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-ice-blue hover:bg-white/10"
        >
          View All Products ({totalSkus} SKUs) <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {loadError && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {loadError}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-steel-silver">
          <Loader2 className="h-5 w-5 animate-spin text-ice-blue" /> Loading categories...
        </div>
      )}

      {!loading && !loadError && categories.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-card/40 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-steel-silver opacity-50" />
          <p className="mt-4 text-sm font-semibold text-frost-white">No categories yet</p>
          <p className="mt-1 text-xs text-steel-silver">Create your first product line to organize the catalog.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      )}

      {!loading && categories.length > 0 && (
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
                    src={cat.cover_image || PLACEHOLDER_COVER}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 right-3 rounded-full bg-deep-navy/80 border border-white/15 px-2.5 py-1 text-[0.65rem] font-bold text-ice-blue">
                    {cat.product_count} SKU{cat.product_count === 1 ? "" : "s"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-frost-white group-hover:text-ice-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs text-steel-silver leading-relaxed line-clamp-3">
                  {cat.description || "No description"}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between gap-2">
                <span className="rounded-full bg-forest-green/20 text-emerald-300 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider">
                  {AVAILABILITY_LABELS[cat.availability]}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-frost-white hover:border-ice-blue hover:text-ice-blue"
                    title="Edit category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => requestDelete(cat)}
                    disabled={deletingId === cat.id}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 hover:border-red-400 hover:text-red-200 disabled:opacity-50"
                    title={cat.product_count > 0 ? "Reassign products before deleting" : "Delete category"}
                  >
                    {deletingId === cat.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1.5 text-xs font-bold text-ice-blue hover:bg-ice-blue hover:text-deep-navy transition-all"
                  >
                    SKUs →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAddModal && (
          <CategoryFormModal
            title="Create New Category"
            form={form}
            setForm={setForm}
            onSave={() => void handleCreate()}
            onClose={() => !saving && setShowAddModal(false)}
            saving={saving}
            saveLabel="Create Category"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingCategory && (
          <CategoryFormModal
            title={`Edit Category: ${editingCategory.name}`}
            form={form}
            setForm={setForm}
            onSave={() => void handleUpdate()}
            onClose={() => !saving && setEditingCategory(null)}
            saving={saving}
            saveLabel="Save Changes"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => !deletingId && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-frost-white">Delete Category?</h3>
              <p className="mt-2 text-xs text-steel-silver">
                Remove <span className="font-semibold text-frost-white">{deleteTarget.name}</span> from the
                catalog? This cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={() => void confirmDelete()}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white shadow-lg disabled:opacity-60"
                >
                  {deletingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
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
