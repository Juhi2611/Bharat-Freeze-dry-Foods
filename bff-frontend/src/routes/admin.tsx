import { useEffect, useState } from "react";
import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar, isAdminTabAllowed, type AdminTab } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminAddProduct } from "@/components/admin/AdminAddProduct";
import { AdminEnquiries } from "@/components/admin/AdminEnquiries";
import { AdminMediaLibrary } from "@/components/admin/AdminMediaLibrary";
import { AdminWebsiteContent } from "@/components/admin/AdminWebsiteContent";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminCustomers } from "@/components/admin/AdminCustomers";

import { AdminCategories } from "@/components/admin/AdminCategories";
import { AdminPetFoods } from "@/components/admin/AdminPetFoods";
import { AdminLeads } from "@/components/admin/AdminLeads";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "BFF Admin OS — Global Export & Product Operations" },
      {
        name: "description",
        content: "Executive dashboard for Bharat Freeze Dry Foods B2B export operations.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTabState] = useState<AdminTab>("dashboard");
  const [historyStack, setHistoryStack] = useState<AdminTab[]>(["dashboard"]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | null>(null);

  const hasAdminAccess = isAuthenticated && user?.role !== "customer";

  useEffect(() => {
    if (location.pathname === "/admin/login") return;

    if (!isLoading && !hasAdminAccess) {
      void navigate({ to: "/admin/login", replace: true });
    }
  }, [hasAdminAccess, isLoading, location.pathname, navigate]);

  // B10 / F10: bounce off CRM/settings tabs the role cannot access.
  useEffect(() => {
    if (!hasAdminAccess) return;
    if (!isAdminTabAllowed(activeTab, user?.role)) {
      setActiveTabState("dashboard");
      setHistoryStack(["dashboard"]);
    }
  }, [activeTab, hasAdminAccess, user?.role]);

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (isLoading || !hasAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-navy text-sm text-steel-silver">
        {isLoading ? "Checking administrator access..." : "Redirecting to administrator sign in..."}
      </div>
    );
  }

  const setActiveTab = (newTab: AdminTab) => {
    if (!isAdminTabAllowed(newTab, user?.role)) return;
    if (newTab !== activeTab) {
      setHistoryStack((prev) => [...prev, newTab]);
      setActiveTabState(newTab);
    }
  };

  const handleGoBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      let prevTab = newStack[newStack.length - 1];
      while (newStack.length > 1 && !isAdminTabAllowed(prevTab, user?.role)) {
        newStack.pop();
        prevTab = newStack[newStack.length - 1];
      }
      if (!isAdminTabAllowed(prevTab, user?.role)) {
        setHistoryStack(["dashboard"]);
        setActiveTabState("dashboard");
        return;
      }
      setHistoryStack(newStack);
      setActiveTabState(prevTab);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="relative min-h-screen bg-deep-navy text-frost-white selection:bg-ice-blue selection:text-deep-navy font-sans">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed left-1/3 top-10 -z-10 h-[600px] w-[600px] rounded-full bg-ice-blue/5 blur-[160px]" />
      <div className="pointer-events-none fixed right-10 bottom-10 -z-10 h-[500px] w-[500px] rounded-full bg-[#D97B3D]/5 blur-[140px]" />

      {/* Collapsible Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Top Header with Back button */}
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setMobileOpen={setMobileOpen}
        goBack={handleGoBack}
        canGoBack={historyStack.length > 1}
      />

      {/* Main Dynamic Content Area */}
      <main
        className={`p-3 sm:p-5 lg:p-6 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {activeTab === "dashboard" && (
          <AdminOverview
            setActiveTab={setActiveTab}
            setSelectedEnquiryId={setSelectedEnquiryId}
          />
        )}
        {activeTab === "products" && (
          <AdminProducts
            setActiveTab={setActiveTab}
            onEditProduct={(slug) => {
              setEditingProductSlug(slug);
              setActiveTab("add-product");
            }}
            onAddProduct={() => {
              setEditingProductSlug(null);
              setDefaultCategoryId(null);
              setActiveTab("add-product");
            }}
          />
        )}
        {activeTab === "categories" && (
          <AdminCategories setActiveTab={setActiveTab} />
        )}
        {activeTab === "pet-foods" && (
          <AdminPetFoods
            setActiveTab={setActiveTab}
            onEditProduct={(slug) => {
              setEditingProductSlug(slug);
              setDefaultCategoryId(null);
              setActiveTab("add-product");
            }}
            onAddPetProduct={(categoryId) => {
              setEditingProductSlug(null);
              setDefaultCategoryId(categoryId);
              setActiveTab("add-product");
            }}
          />
        )}
        {activeTab === "add-product" && (
          <AdminAddProduct
            setActiveTab={setActiveTab}
            editSlug={editingProductSlug}
            defaultCategoryId={defaultCategoryId}
            onClearEdit={() => {
              setEditingProductSlug(null);
              setDefaultCategoryId(null);
            }}
          />
        )}
        {activeTab === "enquiries" && (
          <AdminEnquiries
            selectedEnquiryId={selectedEnquiryId}
            setSelectedEnquiryId={setSelectedEnquiryId}
          />
        )}
        {activeTab === "leads" && (
          <AdminLeads setActiveTab={setActiveTab} />
        )}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "customers" && <AdminCustomers />}
        {activeTab === "media" && <AdminMediaLibrary />}
        {activeTab === "content" && <AdminWebsiteContent />}
        {activeTab === "settings" && <AdminSettings />}
      </main>
    </div>
  );
}
