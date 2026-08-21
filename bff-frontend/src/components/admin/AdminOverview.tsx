import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Globe2,
  Package,
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Clock,
  Eye,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  DUMMY_STATS,
  DUMMY_ENQUIRIES,
  DUMMY_PRODUCTS,
  RECENT_ACTIVITIES,
  COMPANY_SETTINGS,
} from "./adminData";
import type { AdminTab } from "./AdminSidebar";

interface AdminOverviewProps {
  setActiveTab: (tab: AdminTab) => void;
  setSelectedEnquiryId: (id: string | null) => void;
}

export function AdminOverview({ setActiveTab, setSelectedEnquiryId }: AdminOverviewProps) {
  return (
    <div className="space-y-8 pb-12">
      {/* HERO WELCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[24px] border border-white/12 bg-gradient-to-r from-deep-navy via-card/80 to-deep-navy p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
      >
        {/* Glow backdrop */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-ice-blue/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ice-blue/30 bg-ice-blue/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-ice-blue">
              <Sparkles className="h-3.5 w-3.5" /> Export Operating System
            </div>
            <h1 className="mt-4 text-2xl sm:text-4xl font-bold text-frost-white tracking-tight">
              Welcome back, <span className="text-gradient-ice">{COMPANY_SETTINGS.adminProfile.name}</span>
            </h1>
            <p className="mt-2 text-sm text-steel-silver max-w-xl">
              Manage products, enquiries and export operations from a single unified portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("add-product")}
              className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
            <button
              onClick={() => setActiveTab("enquiries")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-frost-white backdrop-blur-md transition-all hover:border-ice-blue hover:bg-white/10"
            >
              <FileSpreadsheet className="h-4 w-4 text-ice-blue" /> View Enquiries
            </button>
          </div>
        </div>
      </motion.div>

      {/* TOP STAT CARDS (6 Cards Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {DUMMY_STATS.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-card/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-ice-blue/30 hover:shadow-2xl"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 100% 0%, ${stat.accent}20, transparent 60%)`,
              }}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-steel-silver">
                {stat.title}
              </span>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                style={{ backgroundColor: `${stat.accent}15`, color: stat.accent }}
              >
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-frost-white tracking-tight">
                {stat.value}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[0.7rem] font-medium text-forest-green">
              <TrendingUp className="h-3 w-3" />
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-steel-silver">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Add Product", tab: "add-product" as AdminTab, icon: Plus, accent: "#4FA8D8" },
            { label: "Manage Categories", tab: "categories" as AdminTab, icon: Package, accent: "#5FA755" },
            { label: "View Enquiries", tab: "enquiries" as AdminTab, icon: FileSpreadsheet, accent: "#E1B84A" },
            { label: "Upload Images", tab: "media" as AdminTab, icon: ImageIcon, accent: "#E1832E" },
            { label: "Website Content", tab: "content" as AdminTab, icon: FileText, accent: "#D19A2E" },
            { label: "Export Reports", tab: "leads" as AdminTab, icon: Globe2, accent: "#8ABB4A" },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={idx}
                onClick={() => setActiveTab(action.tab)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-card/40 p-5 text-center backdrop-blur-xl transition-all duration-300 hover:border-ice-blue/30 hover:bg-card/80"
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${action.accent}15`, color: action.accent }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-frost-white group-hover:text-ice-blue transition-colors">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT 8-COLUMNS: Recent Enquiries & Analytics */}
        <div className="lg:col-span-8 space-y-8">
          {/* RECENT ENQUIRIES TABLE */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-frost-white">Recent Export Enquiries</h3>
                <p className="text-xs text-steel-silver">Latest international B2B buyer requests</p>
              </div>
              <button
                onClick={() => setActiveTab("enquiries")}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ice-blue hover:underline"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-frost-white">
                <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-steel-silver text-[0.65rem]">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Products</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {DUMMY_ENQUIRIES.slice(0, 4).map((enq) => {
                    const statusColors: Record<string, string> = {
                      New: "bg-ice-blue/20 text-ice-blue border-ice-blue/30",
                      Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      Pending: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                      Closed: "bg-forest-green/20 text-emerald-300 border-forest-green/30",
                    };
                    return (
                      <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold">{enq.company}</td>
                        <td className="py-3.5 px-4 text-steel-silver">{enq.country}</td>
                        <td className="py-3.5 px-4">{enq.contactPerson}</td>
                        <td className="py-3.5 px-4">
                          <span className="truncate max-w-[140px] block text-steel-silver">
                            {enq.interestedProducts.join(", ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${
                              statusColors[enq.status]
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedEnquiryId(enq.id);
                              setActiveTab("enquiries");
                            }}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold text-frost-white hover:border-ice-blue hover:text-ice-blue transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BEAUTIFUL ANALYTICS PLACEHOLDERS */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Monthly Enquiries SVG Chart */}
            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-bold text-frost-white">Monthly Enquiries Growth</h4>
                <span className="text-xs text-forest-green font-semibold">+34% vs Q2</span>
              </div>
              <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2">
                {[35, 48, 62, 54, 80, 95, 128].map((val, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-deep-navy to-ice-blue transition-all duration-500 hover:brightness-125"
                      style={{ height: `${(val / 128) * 100}%` }}
                    />
                    <span className="text-[0.6rem] font-mono text-steel-silver">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Exporting Countries */}
            <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl">
              <h4 className="mb-4 text-sm font-bold text-frost-white">Top Export Destination Demand</h4>
              <div className="space-y-3">
                {[
                  { country: "United States", share: 38, count: "48 Orders" },
                  { country: "United Arab Emirates", share: 24, count: "31 Orders" },
                  { country: "Germany (EU)", share: 18, count: "23 Orders" },
                  { country: "Japan", share: 12, count: "15 Orders" },
                ].map((c, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-frost-white">{c.country}</span>
                      <span className="text-steel-silver">{c.count} ({c.share}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ice-blue to-forest-green"
                        style={{ width: `${c.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4-COLUMNS: Recent Products & Live Activity Feed */}
        <div className="lg:col-span-4 space-y-8">
          {/* RECENT PRODUCTS */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-frost-white">Featured SKUs</h3>
              <button
                onClick={() => setActiveTab("products")}
                className="text-xs text-ice-blue hover:underline font-semibold"
              >
                All SKUs →
              </button>
            </div>
            <div className="space-y-3">
              {DUMMY_PRODUCTS.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                >
                  <img
                    src={p.packImage}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-bold text-frost-white">{p.name}</p>
                    <p className="text-[0.65rem] text-steel-silver">{p.category} · {p.price}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${
                      p.status === "Published"
                        ? "bg-forest-green/20 text-emerald-300"
                        : "bg-white/10 text-steel-silver"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY FEED */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl">
            <h3 className="mb-4 text-base font-bold text-frost-white">Live Operations Feed</h3>
            <div className="relative space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="relative flex items-start gap-3 pl-8">
                  <div className="absolute left-1.5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border border-ice-blue bg-deep-navy" />
                  <div className="text-xs">
                    <p className="text-frost-white">
                      <span className="font-bold text-ice-blue">{act.user}</span> {act.action}{" "}
                      <span className="font-semibold text-frost-white">{act.target}</span>
                    </p>
                    <span className="text-[0.65rem] text-steel-silver">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
