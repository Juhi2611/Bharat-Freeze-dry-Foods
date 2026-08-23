import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  Building2,
  Phone,
  Mail,
  Share2,
  User,
  Palette,
  Save,
  CheckCircle2,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { COMPANY_SETTINGS } from "./adminData";
import { api } from "@/services/api";

export function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => ({
    ...COMPANY_SETTINGS,
    adminProfile: {
      name: user?.full_name ?? "",
      role: user?.role ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar_url ?? "",
    },
  }));
  const [activeSubTab, setActiveSubTab] = useState<"company" | "contact" | "social" | "profile" | "theme">("company");

  useEffect(() => {
    void api.getSiteSettings().then((siteSettings) => {
      setSettings((prev) => ({
        ...prev,
        companyName: String(siteSettings.company_name ?? prev.companyName),
        tagline: String(siteSettings.tagline ?? prev.tagline),
        address: String(siteSettings.company_address ?? prev.address),
        email: String(siteSettings.support_email ?? prev.email),
        phone: String(siteSettings.support_phone ?? prev.phone),
        whatsApp: String(siteSettings.whatsapp_number ?? prev.whatsApp),
        socialLinks: (siteSettings.social_links as typeof prev.socialLinks) ?? prev.socialLinks,
      }));
    }).catch(() => {
      // Keep the editable defaults when the optional CMS settings record is unavailable.
    });
  }, []);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    void api.updateSiteSettings({
      company_name: settings.companyName,
      tagline: settings.tagline,
      company_address: settings.address,
      support_email: settings.email,
      support_phone: settings.phone,
      whatsapp_number: settings.whatsApp,
      social_links: settings.socialLinks,
    }).then(() => {
      toast.success("Operations Settings Saved!", { description: "Company parameters updated across export system." });
    }).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Unable to save operations settings.");
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-frost-white">Global Operations Settings</h2>
          <p className="text-xs text-steel-silver">
            Manage corporate credentials, WhatsApp integration & admin team profiles
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-card/60 p-2 backdrop-blur-xl">
        {[
          { id: "company", label: "Company Information", icon: Building2 },
          { id: "contact", label: "Contact & WhatsApp", icon: Phone },
          { id: "social", label: "Social Links", icon: Share2 },
          { id: "profile", label: "Admin Profile", icon: User },
          { id: "theme", label: "Theme & Aesthetics", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-ice-blue/20 text-ice-blue border border-ice-blue/30 shadow-frost"
                  : "text-steel-silver hover:bg-white/5 hover:text-frost-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="rounded-2xl border border-white/10 bg-card/60 p-6 sm:p-8 backdrop-blur-2xl">
        {activeSubTab === "company" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-ice-blue" /> Corporate Identity
            </h3>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleCompanyChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleCompanyChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Headquarters Address
              </label>
              <textarea
                name="address"
                rows={3}
                value={settings.address}
                onChange={handleCompanyChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeSubTab === "contact" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <Phone className="h-5 w-5 text-ice-blue" /> Contact & WhatsApp Integration
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Official Export Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-forest-green/30 bg-forest-green/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <MessageCircle className="h-5 w-5" /> Active WhatsApp Floating Widget
              </div>
              <label className="block text-xs text-steel-silver">
                WhatsApp Business Number (with country code):
              </label>
              <input
                type="text"
                value={settings.whatsApp}
                onChange={(e) => setSettings({ ...settings, whatsApp: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-deep-navy py-2.5 px-4 text-sm font-mono text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeSubTab === "social" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <Share2 className="h-5 w-5 text-ice-blue" /> Corporate Social Links
            </h3>

            {Object.entries(settings.socialLinks).map(([platform, url]) => (
              <div key={platform}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver capitalize">
                  {platform} Page URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, [platform]: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-mono text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {activeSubTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <User className="h-5 w-5 text-ice-blue" /> Administrator Profile
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={settings.adminProfile.avatar}
                alt={settings.adminProfile.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-ice-blue/40"
              />
              <div>
                <button
                  onClick={() => toast.info("Avatar update clicked")}
                  className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-frost-white hover:bg-white/10"
                >
                  Change Avatar Image
                </button>
                <p className="mt-1 text-[0.65rem] text-steel-silver">Recommended 400x400 JPG or PNG</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={settings.adminProfile.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminProfile: { ...settings.adminProfile, name: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Role Title
                </label>
                <input
                  type="text"
                  value={settings.adminProfile.role}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminProfile: { ...settings.adminProfile, role: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "theme" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-frost-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-ice-blue" /> Aesthetic Theme Presets
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { name: "Dark Luxury (Default)", color: "#4FA8D8", active: true },
                { name: "Deep Ocean Frost", color: "#2B6CB0", active: false },
                { name: "Arctic Gold Accent", color: "#D19A2E", active: false },
              ].map((preset, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 backdrop-blur-md cursor-pointer transition-all ${
                    preset.active
                      ? "border-ice-blue bg-ice-blue/10 shadow-frost"
                      : "border-white/10 bg-white/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className="h-8 w-full rounded-lg mb-3"
                    style={{ backgroundColor: preset.color }}
                  />
                  <h4 className="text-xs font-bold text-frost-white">{preset.name}</h4>
                  {preset.active && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[0.6rem] text-ice-blue font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Active Theme
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
