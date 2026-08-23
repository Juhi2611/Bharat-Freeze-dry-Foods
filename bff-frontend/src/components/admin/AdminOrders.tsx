import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Search, ShoppingCart, X, Download, UserRound, Package } from "lucide-react";
import { api, type ApiOrder } from "@/services/api";

const paymentLabel = (status: string) => status.replaceAll("_", " ");

export function AdminOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    void api.getOrders().then(setOrders).catch((error) => setLoadError(error instanceof Error ? error.message : "Unable to load orders."));
  }, []);

  const filtered = orders.filter((order) => {
    const text = `${order.order_code} ${order.customer_name || ""} ${order.customer_company || ""} ${order.items_summary}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (statusFilter === "All" || order.payment_status === statusFilter || order.fulfillment_status === statusFilter);
  });

  const openOrder = async (order: ApiOrder) => {
    try {
      setSelectedOrder(await api.getOrder(order.id));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load order detail.");
    }
  };

  const updateFulfillment = async (fulfillment_status: string) => {
    if (!selectedOrder) return;
    try {
      const updated = await api.updateOrder(selectedOrder.id, { fulfillment_status });
      setSelectedOrder(updated);
      setOrders((current) => current.map((order) => order.id === updated.id ? updated : order));
      toast.success("Fulfillment status updated");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to update fulfillment status.");
    }
  };

  const downloadInvoice = async (order: ApiOrder) => {
    setIsDownloading(true);
    try {
      const blob = await api.downloadOrderInvoice(order.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `invoice-${order.order_code}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to download invoice.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-frost-white">Bulk Export Orders</h2><p className="text-xs text-steel-silver">Track purchase orders, payments, and freight dispatch</p></div><button onClick={() => toast.info("Create Purchase Order is not available in this view yet")} className="flex items-center gap-2 rounded-full bg-gradient-primary-cta px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-frost"><ShoppingCart className="h-4 w-4" /> Create New Purchase Order</button></div>
      {loadError && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{loadError}</div>}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-card/60 p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order ID, customer or product item..." className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-frost-white placeholder-white/30 focus:border-ice-blue focus:outline-none" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-white/10 bg-deep-navy px-3 py-2.5 text-xs text-frost-white"><option value="All">All Statuses</option><option value="Paid">Paid</option><option value="Pending">Payment Pending</option><option value="awaiting_quote">Awaiting Quote</option><option value="Shipped">Shipped</option><option value="Processing">Processing</option><option value="Delivered">Delivered</option></select></div>
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-card/60 md:block"><table className="w-full text-left text-xs text-frost-white"><thead className="border-b border-white/10 bg-white/5 text-[0.65rem] uppercase tracking-wider text-steel-silver"><tr><th className="px-6 py-3.5">Order ID</th><th className="px-4 py-3.5">Customer</th><th className="px-4 py-3.5">Items</th><th className="px-4 py-3.5">Total</th><th className="px-4 py-3.5">Payment</th><th className="px-4 py-3.5">Fulfillment</th><th className="px-4 py-3.5">Date</th><th className="px-6 py-3.5 text-right">Action</th></tr></thead><tbody className="divide-y divide-white/5">{filtered.map((order) => <tr key={order.id} onClick={() => void openOrder(order)} className="cursor-pointer hover:bg-white/5"><td className="px-6 py-4 font-mono font-bold text-ice-blue">{order.order_code}</td><td className="px-4 py-4 font-semibold">{order.customer_company || order.customer_name || "Unassigned"}<span className="block text-[0.65rem] font-normal text-steel-silver">{order.customer_country || ""}</span></td><td className="max-w-[200px] truncate px-4 py-4 text-steel-silver">{order.items_summary}</td><td className="px-4 py-4 font-mono font-bold">{order.currency} {order.total_amount}</td><td className="px-4 py-4"><span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase text-amber-300">{paymentLabel(order.payment_status)}</span></td><td className="px-4 py-4"><span className="rounded-full border border-ice-blue/30 bg-ice-blue/20 px-2.5 py-0.5 text-[0.6rem] font-bold uppercase text-ice-blue">{order.fulfillment_status}</span></td><td className="px-4 py-4 font-mono text-steel-silver">{order.order_date}</td><td className="px-6 py-4 text-right"><button onClick={(event) => { event.stopPropagation(); void downloadInvoice(order); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:border-ice-blue hover:text-ice-blue"><Download className="mr-1 inline h-3.5 w-3.5" />Invoice</button></td></tr>)}</tbody></table></div>
      <div className="grid grid-cols-1 gap-4 md:hidden">{filtered.map((order) => <button key={order.id} onClick={() => void openOrder(order)} className="space-y-3 rounded-2xl border border-white/10 bg-card/60 p-4 text-left"><div className="flex items-center justify-between"><span className="font-mono text-sm font-bold text-ice-blue">{order.order_code}</span><span className="font-mono text-sm font-bold">{order.currency} {order.total_amount}</span></div><p className="text-xs font-bold">{order.customer_company || order.customer_name || "Unassigned"}</p><p className="text-[0.65rem] text-steel-silver">{order.items_summary}</p><div className="flex justify-between border-t border-white/10 pt-2 text-[0.65rem] text-steel-silver"><span>{order.order_date}</span><span>{paymentLabel(order.payment_status)} · {order.fulfillment_status}</span></div></button>)}</div>
  <AnimatePresence>{selectedOrder && <div className="fixed inset-0 z-50 flex justify-end"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/70 backdrop-blur-md" /><motion.aside initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-deep-navy p-6 shadow-2xl"><div className="flex items-start justify-between border-b border-white/10 pb-4"><div><p className="text-xs uppercase tracking-wider text-ice-blue">Order detail</p><h3 className="mt-1 text-xl font-bold">{selectedOrder.order_code}</h3><p className="text-xs text-steel-silver">Created {selectedOrder.created_at || selectedOrder.order_date}</p></div><button onClick={() => setSelectedOrder(null)} className="rounded-lg border border-white/10 bg-white/5 p-2"><X className="h-4 w-4" /></button></div><section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm"><h4 className="mb-3 flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-ice-blue" /> Customer</h4><p>{selectedOrder.customer_name || "Guest customer"}</p><p className="text-steel-silver">{selectedOrder.customer_company || ""}</p><p className="text-ice-blue">{selectedOrder.customer_email || "No email"}</p><p>{selectedOrder.customer_phone || "No phone"}</p><p>{selectedOrder.customer_country || "No country"}</p></section><section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"><h4 className="mb-3 flex items-center gap-2 font-semibold"><Package className="h-4 w-4 text-ice-blue" /> Line items</h4>{(selectedOrder.items || []).map((item) => <div key={item.id} className="flex justify-between gap-3 border-b border-white/10 py-3 last:border-0"><div><p>{item.product_name_snapshot}</p><p className="text-xs text-steel-silver">{item.quantity} × {item.unit_price_snapshot}</p></div><p className="font-mono text-ice-blue">{selectedOrder.currency} {item.total_price}</p></div>)}<div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-bold"><span>Total</span><span>{selectedOrder.currency} {selectedOrder.total_amount}</span></div></section><section className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-steel-silver">Payment</p><p className="mt-1 font-semibold">{paymentLabel(selectedOrder.payment_status)}</p><p className="text-steel-silver">Rail: {selectedOrder.payment_rail || "Not set"}</p><p className="break-all text-steel-silver">Razorpay order: {selectedOrder.razorpay_order_id || "Not created"}</p><p className="break-all text-steel-silver">Payment ID: {selectedOrder.razorpay_payment_id || "Not paid"}</p></div><div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-steel-silver">Fulfillment</p><select value={selectedOrder.fulfillment_status} onChange={(event) => void updateFulfillment(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-deep-navy px-2 py-2 text-xs"><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select></div></section><section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs"><p className="text-steel-silver">Source enquiry</p><p>{selectedOrder.source_enquiry || "None"}</p><p className="mt-2 text-steel-silver">Private label enquiry</p><p>{selectedOrder.source_private_label_enquiry || "None"}</p></section><button disabled={isDownloading} onClick={() => void downloadInvoice(selectedOrder)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60"><Download className="h-4 w-4" />{isDownloading ? "Preparing PDF..." : "Download Invoice PDF"}</button></motion.aside></div>}</AnimatePresence>
  </div>
  );
}
