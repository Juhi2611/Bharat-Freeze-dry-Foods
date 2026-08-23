import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  Sparkles,
  User,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import type { AdminTab } from "./AdminSidebar";

interface AdminHeaderProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  collapsed: boolean;
  setMobileOpen: (open: boolean) => void;
  goBack?: () => void;
  canGoBack?: boolean;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: "Executive Overview", subtitle: "Real-time metrics, global export enquiries & performance." },
  products: { title: "Product Inventory", subtitle: "Manage export-grade freeze-dried products & SKU data." },
  "add-product": { title: "Add New Product", subtitle: "Create and publish a new product to the global catalog." },
  categories: { title: "Category Management", subtitle: "Organize human food lines & sub-brands." },
  "pet-foods": { title: "Pet Foods", subtitle: "Manage pet food SKUs for the /pet-foods storefront page." },
  enquiries: { title: "B2B Export Enquiries", subtitle: "CRM lead management & international buyer requests." },
  leads: { title: "Export Leads Pipeline", subtitle: "Track container-load opportunities & white-label clients." },
  orders: { title: "Bulk Export Orders", subtitle: "Track container shipments, commercial invoices & payment terms." },
  customers: { title: "International Buyer Directory", subtitle: "Manage enterprise accounts, VIP clients & trade history." },
  media: { title: "Media & Asset Library", subtitle: "4K pack renders, video backgrounds & compliance docs." },
  content: { title: "Website Content Editor", subtitle: "Edit homepage, B2B landing page & site sections." },
  settings: { title: "Global Operations Settings", subtitle: "Company credentials, WhatsApp, social links & team roles." },
};

export function AdminHeader({
  activeTab,
  setActiveTab,
  collapsed,
  setMobileOpen,
  goBack,
  canGoBack = true,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tabInfo = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleBackClick = () => {
    if (goBack) {
      goBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-deep-navy/80 px-4 sm:px-8 backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? "md:ml-20" : "md:ml-64"
      }`}
    >
      {/* Left: Mobile Toggle, Previous Page Back Arrow & Breadcrumbs / Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-frost-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Back Button to return to previous page */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-frost-white hover:border-ice-blue hover:bg-ice-blue/10 hover:text-ice-blue transition-all"
          title="Go back to previous page"
        >
          <ArrowLeft className="h-4 w-4 text-ice-blue" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="hidden xs:block border-l border-white/10 pl-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-steel-silver">
            <span>Admin</span>
            <span>/</span>
            <span className="text-ice-blue">{activeTab.replace("-", " ")}</span>
          </div>
          <h2 className="text-sm sm:text-lg font-bold text-frost-white leading-tight">
            {tabInfo.title}
          </h2>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex relative w-80 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, enquiries, SKUs..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-12 text-xs text-frost-white placeholder-white/30 transition-all focus:border-ice-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-ice-blue"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white/10 px-1.5 py-0.5 text-[0.65rem] font-mono text-steel-silver">
          ⌘K
        </kbd>
      </div>

      {/* Right: Date, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden sm:inline-block text-xs font-medium text-steel-silver border-r border-white/10 pr-4">
          {todayDate}
        </span>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-frost-white transition-colors hover:border-ice-blue/40 hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-ice-blue shadow-[0_0_8px_#4FA8D8]" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-deep-navy/95 p-4 shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-frost-white">Notifications</h4>
                  <span className="rounded-full bg-ice-blue/20 px-2 py-0.5 text-[0.65rem] font-bold text-ice-blue">3 New</span>
                </div>
                <div className="mt-3 space-y-3 text-xs">
                  <div className="flex items-start gap-3 rounded-xl bg-white/5 p-2.5">
                    <Sparkles className="h-4 w-4 text-ice-blue shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-frost-white">New FCL Enquiry</p>
                      <p className="text-steel-silver">Apex Global (USA) requested 20 tons quote.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-white/5 p-2.5">
                    <CheckCircle2 className="h-4 w-4 text-forest-green shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-frost-white">Export Certificate Ready</p>
                      <p className="text-steel-silver">Phytosanitary docs issued for Batch #409.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages Icon */}
        <button
          onClick={() => setActiveTab("enquiries")}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-frost-white transition-colors hover:border-ice-blue/40 hover:bg-white/10"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-spice-orange" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 transition-colors hover:border-white/20 hover:bg-white/10"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="h-8 w-8 rounded-lg object-cover border border-ice-blue/40"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-ice-blue/40 bg-ice-blue/10 text-xs font-bold text-ice-blue">
                {user?.full_name?.charAt(0) || "A"}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-frost-white leading-tight">
                {user?.full_name}
              </p>
              <p className="text-[0.6rem] text-steel-silver uppercase tracking-wider">
                {user?.role}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-steel-silver" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-deep-navy/95 p-2 shadow-2xl backdrop-blur-2xl"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-frost-white">{user?.full_name}</p>
                  <p className="text-[0.65rem] text-steel-silver">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-steel-silver hover:bg-white/5 hover:text-frost-white"
                  >
                    <User className="h-4 w-4 text-ice-blue" /> Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-steel-silver hover:bg-white/5 hover:text-frost-white"
                  >
                    <SettingsIcon className="h-4 w-4 text-ice-blue" /> System Settings
                  </button>
                </div>
                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => logout("/admin/login")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
