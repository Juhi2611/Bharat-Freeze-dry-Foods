import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  Search,
  Building2,
  Globe2,
  Mail,
  Phone,
  Crown,
  Award,
  Send,
} from "lucide-react";
import { DUMMY_CUSTOMERS, type CustomerItem } from "./adminData";

export function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerItem[]>(DUMMY_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "All" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-frost-white">International Buyer Directory</h2>
          <p className="text-xs text-steel-silver">
            B2B accounts, contract manufacturing partners & lifetime trade values
          </p>
        </div>

        <button
          onClick={() => toast.info("Add New Account Modal")}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <Users className="h-4 w-4" /> Add B2B Account
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buyers by contact name, company or country..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white placeholder-white/30 focus:border-ice-blue focus:outline-none"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
        >
          <option value="All">All Tiers</option>
          <option value="VIP">VIP Tier</option>
          <option value="Standard">Standard Tier</option>
          <option value="Lead">Lead Tier</option>
        </select>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-2xl">
        <table className="w-full text-left text-xs text-frost-white">
          <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-steel-silver text-[0.65rem]">
            <tr>
              <th className="py-3.5 px-6">Buyer Name</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Country</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Lifetime Trade Value</th>
              <th className="py-3.5 px-4">Tier</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-bold flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ice-blue/10 text-ice-blue font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <span>{c.name}</span>
                    <span className="block text-[0.65rem] font-mono text-steel-silver">
                      {c.id}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-frost-white">{c.company}</td>
                <td className="py-4 px-4 text-steel-silver">{c.country}</td>
                <td className="py-4 px-4 font-mono">{c.totalOrders} FCL Orders</td>
                <td className="py-4 px-4 font-mono font-bold text-ice-blue">{c.lifetimeValue}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                      c.tier === "VIP"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-white/10 text-steel-silver"
                    }`}
                  >
                    {c.tier === "VIP" && <Crown className="h-3 w-3" />}
                    {c.tier}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="rounded-full bg-forest-green/20 text-emerald-300 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider">
                    {c.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1.5 text-xs font-semibold text-ice-blue hover:bg-ice-blue hover:text-deep-navy transition-all"
                  >
                    <Send className="h-3 w-3" /> Email
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-frost-white text-sm">{c.name}</span>
              <span className="font-mono font-bold text-ice-blue text-sm">{c.lifetimeValue}</span>
            </div>
            <div>
              <p className="text-xs text-steel-silver">{c.company} · {c.country}</p>
              <p className="text-[0.65rem] text-steel-silver">{c.totalOrders} Orders</p>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300 text-[0.6rem] font-bold">
                {c.tier}
              </span>
              <a
                href={`mailto:${c.email}`}
                className="rounded-lg border border-ice-blue/30 bg-ice-blue/10 px-3 py-1 text-xs text-ice-blue font-semibold"
              >
                Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
