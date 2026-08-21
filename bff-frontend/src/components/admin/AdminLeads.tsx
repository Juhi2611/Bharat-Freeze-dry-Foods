import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Globe2,
  DollarSign,
  Briefcase,
  TrendingUp,
  Plus,
  ArrowRight,
  UserCheck,
  Calendar,
  Layers,
  FileCheck2,
  CheckCircle2,
  X,
  Sparkles,
  Building2,
  ChevronRight,
} from "lucide-react";
import type { AdminTab } from "./AdminSidebar";

export interface ExportLeadDeal {
  id: string;
  company: string;
  country: string;
  flag: string;
  dealTitle: string;
  volume: string;
  dealValue: string;
  dealValueNum: number;
  stage: "Qualified" | "Sample Sent" | "Negotiation" | "Proforma Issued" | "Closed Won";
  probability: number;
  contactName: string;
  email: string;
  targetClosing: string;
}

const INITIAL_DEALS: ExportLeadDeal[] = [
  {
    id: "lead-101",
    company: "Apex Global Foods Inc.",
    country: "USA",
    flag: "🇺🇸",
    dealTitle: "20 Tons Alphonso Mango Chunks (40HQ)",
    volume: "20 Metric Tons",
    dealValue: "$185,000",
    dealValueNum: 185000,
    stage: "Proforma Issued",
    probability: 90,
    contactName: "David Miller",
    email: "dmiller@apexglobal.com",
    targetClosing: "2026-08-05",
  },
  {
    id: "lead-102",
    company: "EuroGourmet Hotel Supplies",
    country: "Germany",
    flag: "🇩🇪",
    dealTitle: "Annual Instant Gravy Powder Contract",
    volume: "12 Metric Tons",
    dealValue: "$95,000",
    dealValueNum: 95000,
    stage: "Negotiation",
    probability: 75,
    contactName: "Markus Webber",
    email: "m.webber@eurogourmet.de",
    targetClosing: "2026-08-12",
  },
  {
    id: "lead-103",
    company: "Tokyo Organic Trading Co.",
    country: "Japan",
    flag: "🇯🇵",
    dealTitle: "White-Label OEM Organic Moringa Powder",
    volume: "8 Metric Tons",
    dealValue: "$140,000",
    dealValueNum: 140000,
    stage: "Sample Sent",
    probability: 60,
    contactName: "Kenji Sato",
    email: "kenji@tokyo-organic.jp",
    targetClosing: "2026-08-20",
  },
  {
    id: "lead-104",
    company: "Gulf Food & Beverage Distributors",
    country: "UAE",
    flag: "🇦🇪",
    dealTitle: "2x 40HQ Freeze-Dried Sweet Corn & Peas",
    volume: "35 Metric Tons",
    dealValue: "$260,000",
    dealValueNum: 260000,
    stage: "Closed Won",
    probability: 100,
    contactName: "Tariq Al-Mansoor",
    email: "tariq@gulffood.ae",
    targetClosing: "2026-07-28",
  },
  {
    id: "lead-105",
    company: "Nordic Health Markets",
    country: "Sweden",
    flag: "🇸🇪",
    dealTitle: "Freeze-Dried Strawberry Powder Bulk",
    volume: "5 Metric Tons",
    dealValue: "$72,000",
    dealValueNum: 72000,
    stage: "Qualified",
    probability: 40,
    contactName: "Astrid Lindgren",
    email: "astrid@nordichealth.se",
    targetClosing: "2026-08-25",
  },
  {
    id: "lead-106",
    company: "Sydney Gourmet Imports",
    country: "Australia",
    flag: "🇦🇺",
    dealTitle: "Ready-To-Eat Freeze Dried Biryani Packets",
    volume: "15,000 Pouches",
    dealValue: "$58,000",
    dealValueNum: 58000,
    stage: "Negotiation",
    probability: 70,
    contactName: "Liam O'Connor",
    email: "liam@sydneygourmet.au",
    targetClosing: "2026-08-15",
  },
];

const PIPELINE_STAGES: Array<{ id: ExportLeadDeal["stage"]; title: string; color: string }> = [
  { id: "Qualified", title: "Inbound Qualified", color: "border-blue-500/30 text-blue-400" },
  { id: "Sample Sent", title: "Sample Evaluation", color: "border-purple-500/30 text-purple-400" },
  { id: "Negotiation", title: "Contract Negotiation", color: "border-amber-500/30 text-amber-400" },
  { id: "Proforma Issued", title: "Proforma Issued", color: "border-ice-blue/40 text-ice-blue" },
  { id: "Closed Won", title: "Deal Closed / Won", color: "border-forest-green/40 text-emerald-400" },
];

interface AdminLeadsProps {
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminLeads({ setActiveTab }: AdminLeadsProps) {
  const [deals, setDeals] = useState<ExportLeadDeal[]>(INITIAL_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<ExportLeadDeal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newValue, setNewValue] = useState("");

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.dealValueNum, 0);

  const moveStage = (dealId: string, nextStage: ExportLeadDeal["stage"]) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d))
    );
    toast.success(`Deal Stage Updated to ${nextStage}`);
  };

  const handleAddDeal = () => {
    if (!newCompany.trim() || !newTitle.trim()) {
      toast.error("Company & Deal title required");
      return;
    }
    const valNum = parseInt(newValue.replace(/[^0-9]/g, "")) || 50000;
    const newDeal: ExportLeadDeal = {
      id: `lead-${Date.now()}`,
      company: newCompany,
      country: "USA",
      flag: "🇺🇸",
      dealTitle: newTitle,
      volume: "10 Tons",
      dealValue: `$${valNum.toLocaleString()}`,
      dealValueNum: valNum,
      stage: "Qualified",
      probability: 30,
      contactName: "Trade Representative",
      email: "inquiry@client.com",
      targetClosing: "2026-08-30",
    };
    setDeals((prev) => [newDeal, ...prev]);
    toast.success("New Export Deal Created in Pipeline!");
    setShowAddDeal(false);
    setNewCompany("");
    setNewTitle("");
    setNewValue("");
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ice-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ice-blue">
            <Globe2 className="h-3.5 w-3.5" /> B2B Deals & Contract Pipeline
          </span>
          <h2 className="mt-2 text-2xl font-bold text-frost-white">Export Sales Pipeline</h2>
          <p className="text-xs text-steel-silver">
            Track high-volume container deals, OEM white-label agreements & international contract stages
          </p>
        </div>

        <button
          onClick={() => setShowAddDeal(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <Plus className="h-4 w-4" /> Add Export Deal
        </button>
      </div>

      {/* DIFFERENTIATOR EXPLANATION BANNER */}
      <div className="rounded-2xl border border-ice-blue/30 bg-gradient-to-r from-ice-blue/10 via-card/60 to-deep-navy p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-frost-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ice-blue" /> B2B Enquiries vs. Export Leads Pipeline
          </h4>
          <p className="text-xs text-steel-silver max-w-2xl">
            <strong>B2B Enquiries</strong> are incoming raw website messages. <strong>Export Leads</strong> are qualified high-value deals ($50k–$500k+) actively moving through contract, proforma, and container loading stages.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("enquiries")}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-ice-blue hover:bg-white/10 shrink-0"
        >
          View Raw Enquiries <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* METRIC STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ice-blue/15 text-ice-blue">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-steel-silver uppercase font-semibold">Active Pipeline Value</p>

            <p className="text-2xl font-bold text-frost-white">${(totalPipelineValue / 1000).toFixed(0)}k USD</p>

          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-steel-silver uppercase font-semibold">Active Export Deals</p>
            <p className="text-2xl font-bold text-frost-white">{deals.length} Contracts</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-steel-silver uppercase font-semibold">Pipeline Win Rate</p>
            <p className="text-2xl font-bold text-frost-white">72.4%</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-steel-silver uppercase font-semibold">Avg. Container Deal</p>
            <p className="text-2xl font-bold text-frost-white">
              ${Math.round(totalPipelineValue / deals.length / 1000)}k USD
            </p>
          </div>
        </div>
      </div>

      {/* PIPELINE KANBAN STAGES */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.id);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.dealValueNum, 0);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-card/40 p-4 backdrop-blur-xl min-h-[500px]"
            >
              {/* Column Header */}
              <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>
                    {stage.title}
                  </h4>
                  <p className="text-[0.65rem] text-steel-silver mt-0.5 font-mono">
                    ${(stageValue / 1000).toFixed(0)}k · {stageDeals.length} deals
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-frost-white">
                  {stageDeals.length}
                </span>
              </div>

              {/* Deal Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {stageDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDeal(deal)}
                    className="group relative cursor-pointer rounded-xl border border-white/10 bg-card/80 p-3.5 backdrop-blur-xl transition-all hover:border-ice-blue/40 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{deal.flag}</span>
                      <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[0.65rem] font-mono font-bold text-ice-blue">
                        {deal.dealValue}
                      </span>
                    </div>

                    <h5 className="mt-2 text-xs font-bold text-frost-white group-hover:text-ice-blue transition-colors line-clamp-1">
                      {deal.company}
                    </h5>
                    <p className="mt-1 text-[0.65rem] text-steel-silver line-clamp-2">
                      {deal.dealTitle}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[0.6rem] text-steel-silver">
                      <span>{deal.volume}</span>
                      <span className="font-semibold text-emerald-400">{deal.probability}% Prob.</span>
                    </div>
                  </motion.div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-white/10 text-[0.7rem] text-steel-silver">
                    No deals in stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DEAL DETAIL MODAL */}
      <AnimatePresence>
        {selectedDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedDeal.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-frost-white">{selectedDeal.company}</h3>
                    <p className="text-xs text-steel-silver">{selectedDeal.country} · Deal ID: {selectedDeal.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDeal(null)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <p className="font-bold text-frost-white text-sm">{selectedDeal.dealTitle}</p>
                  <div className="grid grid-cols-2 gap-2 text-steel-silver">
                    <p>Contract Value: <strong className="text-ice-blue">{selectedDeal.dealValue}</strong></p>
                    <p>Volume: <strong className="text-frost-white">{selectedDeal.volume}</strong></p>
                    <p>Contact: <strong className="text-frost-white">{selectedDeal.contactName}</strong></p>
                    <p>Target Close: <strong className="text-frost-white">{selectedDeal.targetClosing}</strong></p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                    Move Deal Stage
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PIPELINE_STAGES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          moveStage(selectedDeal.id, s.id);
                          setSelectedDeal({ ...selectedDeal, stage: s.id });
                        }}
                        className={`rounded-xl border p-2 text-left text-[0.7rem] font-semibold transition-all ${
                          selectedDeal.stage === s.id
                            ? "border-ice-blue bg-ice-blue/20 text-ice-blue"
                            : "border-white/10 bg-white/5 text-steel-silver hover:bg-white/10"
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toast.success("Proforma invoice generated for deal!");
                    setSelectedDeal(null);
                  }}
                  className="rounded-xl bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
                >
                  Issue Proforma Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW DEAL MODAL */}
      <AnimatePresence>
        {showAddDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/15 bg-deep-navy p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-frost-white">Add Export Pipeline Deal</h3>
                <button onClick={() => setShowAddDeal(false)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Buyer Company Name *
                </label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Apex Global Trading Ltd"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Deal Title / Products
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 20 Tons Freeze Dried Mango Chunks"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                  Estimated Value ($ USD)
                </label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. $150,000"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => setShowAddDeal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDeal}
                  className="rounded-xl bg-gradient-primary-cta px-5 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
                >
                  Save Deal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
