import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Package, ReceiptText } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { api, type ApiOrder } from '@/services/api';

export const Route = createFileRoute('/account/orders')({
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getMyOrders()
      .then(setOrders)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AccountShell>
      <Link to="/account" className="mb-6 inline-flex items-center gap-2 text-sm text-steel-silver hover:text-ice-blue">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ice-blue">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold">My orders</h1>
          <p className="mt-2 text-sm text-steel-silver">Track order status, payment, and fulfillment.</p>
        </div>
        <Package className="hidden h-10 w-10 text-ice-blue/70 sm:block" />
      </div>

      {isLoading && <p className="text-sm text-steel-silver">Loading your orders...</p>}
      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>
      )}
      {!isLoading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-14 text-center">
          <ReceiptText className="mx-auto h-10 w-10 text-steel-silver" />
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-steel-silver">Your completed checkouts will appear here.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-gradient-primary-cta px-5 py-2.5 text-sm font-semibold text-white"
          >
            Browse products
          </Link>
        </div>
      )}
      {!isLoading && !error && orders.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wider text-steel-silver sm:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <Link
              key={order.id}
              to="/account/orders/$id"
              params={{ id: order.id }}
              className="grid gap-2 border-b border-white/10 px-5 py-4 last:border-b-0 hover:bg-white/5 sm:grid-cols-[1.3fr_1fr_1fr_1fr] sm:items-center sm:gap-4"
            >
              <span className="font-mono text-sm text-ice-blue">{order.order_code || order.id}</span>
              <span className="text-sm text-steel-silver">
                {new Date(order.order_date || '').toLocaleDateString()}
              </span>
              <span className="text-sm">
                {order.currency} {order.total_amount}
              </span>
              <span className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-ice-blue/10 px-2 py-1 text-ice-blue">
                  {order.payment_status}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-steel-silver">
                  {order.fulfillment_status}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
