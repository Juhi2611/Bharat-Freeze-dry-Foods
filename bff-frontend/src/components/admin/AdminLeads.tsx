import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DollarSign,
  Briefcase,
  TrendingUp,
  Plus,
  Layers,
  X,
  Columns3,
  List,
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

const PIPELINE_STAGES: Array<{ id: ExportLeadDeal["stage"]; title: string; color: string }> = [
  { id: "Qualified", title: "Inbound Qualified", color: "text-blue-400" },
  { id: "Sample Sent", title: "Sample Evaluation", color: "text-purple-400" },
  { id: "Negotiation", title: "Contract Negotiation", color: "text-amber-400" },
  { id: "Proforma Issued", title: "Proforma Issued", color: "text-ice-blue" },
  { id: "Closed Won", title: "Deal Closed / Won", color: "text-emerald-400" },
];

function formatUsdCompact(amount: number): string {
  if (amount <= 0) return "$0";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}k`;
  return `$${amount.toLocaleString("en-US")}`;
}

function parseDealValue(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, "");
  const parsed = parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

interface AdminLeadsProps {
  setActiveTab: (tab: AdminTab) => void;
}

export function AdminLeads({ setActiveTab }: AdminLeadsProps) {
  const [deals, setDeals] = useState<ExportLeadDeal[]>([]);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  const [selectedDeal, setSelectedDeal] = useState<ExportLeadDeal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newValue, setNewValue] = useState("");

  const stats = useMemo(() => {
    const totalPipelineValue = deals.reduce((sum, d) => sum + d.dealValueNum, 0);
    const closedWon = deals.filter((d) => d.stage === "Closed Won").length;
    const activeDeals = deals.filter((d) => d.stage !== "Closed Won").length;
    const winRate =
      deals.length > 0 ? Math.round((closedWon / deals.length) * 1000) / 10 : null;
    const avgDealValue = deals.length > 0 ? totalPipelineValue / deals.length : null;

    return { totalPipelineValue, activeDeals, winRate, avgDealValue };
  }, [deals]);

  const moveStage = (dealId: string, nextStage: ExportLeadDeal["stage"]) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d)));
    toast.success(`Deal stage updated to ${nextStage}`);
  };

  const handleAddDeal = () => {
    if (!newCompany.trim() || !newTitle.trim()) {
      toast.error("Company and deal title are required");
      return;
    }
    const valNum = parseDealValue(newValue) || 50_000;
    const newDeal: ExportLeadDeal = {
      id: `lead-${Date.now()}`,
      company: newCompany.trim(),
      country: "—",
      flag: "🌍",
      dealTitle: newTitle.trim(),
      volume: "TBD",
      dealValue: `$${valNum.toLocaleString("en-US")}`,
      dealValueNum: valNum,
      stage: "Qualified",
      probability: 30,
      contactName: "—",
      email: "—",
      targetClosing: "—",
    };
    setDeals((prev) => [newDeal, ...prev]);
    toast.success("Export deal added to pipeline");
    setShowAddDeal(false);
    setNewCompany("");
    setNewTitle("");
    setNewValue("");
  };

  return (
    <div className="flex w-full max-w-[1600px] flex-col gap-3 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-frost-white">Export Sales Pipeline</h2>
          <p className="text-[0.7rem] text-steel-silver">
            Enquiries = raw messages · Leads = qualified deals ·{" "}
            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              className="font-semibold text-ice-blue hover:underline"
            >
              View Enquiries →
            </button>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("pipeline")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider transition ${
                viewMode === "pipeline"
                  ? "bg-ice-blue/20 text-ice-blue"
                  : "text-steel-silver hover:text-frost-white"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" /> Pipeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider transition ${
                viewMode === "list"
                  ? "bg-ice-blue/20 text-ice-blue"
                  : "text-steel-silver hover:text-frost-white"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowAddDeal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary-cta px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Add Deal
          </button>
        </div>
      </div>

      {/* Dense metrics strip */}
      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-white/10 bg-card/50 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
        {[
          { label: "Pipeline Value", value: formatUsdCompact(stats.totalPipelineValue), Icon: DollarSign, tone: "text-ice-blue" },
          { label: "Active Deals", value: String(stats.activeDeals), Icon: Briefcase, tone: "text-emerald-400" },
          { label: "Win Rate", value: stats.winRate !== null ? `${stats.winRate}%` : "—", Icon: TrendingUp, tone: "text-purple-400" },
          { label: "Avg. Deal", value: stats.avgDealValue !== null ? formatUsdCompact(stats.avgDealValue) : "—", Icon: Layers, tone: "text-amber-400" },
        ].map(({ label, value, Icon, tone }) => (
          <div key={label} className="flex items-center gap-2 border-b border-white/10 px-3 py-2 last:border-b-0 sm:border-b-0">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${tone}`} />
            <div className="min-w-0 leading-tight">
              <p className="text-[0.55rem] font-semibold uppercase tracking-wider text-steel-silver">{label}</p>
              <p className="truncate text-sm font-bold text-frost-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline — no forced tall columns */}
      {viewMode === "pipeline" && (
        <div className="overflow-x-auto">
          <div className="flex gap-2 lg:grid lg:grid-cols-5">
            {PIPELINE_STAGES.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.id);
              const stageValue = stageDeals.reduce((sum, d) => sum + d.dealValueNum, 0);

              return (
                <div
                  key={stage.id}
                  className="flex w-[180px] shrink-0 flex-col rounded-lg border border-white/10 bg-card/40 p-2 lg:w-auto"
                >
                  <div className="mb-1.5 flex items-start justify-between gap-1 border-b border-white/10 pb-1.5">
                    <div className="min-w-0">
                      <h4 className={`text-[0.6rem] font-bold uppercase leading-snug ${stage.color}`}>
                        {stage.title}
                      </h4>
                      <p className="font-mono text-[0.55rem] text-steel-silver">
                        {formatUsdCompact(stageValue)} · {stageDeals.length}
                      </p>
                    </div>
                    <span className="rounded bg-white/10 px-1 text-[0.55rem] font-bold text-frost-white">
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {stageDeals.map((deal) => (
                      <button
                        key={deal.id}
                        type="button"
                        onClick={() => setSelectedDeal(deal)}
                        className="w-full rounded-md border border-white/10 bg-card/80 p-2 text-left hover:border-ice-blue/40"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[0.65rem]">{deal.flag}</span>
                          <span className="font-mono text-[0.55rem] font-bold text-ice-blue">{deal.dealValue}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[0.65rem] font-bold text-frost-white">{deal.company}</p>
                        <p className="line-clamp-1 text-[0.55rem] text-steel-silver">{deal.dealTitle}</p>
                      </button>
                    ))}
                    {stageDeals.length === 0 && (
                      <p className="py-0.5 text-center text-[0.6rem] text-steel-silver/60">No deals</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List */}
      {viewMode === "list" && (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-card/40">
          {deals.length === 0 ? (
            <p className="px-3 py-3 text-center text-[0.7rem] text-steel-silver">
              No deals yet — use <strong className="text-frost-white">Add Deal</strong> above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[0.6rem] uppercase tracking-wider text-steel-silver">
                    <th className="px-3 py-2 font-semibold">Company</th>
                    <th className="px-3 py-2 font-semibold">Deal</th>
                    <th className="px-3 py-2 font-semibold">Stage</th>
                    <th className="px-3 py-2 font-semibold">Value</th>
                    <th className="px-3 py-2 font-semibold">Prob.</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-3 py-2 font-semibold text-frost-white">
                        {deal.flag} {deal.company}
                      </td>
                      <td className="max-w-[180px] truncate px-3 py-2 text-steel-silver">{deal.dealTitle}</td>
                      <td className="px-3 py-2 text-frost-white">{deal.stage}</td>
                      <td className="px-3 py-2 font-mono font-bold text-ice-blue">{deal.dealValue}</td>
                      <td className="px-3 py-2 text-emerald-400">{deal.probability}%</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedDeal(deal)}
                          className="rounded border border-white/10 px-2 py-0.5 text-[0.6rem] font-bold text-ice-blue"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === "pipeline" && deals.length === 0 && (
        <p className="text-[0.65rem] text-steel-silver">
          Empty pipeline — click <strong className="text-frost-white">Add Deal</strong> to create the first lead.
        </p>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedDeal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setSelectedDeal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[min(90vh,560px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/15 bg-deep-navy shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div>
                  <h3 className="font-bold text-frost-white">
                    {selectedDeal.flag} {selectedDeal.company}
                  </h3>
                  <p className="text-xs text-steel-silver">{selectedDeal.dealTitle}</p>
                </div>
                <button type="button" onClick={() => setSelectedDeal(null)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 overflow-y-auto px-5 py-4 text-xs">
                <div className="grid grid-cols-2 gap-2 text-steel-silver">
                  <p>
                    Value: <strong className="text-ice-blue">{selectedDeal.dealValue}</strong>
                  </p>
                  <p>
                    Prob: <strong className="text-emerald-400">{selectedDeal.probability}%</strong>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PIPELINE_STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        moveStage(selectedDeal.id, s.id);
                        setSelectedDeal({ ...selectedDeal, stage: s.id });
                      }}
                      className={`rounded-lg border p-2 text-left text-[0.7rem] font-semibold ${
                        selectedDeal.stage === s.id
                          ? "border-ice-blue bg-ice-blue/20 text-ice-blue"
                          : "border-white/10 bg-white/5 text-steel-silver"
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add modal */}
      <AnimatePresence>
        {showAddDeal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowAddDeal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-deep-navy shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <h3 className="font-bold text-frost-white">Add Export Deal</h3>
                <button type="button" onClick={() => setShowAddDeal(false)} className="text-steel-silver hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 px-5 py-4">
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Buyer company *"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Deal title / products *"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Estimated value USD"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">
                <button
                  type="button"
                  onClick={() => setShowAddDeal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-frost-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddDeal}
                  className="rounded-xl bg-gradient-primary-cta px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
