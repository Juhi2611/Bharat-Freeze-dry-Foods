import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  Globe2,
  DollarSign,
  Eye,
} from "lucide-react";
import { DUMMY_ORDERS, type OrderItem } from "./adminData";

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>(DUMMY_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.items.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      o.paymentStatus === statusFilter ||
      o.fulfillmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-frost-white">Bulk Export Orders</h2>
          <p className="text-xs text-steel-silver">
            Track container-load purchase orders, payments, and international freight dispatch
          </p>
        </div>

        <button
          onClick={() => toast.info("Create Purchase Order Modal")}
          className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost hover:scale-[1.02] transition-transform"
        >
          <ShoppingCart className="h-4 w-4" /> Create New Purchase Order
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
            placeholder="Search by order ID, customer or product item..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white placeholder-white/30 focus:border-ice-blue focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white focus:border-ice-blue focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Payment Pending</option>
          <option value="Shipped">Shipped (FCL)</option>
          <option value="Processing">Processing Batch</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-2xl">
        <table className="w-full text-left text-xs text-frost-white">
          <thead className="border-b border-white/10 bg-white/5 uppercase tracking-wider text-steel-silver text-[0.65rem]">
            <tr>
              <th className="py-3.5 px-6">Order ID</th>
              <th className="py-3.5 px-4">Customer & Country</th>
              <th className="py-3.5 px-4">Items / Specs</th>
              <th className="py-3.5 px-4">Total Value</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Fulfillment</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-ice-blue">{o.id}</td>
                <td className="py-4 px-4 font-semibold">
                  <span>{o.customer}</span>
                  <span className="block text-[0.65rem] text-steel-silver font-normal">
                    {o.country}
                  </span>
                </td>
                <td className="py-4 px-4 text-steel-silver max-w-[200px] truncate">{o.items}</td>
                <td className="py-4 px-4 font-bold text-frost-white font-mono">{o.total}</td>
                <td className="py-4 px-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                      o.paymentStatus === "Paid"
                        ? "bg-forest-green/20 text-emerald-300 border border-forest-green/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                      o.fulfillmentStatus === "Shipped" || o.fulfillmentStatus === "Delivered"
                        ? "bg-ice-blue/20 text-ice-blue border border-ice-blue/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {o.fulfillmentStatus}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-steel-silver">{o.date}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => toast.info(`Export Invoice generated for ${o.id}`)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-frost-white hover:border-ice-blue hover:text-ice-blue transition-colors"
                  >
                    Invoice PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filtered.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-ice-blue text-sm">{o.id}</span>
              <span className="font-mono font-bold text-frost-white text-sm">{o.total}</span>
            </div>
            <div>
              <p className="font-bold text-frost-white text-xs">{o.customer}</p>
              <p className="text-[0.65rem] text-steel-silver">{o.items}</p>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[0.65rem]">
              <span className="text-steel-silver">{o.date}</span>
              <div className="flex gap-2">
                <span className="rounded-full bg-forest-green/20 px-2 py-0.5 text-emerald-300 font-bold">
                  {o.paymentStatus}
                </span>
                <span className="rounded-full bg-ice-blue/20 px-2 py-0.5 text-ice-blue font-bold">
                  {o.fulfillmentStatus}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
