import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api, type ApiEnquiry, type ApiProduct } from "@/services/api";
import {
  Sparkles,
  Plus,
  TrendingUp,
  Globe2,
  Package,
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  Users,
  ShoppingBag,
  Layers,
  FolderOpen,
} from "lucide-react";
import type { AdminTab } from "./AdminSidebar";

interface AdminOverviewProps {
  setActiveTab: (tab: AdminTab) => void;
  setSelectedEnquiryId: (id: string | null) => void;
}

const STATUS_COLORS: Record<string, string> = {
  New: "bg-ice-blue/20 text-ice-blue border-ice-blue/30",
  Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Pending: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Closed: "bg-forest-green/20 text-emerald-300 border-forest-green/30",
};

export function AdminOverview({ setActiveTab, setSelectedEnquiryId }: AdminOverviewProps) {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<ApiEnquiry[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.getEnquiries(), api.getProducts(), api.getCategories()])
      .then(([enquiryRows, productPayload, cats]) => {
        if (!active) return;
        const productRows = Array.isArray(productPayload) ? productPayload : productPayload.results;
        setEnquiries(enquiryRows);
        setProducts(productRows);
        setCategoriesCount(cats.length);
        setLoadError(null);
      })
      .catch((error) => {
        if (!active) return;
        setEnquiries([]);
        setProducts([]);
        setLoadError(error instanceof Error ? error.message : "Unable to load dashboard data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const newCount = enquiries.filter((e) => e.status === "New").length;
    const pendingCount = enquiries.filter((e) => e.status === "Pending" || e.status === "Contacted").length;
    const privateLabelCount = enquiries.filter((e) => e.private_label_required).length;
    const countries = new Set(enquiries.map((e) => e.country).filter(Boolean)).size;
    const published = products.filter((p) => p.status === "Published" || p.status === "published").length;
    return [
      { id: "products", title: "Products", value: String(products.length), hint: `${published} published`, accent: "#4FA8D8", tab: "products" as AdminTab },
      { id: "categories", title: "Categories", value: String(categoriesCount), hint: "Catalog lines", accent: "#5FA755", tab: "categories" as AdminTab },
      { id: "enquiries", title: "New Leads", value: String(newCount), hint: `${enquiries.length} total`, accent: "#E1B84A", tab: "enquiries" as AdminTab },
      { id: "pending", title: "In Pipeline", value: String(pendingCount), hint: "Pending + contacted", accent: "#E1832E", tab: "enquiries" as AdminTab },
      { id: "countries", title: "Markets", value: String(countries), hint: "Enquiry countries", accent: "#8ABB4A", tab: "leads" as AdminTab },
      { id: "pl", title: "Private Label", value: String(privateLabelCount), hint: "OEM interest", accent: "#D19A2E", tab: "leads" as AdminTab },
    ];
  }, [enquiries, products, categoriesCount]);

  const topCountries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of enquiries) {
      const key = e.country?.trim() || "Unknown";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = sorted[0]?.[1] || 1;
    return sorted.map(([country, count]) => ({
      country,
      count,
      share: Math.round((count / max) * 100),
    }));
  }, [enquiries]);

  const monthBars = useMemo(() => {
    const now = new Date();
    const months: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("en-US", { month: "short" }),
        count: 0,
      });
    }
    for (const e of enquiries) {
      const created = new Date(e.created_at);
      if (Number.isNaN(created.getTime())) continue;
      const key = created.toLocaleString("en-US", { month: "short", year: "numeric" });
      for (let i = 0; i < months.length; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const mKey = d.toLocaleString("en-US", { month: "short", year: "numeric" });
        if (key === mKey) months[i].count += 1;
      }
    }
    return months;
  }, [enquiries]);

  const maxMonth = Math.max(1, ...monthBars.map((m) => m.count));

  const quickActions: { label: string; tab: AdminTab; icon: typeof Plus; accent: string }[] = [
    { label: "Add Product", tab: "add-product", icon: Plus, accent: "#4FA8D8" },
    { label: "Categories", tab: "categories", icon: Layers, accent: "#5FA755" },
    { label: "Enquiries", tab: "enquiries", icon: FileSpreadsheet, accent: "#E1B84A" },
    { label: "Orders", tab: "orders", icon: ShoppingBag, accent: "#E1832E" },
    { label: "Buyers", tab: "customers", icon: Users, accent: "#D19A2E" },
    { label: "Media", tab: "media", icon: ImageIcon, accent: "#8ABB4A" },
    { label: "Content", tab: "content", icon: FileText, accent: "#4FA8D8" },
    { label: "Leads", tab: "leads", icon: Globe2, accent: "#5FA755" },
  ];

  return (
    <div className="space-y-4 pb-8">
      {loadError && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {loadError}
        </div>
      )}

      {/* Compact welcome + primary CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card/90 via-deep-navy to-deep-navy px-5 py-4 sm:px-6"
      >
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-ice-blue/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-ice-blue">
              <Sparkles className="h-3 w-3" /> Operations dashboard
            </div>
            <h1 className="mt-1 truncate text-xl font-bold tracking-tight text-frost-white sm:text-2xl">
              Welcome back, <span className="text-gradient-ice">{user?.full_name?.split(" ")[0] || "Admin"}</span>
            </h1>
            <p className="mt-0.5 text-xs text-steel-silver">
              {loading ? "Loading live catalog & enquiry metrics…" : `${products.length} SKUs · ${enquiries.length} enquiries · ${categoriesCount} categories`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("add-product")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-frost-white hover:border-ice-blue/40"
            >
              <Package className="h-4 w-4 text-ice-blue" /> Inventory
            </button>
            <button
              onClick={() => setActiveTab("enquiries")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-frost-white hover:border-ice-blue/40"
            >
              <FileSpreadsheet className="h-4 w-4 text-ice-blue" /> Enquiries
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dense clickable KPI strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, i) => (
          <motion.button
            key={stat.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setActiveTab(stat.tab)}
            className="group relative overflow-hidden rounded-xl border border-white/8 bg-card/70 p-3 text-left backdrop-blur-xl transition-all hover:border-ice-blue/35 hover:bg-card"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: `radial-gradient(circle at 100% 0%, ${stat.accent}22, transparent 55%)` }}
            />
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-steel-silver">{stat.title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-frost-white">{stat.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[0.65rem] text-steel-silver">
              <TrendingUp className="h-3 w-3" style={{ color: stat.accent }} />
              {stat.hint}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Compact quick actions row */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.tab + action.label}
              type="button"
              onClick={() => setActiveTab(action.tab)}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/8 bg-card/50 px-2 py-3 transition-all hover:border-ice-blue/30 hover:bg-card/90"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${action.accent}18`, color: action.accent }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[0.65rem] font-semibold text-frost-white group-hover:text-ice-blue">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main workbench: enquiries + side panels */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-frost-white">Recent Enquiries</h3>
                <p className="text-[0.65rem] text-steel-silver">Latest B2B buyer requests</p>
              </div>
              <button
                onClick={() => setActiveTab("enquiries")}
                className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-ice-blue hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-frost-white">
                <thead className="bg-white/[0.03] text-[0.6rem] uppercase tracking-wider text-steel-silver">
                  <tr>
                    <th className="px-4 py-2.5">Company</th>
                    <th className="px-3 py-2.5">Country</th>
                    <th className="px-3 py-2.5 hidden sm:table-cell">Products</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-steel-silver">Loading enquiries…</td>
                    </tr>
                  )}
                  {!loading && enquiries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-steel-silver">
                        No enquiries yet — pipeline is clear.
                      </td>
                    </tr>
                  )}
                  {enquiries.slice(0, 7).map((enq) => (
                    <tr key={enq.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-4 py-2.5">
                        <p className="font-semibold">{enq.company_name}</p>
                        <p className="text-[0.65rem] text-steel-silver">{enq.contact_person}</p>
                      </td>
                      <td className="px-3 py-2.5 text-steel-silver">{enq.country}</td>
                      <td className="hidden max-w-[140px] truncate px-3 py-2.5 text-steel-silver sm:table-cell">
                        {enq.interested_products?.join(", ") || "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[0.55rem] font-bold uppercase ${STATUS_COLORS[enq.status] || "bg-white/10 text-steel-silver border-white/10"}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedEnquiryId(enq.id);
                            setActiveTab("enquiries");
                          }}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] font-semibold hover:border-ice-blue hover:text-ice-blue"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-frost-white">Enquiry trend</h4>
                <span className="text-[0.65rem] text-steel-silver">Last 6 months</span>
              </div>
              <div className="flex h-32 items-end justify-between gap-1.5">
                {monthBars.map((m) => (
                  <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[0.55rem] font-mono text-steel-silver">{m.count || ""}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-deep-navy to-ice-blue/90 transition-all hover:brightness-110"
                      style={{ height: `${Math.max(8, (m.count / maxMonth) * 100)}%` }}
                    />
                    <span className="text-[0.55rem] font-mono text-steel-silver">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl">
              <h4 className="mb-3 text-sm font-bold text-frost-white">Top markets</h4>
              {topCountries.length === 0 ? (
                <p className="py-8 text-center text-xs text-steel-silver">No country data yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {topCountries.map((c) => (
                    <div key={c.country} className="space-y-1">
                      <div className="flex justify-between text-[0.7rem]">
                        <span className="font-medium text-frost-white">{c.country}</span>
                        <span className="text-steel-silver">{c.count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-ice-blue to-forest-green"
                          style={{ width: `${c.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-frost-white">Catalog snapshot</h3>
                <p className="text-[0.65rem] text-steel-silver">Products & publish status</p>
              </div>
              <button
                onClick={() => setActiveTab("add-product")}
                className="inline-flex items-center gap-1 rounded-full bg-ice-blue/15 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-ice-blue hover:bg-ice-blue/25"
              >
                <Plus className="h-3 w-3" /> New
              </button>
            </div>

            {products.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                <FolderOpen className="h-10 w-10 text-steel-silver/50" />
                <div>
                  <p className="text-sm font-semibold text-frost-white">Catalog is empty</p>
                  <p className="mt-1 text-xs text-steel-silver">Add your first SKU to populate the storefront.</p>
                </div>
                <button
                  onClick={() => setActiveTab("add-product")}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {products.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <img
                      src={p.pack_image}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-lg border border-white/10 object-cover bg-deep-navy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-frost-white">{p.name}</p>
                      <p className="truncate text-[0.65rem] text-steel-silver">
                        {p.category_name || "Uncategorized"} · ₹{p.price_inr}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase ${
                        p.status === "Published" || p.status === "published"
                          ? "bg-forest-green/20 text-emerald-300"
                          : "bg-white/10 text-steel-silver"
                      }`}
                    >
                      {p.status}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="border-t border-white/10 px-4 py-2.5">
                <button
                  onClick={() => setActiveTab("products")}
                  className="text-[0.7rem] font-semibold text-ice-blue hover:underline"
                >
                  Manage all {products.length} products →
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-forest-green/15 to-card/60 p-4 text-left transition-all hover:border-forest-green/40"
            >
              <Layers className="h-5 w-5 text-emerald-300" />
              <p className="mt-3 text-2xl font-bold text-frost-white">{categoriesCount}</p>
              <p className="text-xs text-steel-silver">Categories</p>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-ice-blue/15 to-card/60 p-4 text-left transition-all hover:border-ice-blue/40"
            >
              <ImageIcon className="h-5 w-5 text-ice-blue" />
              <p className="mt-3 text-sm font-bold text-frost-white">Media library</p>
              <p className="text-xs text-steel-silver">Uploads & assets</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
