/**
 * Lightweight Node checks for F3 guest checkout session contract.
 * Run from bff-frontend: node src/lib/guestCheckoutSession.node-test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const store = new Map();
globalThis.window = {
  sessionStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => {
      store.set(k, String(v));
    },
    removeItem: (k) => {
      store.delete(k);
    },
  },
};
globalThis.sessionStorage = globalThis.window.sessionStorage;

const STORAGE_KEY = 'bff_guest_pending_order';

function clearGuestPendingOrder() {
  sessionStorage.removeItem(STORAGE_KEY);
}

function saveGuestPendingOrder(order) {
  if (!order.order_access_token) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

function readGuestPendingOrder() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed?.id || !parsed?.order_access_token) return null;
  if (parsed.payment_status === 'Paid' || parsed.payment_status === 'cancelled') {
    clearGuestPendingOrder();
    return null;
  }
  return parsed;
}

const sample = {
  id: 'ord-1',
  order_code: 'BFF-001',
  order_access_token: 'tok-abc',
  total_amount: '500.00',
  currency: 'INR',
  payment_status: 'Pending',
};

saveGuestPendingOrder(sample);
assert.deepEqual(readGuestPendingOrder(), sample);
assert.ok(sessionStorage.getItem(STORAGE_KEY));

clearGuestPendingOrder();
assert.equal(readGuestPendingOrder(), null);

sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...sample, payment_status: 'Paid' }));
assert.equal(readGuestPendingOrder(), null);
assert.equal(sessionStorage.getItem(STORAGE_KEY), null);

sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...sample, payment_status: 'cancelled' }));
assert.equal(readGuestPendingOrder(), null);

saveGuestPendingOrder({ ...sample, order_access_token: '' });
assert.equal(sessionStorage.getItem(STORAGE_KEY), null);

const modalSrc = fs.readFileSync(path.join(__dirname, '../components/CheckoutModal.tsx'), 'utf8');
assert.match(modalSrc, /saveGuestPendingOrder/);
assert.match(modalSrc, /clearGuestPendingOrder/);
assert.match(modalSrc, /readGuestPendingOrder/);

const createBlock = modalSrc.slice(
  modalSrc.indexOf('const handleCreateOrder'),
  modalSrc.indexOf('const handleSubmitEnquiry'),
);
assert.doesNotMatch(createBlock, /clearCart\(\)/);
assert.match(createBlock, /persistGuestOrderIfNeeded\(created\)/);

const paidBlock = modalSrc.slice(
  modalSrc.indexOf('const markOrderPaidLocally'),
  modalSrc.indexOf('const abandonPendingGuestSession'),
);
assert.match(paidBlock, /clearGuestPendingOrder\(\)/);
assert.match(paidBlock, /clearCart\(\)/);

const helperSrc = fs.readFileSync(path.join(__dirname, 'guestCheckoutSession.ts'), 'utf8');
assert.match(helperSrc, /sessionStorage/);
assert.doesNotMatch(helperSrc, /localStorage/);

console.log('guestCheckoutSession.node-test: OK');
