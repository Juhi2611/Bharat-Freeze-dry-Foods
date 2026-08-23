import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, CreditCard, Package } from 'lucide-react';
import { api, type ApiOrder } from '@/services/api';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const Route = createFileRoute('/account/orders/$id')({
  component: MyOrderDetailPage,
});

function MyOrderDetailPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getMyOrder(id)
      .then(setOrder)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const loadRazorpay = async () => {
    if (window.Razorpay) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNow = async () => {
    if (!order) return;
    setIsPaying(true);
    setError(null);
    setMessage(null);
    try {
      const payment = await api.createOrderPayment(order.id);
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error('Unable to load Razorpay checkout.');
      const checkout = new window.Razorpay({
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.razorpay_order_id,
        name: 'BFF Foods',
        description: `Payment for ${order.order_code}`,
        handler: async (response: { razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verified = await api.verifyOrderPayment(order.id, response);
            setOrder((current) => current ? { ...current, payment_status: verified.payment_status } : current);
            setMessage(`Payment verified: ${verified.payment_status}`);
          } catch (verifyError: any) {
            setError(verifyError.message || 'Payment verification failed.');
          }
        },
      });
      checkout.on('payment.failed', () => setError('Payment failed or was cancelled. You can retry.'));
      checkout.open();
    } catch (paymentError: any) {
      setError(paymentError.message || 'Unable to start payment.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-frost-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/account/orders" className="mb-8 inline-flex items-center gap-2 text-sm text-steel-silver hover:text-ice-blue"><ArrowLeft className="h-4 w-4" /> Back to my orders</Link>
        {isLoading && <p className="text-sm text-steel-silver">Loading order...</p>}
        {error && !order && <p className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
        {order && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div><p className="text-xs uppercase tracking-[0.24em] text-ice-blue">Order detail</p><h1 className="mt-2 text-3xl font-semibold">{order.order_code || order.id}</h1><p className="mt-2 text-sm text-steel-silver">Placed {new Date(order.order_date || '').toLocaleDateString()}</p></div>
              <Package className="h-10 w-10 text-ice-blue/70" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-steel-silver">Total</p><p className="mt-1 text-lg font-semibold">{order.currency} {order.total_amount}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-steel-silver">Payment</p><p className="mt-1 text-lg font-semibold">{order.payment_status}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-steel-silver">Fulfillment</p><p className="mt-1 text-lg font-semibold">{order.fulfillment_status}</p></div>
            </div>
            <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <h2 className="border-b border-white/10 px-5 py-4 text-lg font-semibold">Line items</h2>
              {(order.items || []).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 last:border-b-0"><div><p className="font-medium">{item.product_name_snapshot}</p><p className="text-sm text-steel-silver">{item.quantity} × {item.unit_price_snapshot}</p></div><p className="font-mono text-ice-blue">{order.currency} {item.total_price}</p></div>)}
            </section>
            {order.payment_status !== 'Paid' && <div className="mt-6"><button type="button" onClick={payNow} disabled={isPaying} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"><CreditCard className="h-4 w-4" />{isPaying ? 'Opening payment...' : 'Pay Now'}</button></div>}
            {message && <p className="mt-4 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle className="h-4 w-4" />{message}</p>}
            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}
