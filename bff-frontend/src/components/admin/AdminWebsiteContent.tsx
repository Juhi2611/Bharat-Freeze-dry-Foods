import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Edit,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Save,
  Globe2,
} from "lucide-react";
import { WEBSITE_SECTIONS, type WebsiteSectionItem } from "./adminData";

export function AdminWebsiteContent() {
  const [sections, setSections] = useState<WebsiteSectionItem[]>(WEBSITE_SECTIONS);
  const [editingSec, setEditingSec] = useState<WebsiteSectionItem | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [subtitleInput, setSubtitleInput] = useState("");

  const handleEditOpen = (sec: WebsiteSectionItem) => {
    setEditingSec(sec);
    setTitleInput(sec.title);
    setSubtitleInput(sec.subtitle);
  };

  const handleSaveSec = () => {
    if (!editingSec) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === editingSec.id
          ? {
              ...s,
              title: titleInput,
              subtitle: subtitleInput,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : s
      )
    );
    toast.success(`${editingSec.title} Updated!`, {
      description: "Changes published to live frontend.",
    });
    setEditingSec(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-frost-white">Website Content Management</h2>
        <p className="text-xs text-steel-silver">
          Update copy, hero text, and section layouts across the public website
        </p>
      </div>

      {/* SECTION CARDS GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <motion.div
            key={sec.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ice-blue/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-ice-blue">
                  <Globe2 className="h-3 w-3" /> Section Component
                </span>
                <span className="rounded-full bg-forest-green/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                  {sec.status}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-frost-white group-hover:text-ice-blue transition-colors">
                {sec.title}
              </h3>
              <p className="mt-2 text-xs text-steel-silver leading-relaxed">
                {sec.subtitle}
              </p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-[0.65rem] text-steel-silver font-mono">
                Updated: {sec.lastUpdated}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditOpen(sec)}
                  className="flex items-center gap-1.5 rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1.5 text-xs font-semibold text-ice-blue hover:bg-ice-blue hover:text-deep-navy transition-all"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Copy
                </button>
                <a
                  href={sec.routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-frost-white hover:border-ice-blue hover:text-ice-blue transition-colors"
                  title={`Go to live page: ${sec.routeUrl}`}
                >
                  <Eye className="h-3.5 w-3.5 text-ice-blue" /> Preview Page
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingSec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-frost-white">
                  Edit Content: {editingSec.title}
                </h3>
                <button onClick={() => setEditingSec(null)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                    Subheading / Body Text
                  </label>
                  <textarea
                    rows={4}
                    value={subtitleInput}
                    onChange={(e) => setSubtitleInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => setEditingSec(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSec}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
                >
                  <Save className="h-4 w-4" /> Save & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
