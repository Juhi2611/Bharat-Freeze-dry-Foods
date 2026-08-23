/** Short-lived guest unpaid-order resume key (sessionStorage only). */
const STORAGE_KEY = 'bff_guest_pending_order';

export interface GuestPendingOrder {
  id: string;
  order_code: string;
  order_access_token: string;
  total_amount: string | number;
  currency: string;
  payment_status: string;
  contact_person?: string;
  email?: string;
  phone?: string;
}

function canUseSessionStorage(): boolean {
  return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
}

export function readGuestPendingOrder(): GuestPendingOrder | null {
  if (!canUseSessionStorage()) return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GuestPendingOrder;
    if (!parsed?.id || !parsed?.order_access_token) return null;
    if (parsed.payment_status === 'Paid' || parsed.payment_status === 'cancelled') {
      clearGuestPendingOrder();
      return null;
    }
    return parsed;
  } catch {
    clearGuestPendingOrder();
    return null;
  }
}

export function saveGuestPendingOrder(order: GuestPendingOrder): void {
  if (!canUseSessionStorage()) return;
  if (!order.order_access_token) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

export function clearGuestPendingOrder(): void {
  if (!canUseSessionStorage()) return;
  sessionStorage.removeItem(STORAGE_KEY);
}
