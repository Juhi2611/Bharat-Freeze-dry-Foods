import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar, type AdminTab } from "@/components/admin/AdminSidebar";
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
  const [activeTab, setActiveTabState] = useState<AdminTab>("dashboard");
  const [historyStack, setHistoryStack] = useState<AdminTab[]>(["dashboard"]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);

  const setActiveTab = (newTab: AdminTab) => {
    if (newTab !== activeTab) {
      setHistoryStack((prev) => [...prev, newTab]);
      setActiveTabState(newTab);
    }
  };

  const handleGoBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const prevTab = newStack[newStack.length - 1];
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
        className={`p-4 sm:p-8 transition-all duration-300 ${
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
          <AdminProducts setActiveTab={setActiveTab} />
        )}
        {activeTab === "categories" && (
          <AdminCategories setActiveTab={setActiveTab} />
        )}
        {activeTab === "add-product" && (
          <AdminAddProduct setActiveTab={setActiveTab} />
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
