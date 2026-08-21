import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileSpreadsheet,
  Globe2,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Snowflake,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "products"
  | "add-product"
  | "categories"
  | "enquiries"
  | "leads"
  | "orders"
  | "customers"
  | "media"
  | "content"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
  { id: "products" as AdminTab, label: "Products", icon: Package, badge: "48" },
  { id: "categories" as AdminTab, label: "Categories", icon: Layers },
  { id: "enquiries" as AdminTab, label: "B2B Enquiries", icon: FileSpreadsheet, badge: "New", badgeColor: "bg-ice-blue text-deep-navy" },
  { id: "leads" as AdminTab, label: "Export Leads", icon: Globe2 },
  { id: "orders" as AdminTab, label: "Orders", icon: ShoppingCart, badge: "5 FCL", badgeColor: "bg-forest-green/30 text-emerald-300 border border-forest-green/40" },
  { id: "customers" as AdminTab, label: "Customers", icon: Users, badge: "VIP" },
  { id: "media" as AdminTab, label: "Media Library", icon: ImageIcon },
  { id: "content" as AdminTab, label: "Website Content", icon: FileText },
  { id: "settings" as AdminTab, label: "Settings", icon: Settings },
];

export function AdminSidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const content = (
    <div className="flex h-full flex-col justify-between p-3 overflow-hidden">
      {/* Top Header & Logo */}
      <div className="shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ice-blue/20 to-ice-blue/5 border border-ice-blue/30 text-ice-blue shadow-frost">
              <Snowflake className="h-4.5 w-4.5 animate-pulse" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div>
                <h1 className="text-sm font-bold text-frost-white tracking-wide flex items-center gap-1.5 leading-tight">
                  BFF <span className="text-gradient-ice text-[0.65rem] uppercase tracking-widest font-mono">Admin</span>
                </h1>
                <p className="text-[0.6rem] uppercase tracking-widest text-steel-silver leading-tight">
                  Global Export OS
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-steel-silver hover:bg-white/10 hover:text-white transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>

          {/* Mobile close toggle */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-steel-silver hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="my-2 flex-1 overflow-y-auto pr-0.5 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id) {
                  setActiveTab(item.id as AdminTab);
                  setMobileOpen(false);
                }
              }}
              className={`group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-ice-blue/20 via-ice-blue/10 to-transparent text-frost-white border border-ice-blue/30 shadow-[0_0_15px_rgba(79,168,216,0.15)]"
                  : "text-steel-silver hover:bg-white/5 hover:text-frost-white"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-ice-blue shadow-[0_0_10px_#4FA8D8]"
                />
              )}

              <Icon
                className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-ice-blue" : "text-steel-silver group-hover:text-frost-white"
                }`}
              />

              {(!collapsed || mobileOpen) && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>

                  {item.badge && (
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${
                        item.badgeColor || "bg-white/10 text-frost-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="border-t border-white/10 pt-2 shrink-0">
        <button
          onClick={() => {
            alert("Signed out of Admin Portal.");
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-wider text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-40 border-r border-white/10 bg-deep-navy/95 backdrop-blur-2xl transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-72 h-full border-r border-white/10 bg-deep-navy shadow-2xl"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
