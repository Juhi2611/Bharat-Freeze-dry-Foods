import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Filter,
  FileSpreadsheet,
  Globe2,
  Mail,
  Phone,
  Building2,
  User,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit3,
  Send,
  Boxes,
} from "lucide-react";
import { type EnquiryItem } from "./adminData";
import { api } from "@/services/api";

interface AdminEnquiriesProps {
  selectedEnquiryId: string | null;
  setSelectedEnquiryId: (id: string | null) => void;
}

export function AdminEnquiries({ selectedEnquiryId, setSelectedEnquiryId }: AdminEnquiriesProps) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void api.getEnquiries().then((records) => {
      setEnquiries(records.map((enquiry) => ({
        id: enquiry.id,
        code: enquiry.enquiry_code,
        company: enquiry.company_name,
        country: enquiry.country,
        contactPerson: enquiry.contact_person,
        email: enquiry.email,
        phone: enquiry.phone,
        interestedProducts: enquiry.interested_products,
        quantity: enquiry.quantity_requirement,
        privateLabel: enquiry.private_label_required ? "Yes" : "No",
        packagingPreference: enquiry.packaging_preference,
        status: enquiry.status as EnquiryItem["status"],
        date: enquiry.created_at,
        message: enquiry.message,
        notes: enquiry.internal_notes,
      })));
      setLoadError(null);
    }).catch((error) => {
      setEnquiries([]);
      setLoadError(error instanceof Error ? error.message : "Unable to load enquiries.");
    });
  }, []);

  const activeDrawerEnquiry = enquiries.find((e) => e.id === selectedEnquiryId) || null;

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    const matchesCountry = countryFilter === "All" || e.country === countryFilter;
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const updateStatus = (id: string, newStatus: EnquiryItem["status"]) => {
    void api.updateEnquiry(id, { status: newStatus }).then(() => {
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
      toast.success(`Enquiry Status Updated`, { description: `Status changed to ${newStatus}` });
    }).catch((error) => setLoadError(error instanceof Error ? error.message : "Unable to update enquiry."));
  };

  const updateNotes = (id: string, notes: string) => {
    void api.updateEnquiry(id, { internal_notes: notes }).then(() => {
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, notes } : e)));
      toast.success("Notes Saved");
    }).catch((error) => setLoadError(error instanceof Error ? error.message : "Unable to save notes."));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-frost-white">B2B Export Enquiries CRM</h2>
          <p className="text-xs text-steel-silver">
            {filtered.length} total lead submissions in pipeline
          </p>
        </div>
      </div>

      {loadError && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{loadError}</div>}

      {/* FILTERS BAR */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, contact, or email..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white placeholder-white/30 focus:border-ice-blue focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
          >
            <option value="All">All Countries</option>
            <option value="United States">United States</option>
            <option value="Germany">Germany</option>
            <option value="United Arab Emirates">UAE</option>
            <option value="Japan">Japan</option>
            <option value="Norway">Norway</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-frost-white">
            <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-steel-silver text-[0.65rem]">
              <tr>
                <th className="py-3.5 px-6">Company</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Interested Products</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((enq) => {
                const statusColors: Record<string, string> = {
                  New: "bg-ice-blue/20 text-ice-blue border-ice-blue/30",
                  Contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  Pending: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                  Closed: "bg-forest-green/20 text-emerald-300 border-forest-green/30",
                };

                return (
                  <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-bold flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-ice-blue" />
                      <div>
                        <span>{enq.company}</span>
                        <span className="block text-[0.65rem] font-mono text-steel-silver">
                          {enq.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-steel-silver">{enq.country}</td>
                    <td className="py-4 px-4 font-medium">{enq.contactPerson}</td>
                    <td className="py-4 px-4">
                      <span className="truncate max-w-[160px] block text-steel-silver">
                        {enq.interestedProducts.join(", ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-steel-silver">{enq.quantity}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${
                          statusColors[enq.status]
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-steel-silver">{enq.date}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedEnquiryId(enq.id)}
                        className="rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1.5 text-xs font-semibold text-ice-blue hover:bg-ice-blue hover:text-deep-navy transition-all"
                      >
                        Open CRM
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENQUIRY SIDE DRAWER */}
      <AnimatePresence>
        {activeDrawerEnquiry && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiryId(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Side Panel Drawer */}
            <motion.div
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              exit={{ x: 500 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-xl h-full border-l border-white/10 bg-deep-navy p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ice-blue/30 bg-ice-blue/10 text-ice-blue">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-frost-white">
                        {activeDrawerEnquiry.company}
                      </h3>
                      <p className="text-xs text-steel-silver">
                        ID: {activeDrawerEnquiry.code} · Submitted {activeDrawerEnquiry.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEnquiryId(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Status Selector */}
                <div className="mt-6 rounded-xl border border-white/10 bg-card/60 p-4 backdrop-blur-md">
                  <span className="text-xs font-semibold uppercase tracking-wider text-steel-silver block mb-2">
                    Lead Status
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["New", "Contacted", "Pending", "Closed"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(activeDrawerEnquiry.id, st)}
                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all ${
                          activeDrawerEnquiry.status === st
                            ? "border-ice-blue bg-ice-blue text-deep-navy shadow-frost"
                            : "border-white/10 bg-white/5 text-steel-silver hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buyer Details Grid */}
                <div className="mt-6 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/8 bg-white/5 p-4">
                    <div>
                      <span className="text-steel-silver uppercase tracking-wider text-[0.65rem] block mb-1">
                        Contact Person
                      </span>
                      <span className="font-bold text-frost-white text-sm">
                        {activeDrawerEnquiry.contactPerson}
                      </span>
                    </div>

                    <div>
                      <span className="text-steel-silver uppercase tracking-wider text-[0.65rem] block mb-1">
                        Country / Market
                      </span>
                      <span className="font-bold text-frost-white text-sm">
                        {activeDrawerEnquiry.country}
                      </span>
                    </div>

                    <div>
                      <span className="text-steel-silver uppercase tracking-wider text-[0.65rem] block mb-1">
                        Email
                      </span>
                      <a
                        href={`mailto:${activeDrawerEnquiry.email}`}
                        className="font-mono text-ice-blue hover:underline"
                      >
                        {activeDrawerEnquiry.email}
                      </a>
                    </div>

                    <div>
                      <span className="text-steel-silver uppercase tracking-wider text-[0.65rem] block mb-1">
                        Phone
                      </span>
                      <a
                        href={`tel:${activeDrawerEnquiry.phone}`}
                        className="font-mono text-frost-white hover:underline"
                      >
                        {activeDrawerEnquiry.phone}
                      </a>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/8 bg-white/5 p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-steel-silver">Estimated Volume:</span>
                      <span className="font-mono font-bold text-frost-white">
                        {activeDrawerEnquiry.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-steel-silver">Private Label:</span>
                      <span className="font-bold text-ice-blue">
                        {activeDrawerEnquiry.privateLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-steel-silver">Packaging Preference:</span>
                      <span className="font-bold text-frost-white">
                        {activeDrawerEnquiry.packagingPreference}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                    <span className="text-steel-silver uppercase tracking-wider text-[0.65rem] block mb-2">
                      Buyer Message
                    </span>
                    <p className="text-frost-white leading-relaxed text-xs sm:text-sm">
                      "{activeDrawerEnquiry.message}"
                    </p>
                  </div>

                  {/* Internal CRM Notes */}
                  <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                    <span className="text-steel-silver uppercase tracking-wider text-[0.65rem] block mb-2">
                      Internal Specialist Notes
                    </span>
                    <textarea
                      defaultValue={activeDrawerEnquiry.notes}
                      onBlur={(e) => updateNotes(activeDrawerEnquiry.id, e.target.value)}
                      placeholder="Add internal notes about samples sent, compliance docs, pricing quote..."
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-deep-navy p-3 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Quick Action */}
              <div className="mt-8 pt-4 border-t border-white/10 flex gap-3">
                <a
                  href={`mailto:${activeDrawerEnquiry.email}?subject=RE: Export Enquiry — BFF Bharat Freeze Dry Foods`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary-cta py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost"
                >
                  <Mail className="h-4 w-4" /> Reply Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
