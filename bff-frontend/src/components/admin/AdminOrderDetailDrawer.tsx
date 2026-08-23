import { AnimatePresence, motion } from "framer-motion";
import { Download, Package, UserRound, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type ApiOrder } from "@/services/api";

interface AdminOrderDetailDrawerProps {
  order: ApiOrder | null;
  onClose: () => void;
  onUpdated?: (order: ApiOrder) => void;
}

const paymentLabel = (status: string) => status.replaceAll("_", " ");

export function AdminOrderDetailDrawer({ order, onClose, onUpdated }: AdminOrderDetailDrawerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const updateFulfillment = async (fulfillment_status: string) => {
    if (!order) return;
    try {
      const updated = await api.updateOrder(order.id, { fulfillment_status });
      onUpdated?.(updated);
      toast.success("Fulfillment status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update fulfillment status.");
    }
  };

  const downloadInvoice = async () => {
    if (!order) return;
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

  return <AnimatePresence>{order && <div className="fixed inset-0 z-50 flex justify-end"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-md" /><motion.aside initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-deep-navy p-6 shadow-2xl"><div className="flex items-start justify-between border-b border-white/10 pb-4"><div><p className="text-xs uppercase tracking-wider text-ice-blue">Order detail</p><h3 className="mt-1 text-xl font-bold">{order.order_code}</h3><p className="text-xs text-steel-silver">Created {order.created_at || order.order_date}</p></div><button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 p-2"><X className="h-4 w-4" /></button></div><section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm"><h4 className="mb-3 flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-ice-blue" /> Customer</h4><p>{order.customer_name || "Guest customer"}</p><p className="text-steel-silver">{order.customer_company || ""}</p><p className="text-ice-blue">{order.customer_email || "No email"}</p><p>{order.customer_phone || "No phone"}</p><p>{order.customer_country || "No country"}</p></section><section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"><h4 className="mb-3 flex items-center gap-2 font-semibold"><Package className="h-4 w-4 text-ice-blue" /> Line items</h4>{(order.items || []).map((item) => <div key={item.id} className="flex justify-between gap-3 border-b border-white/10 py-3 last:border-0"><div><p>{item.product_name_snapshot}</p><p className="text-xs text-steel-silver">{item.quantity} × {item.unit_price_snapshot}</p></div><p className="font-mono text-ice-blue">{order.currency} {item.total_price}</p></div>)}<div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-bold"><span>Total</span><span>{order.currency} {order.total_amount}</span></div></section><section className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-steel-silver">Payment</p><p className="mt-1 font-semibold">{paymentLabel(order.payment_status)}</p><p className="text-steel-silver">Rail: {order.payment_rail || "Not set"}</p><p className="break-all text-steel-silver">Razorpay order: {order.razorpay_order_id || "Not created"}</p><p className="break-all text-steel-silver">Payment ID: {order.razorpay_payment_id || "Not paid"}</p></div><div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-steel-silver">Fulfillment</p><select value={order.fulfillment_status} onChange={(event) => void updateFulfillment(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-deep-navy px-2 py-2 text-xs"><option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option></select></div></section><section className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs"><p className="text-steel-silver">Source enquiry</p><p>{order.source_enquiry || "None"}</p><p className="mt-2 text-steel-silver">Private label enquiry</p><p>{order.source_private_label_enquiry || "None"}</p></section><button disabled={isDownloading} onClick={() => void downloadInvoice()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60"><Download className="h-4 w-4" />{isDownloading ? "Preparing PDF..." : "Download Invoice PDF"}</button></motion.aside></div>}</AnimatePresence>;
}
