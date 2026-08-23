import React, { useEffect, useState } from 'react';

import { useCart } from '../context/CartContext';

import { useAuth } from '../context/AuthContext';

import { api } from '../services/api';

import type { ApiOrder } from '../services/api';

import {

  clearGuestPendingOrder,

  readGuestPendingOrder,

  saveGuestPendingOrder,

} from '../lib/guestCheckoutSession';

import {

  PayNowCheckoutForm,

  formatPayNowShippingMessage,

  type PayNowFormValues,

} from '@/components/checkout/PayNowCheckoutForm';

import { QuoteRequestForm, type QuoteFormValues } from '@/components/checkout/QuoteRequestForm';

import { PayOrderSummary } from '@/components/checkout/PayOrderSummary';

import { QuoteOrderSummary } from '@/components/checkout/QuoteOrderSummary';

import { X, CheckCircle, Package, FileText } from 'lucide-react';



declare global {

  interface Window {

    Razorpay?: any;

  }

}



function toApiOrderFromPending(

  pending: NonNullable<ReturnType<typeof readGuestPendingOrder>>,

): ApiOrder {

  return {

    id: pending.id,

    order_code: pending.order_code,

    customer: null,

    items_summary: '',

    total_amount: pending.total_amount,

    currency: pending.currency,

    payment_status: pending.payment_status,

    fulfillment_status: 'Pending',

    order_date: '',

    order_access_token: pending.order_access_token,

  };

}



const defaultPayValues = (user?: { full_name?: string; email?: string; country?: string } | null): PayNowFormValues => ({

  fullName: user?.full_name || '',

  email: user?.email || '',

  phone: '',

  addressLine: '',

  city: '',

  state: '',

  postalCode: '',

  country: user?.country || 'India',

});



const defaultQuoteValues = (

  user?: { company_name?: string; full_name?: string; email?: string; country?: string } | null,

): QuoteFormValues => ({

  companyName: user?.company_name || '',

  contactPerson: user?.full_name || '',

  email: user?.email || '',

  phone: '',

  country: user?.country || 'India',

  shippingMethod: 'sea_fcl',

  incoterm: 'FOB',

  paymentTerms: 'advance_tt',

  message: '',

});



export const CheckoutModal: React.FC = () => {

  const {

    isCheckoutOpen,

    setIsCheckoutOpen,

    checkoutMode,

    openCheckout,

    items,

    clearCart,

    totalPrice,

  } = useCart();

  const { user } = useAuth();

  const isPayMode = checkoutMode === 'pay';



  const [payValues, setPayValues] = useState<PayNowFormValues>(() => defaultPayValues(user));

  const [quoteValues, setQuoteValues] = useState<QuoteFormValues>(() => defaultQuoteValues(user));



  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPaying, setIsPaying] = useState(false);

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<ApiOrder | null>(null);

  const [paymentResult, setPaymentResult] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isResumedGuestOrder, setIsResumedGuestOrder] = useState(false);



  // F3: restore unpaid guest order from sessionStorage (survives dismiss/refresh).

  useEffect(() => {

    const pending = readGuestPendingOrder();

    if (!pending) return;

    setCreatedOrder(toApiOrderFromPending(pending));

    setIsResumedGuestOrder(true);

    if (pending.contact_person) {

      setPayValues((prev) => ({ ...prev, fullName: pending.contact_person || prev.fullName }));

    }

    if (pending.email) setPayValues((prev) => ({ ...prev, email: pending.email || prev.email }));

    if (pending.phone) setPayValues((prev) => ({ ...prev, phone: pending.phone || prev.phone }));

    openCheckout('pay');

  }, [openCheckout]);



  useEffect(() => {

    if (!isCheckoutOpen) return;

    const pending = readGuestPendingOrder();

    if (!pending) return;

    setCreatedOrder(toApiOrderFromPending(pending));

    setIsResumedGuestOrder(true);

    setSubmittedCode(null);

    setPaymentResult(null);

    setError(null);

  }, [isCheckoutOpen]);



  // F8: sync profile when checkout opens or user logs in.

  useEffect(() => {

    if (!isCheckoutOpen || !user) return;

    setPayValues((prev) => ({

      ...prev,

      fullName: prev.fullName || user.full_name || '',

      email: prev.email || user.email || '',

      country: prev.country || user.country || 'India',

    }));

    setQuoteValues((prev) => ({

      ...prev,

      companyName: prev.companyName || user.company_name || '',

      contactPerson: prev.contactPerson || user.full_name || '',

      email: prev.email || user.email || '',

      country: prev.country || user.country || 'India',

    }));

  }, [isCheckoutOpen, user]);



  if (!isCheckoutOpen) return null;



  const persistGuestOrderIfNeeded = (created: ApiOrder) => {

    if (!created.order_access_token) return;

    saveGuestPendingOrder({

      id: created.id,

      order_code: created.order_code,

      order_access_token: created.order_access_token,

      total_amount: created.total_amount,

      currency: created.currency,

      payment_status: created.payment_status,

      contact_person: payValues.fullName,

      email: payValues.email,

      phone: payValues.phone,

    });

  };



  const handleCreateOrder = async (e: React.FormEvent) => {

    e.preventDefault();

    setIsSubmitting(true);

    setError(null);



    try {

      const payload = {

        company_name: '',

        contact_person: payValues.fullName,

        email: payValues.email,

        phone: payValues.phone,

        country: payValues.country,

        message: formatPayNowShippingMessage(payValues),

        cart: items.map((item) => ({

          product_id: item.id,

          quantity: item.quantity,

          price: item.price_inr,

        })),

      };

      const created = await api.createCheckoutOrder(payload);

      setCreatedOrder(created);

      setIsResumedGuestOrder(false);

      setPaymentResult(null);

      persistGuestOrderIfNeeded(created);

    } catch (err: any) {

      setError(err.message || 'Failed to create order. Please review your cart and try again.');

    } finally {

      setIsSubmitting(false);

    }

  };



  const handleSubmitEnquiry = async (e: React.FormEvent) => {

    e.preventDefault();

    setIsSubmitting(true);

    setError(null);



    const productNames = items.map((i) => `${i.name} (${i.quantity}x ${i.pack_size || 'Retail'})`);



    try {

      const res: any = await api.submitEnquiry({

        company_name: quoteValues.companyName,

        contact_person: quoteValues.contactPerson,

        email: quoteValues.email,

        phone: quoteValues.phone,

        country: quoteValues.country,

        shipping_method: quoteValues.shippingMethod,

        incoterm: quoteValues.incoterm,

        payment_terms: quoteValues.paymentTerms,

        message: quoteValues.message,

        interested_products: productNames,

        quantity_requirement: `${items.reduce((acc, curr) => acc + curr.quantity, 0)} units total`,

      });

      setSubmittedCode(res.enquiry_code || 'ENQ-SUCCESS');

      clearCart();

    } catch (err: any) {

      setError(err.message || 'Failed to submit enquiry. Please try again.');

    } finally {

      setIsSubmitting(false);

    }

  };



  const loadRazorpaySdk = async (): Promise<boolean> => {

    if (typeof window === 'undefined') return false;

    if (window.Razorpay) return true;



    return new Promise((resolve) => {

      const script = document.createElement('script');

      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);

    });

  };



  const markOrderPaidLocally = (paymentStatus: string) => {

    clearGuestPendingOrder();

    clearCart();

    setPaymentResult(`Payment verified: ${paymentStatus}`);

    setCreatedOrder((prev) => (prev ? { ...prev, payment_status: paymentStatus } : prev));

    setIsResumedGuestOrder(false);

  };



  const abandonPendingGuestSession = (message: string) => {

    clearGuestPendingOrder();

    setCreatedOrder(null);

    setIsResumedGuestOrder(false);

    setError(message);

  };



  const handlePayNow = async () => {

    if (!createdOrder) return;



    setIsPaying(true);

    setError(null);

    setPaymentResult(null);



    try {

      const paymentOrder = await api.createOrderPayment(createdOrder.id, {

        order_access_token: createdOrder.order_access_token,

      });



      const sdkLoaded = await loadRazorpaySdk();

      if (!sdkLoaded || !window.Razorpay) {

        throw new Error('Unable to load Razorpay checkout. Please try again.');

      }



      const razorpay = new window.Razorpay({

        key: paymentOrder.key_id,

        amount: paymentOrder.amount,

        currency: paymentOrder.currency,

        order_id: paymentOrder.razorpay_order_id,

        name: 'BFF Foods',

        description: `Payment for ${createdOrder.order_code}`,

        handler: async (response: any) => {

          try {

            const verification = await api.verifyOrderPayment(createdOrder.id, {

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              order_access_token: createdOrder.order_access_token,

            });

            markOrderPaidLocally(verification.payment_status);

          } catch (verifyErr: any) {

            setError(verifyErr.message || 'Payment could not be verified by server.');

          }

        },

        prefill: {

          name: payValues.fullName,

          email: payValues.email,

          contact: payValues.phone,

        },

        notes: {

          order_id: createdOrder.id,

          order_code: createdOrder.order_code,

        },

        theme: {

          color: '#10B981',

        },

      });



      razorpay.on('payment.failed', () => {

        setError('Payment failed or was cancelled. You can retry Pay Now for the same order.');

      });



      razorpay.open();

    } catch (err: any) {

      const msg = err.message || 'Unable to initialize payment. Please try again.';

      if (/cancell|abandon|access token|not allowed|forbidden|does not exist/i.test(msg)) {

        abandonPendingGuestSession(msg);

      } else {

        setError(msg);

      }

    } finally {

      setIsPaying(false);

    }

  };



  const handleClose = () => {

    setSubmittedCode(null);

    if (createdOrder?.payment_status === 'Paid' || !createdOrder?.order_access_token) {

      setCreatedOrder(null);

      setIsResumedGuestOrder(false);

    } else if (createdOrder) {

      persistGuestOrderIfNeeded(createdOrder);

      setCreatedOrder(null);

      setIsResumedGuestOrder(false);

    }

    setPaymentResult(null);

    setIsCheckoutOpen(false);

  };



  const handleDismissPendingGuest = () => {

    clearGuestPendingOrder();

    setCreatedOrder(null);

    setIsResumedGuestOrder(false);

    setPaymentResult(null);

    setError(null);

  };



  const formatInrTotal = (amount: string | number, currency?: string) => {

    const num = Number(amount);

    if (currency === 'INR' || !currency) {

      return `₹${num.toLocaleString('en-IN')}`;

    }

    return `${currency} ${amount}`;

  };



  return (

    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

      <div

        className="relative w-full max-w-xl bg-[#0F172A] border border-sky-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"

        onClick={(e) => e.stopPropagation()}

      >

        <button

          onClick={handleClose}

          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"

        >

          <X className="w-5 h-5" />

        </button>



        {createdOrder ? (

          <div className="text-center py-8 space-y-4">

            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">

              <CheckCircle className="w-10 h-10" />

            </div>

            <h3 className="text-2xl font-bold text-white">

              {createdOrder.payment_status === 'Paid'

                ? 'Payment Complete'

                : isResumedGuestOrder

                  ? 'Resume Payment'

                  : 'Order Created Successfully'}

            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto">

              {createdOrder.payment_status === 'Paid' ? (

                <>

                  Order{' '}

                  <span className="font-mono text-emerald-400 font-bold">

                    {createdOrder.order_code || createdOrder.id}

                  </span>{' '}

                  is paid. Thank you.

                </>

              ) : isResumedGuestOrder ? (

                <>

                  You have an unpaid guest order{' '}

                  <span className="font-mono text-emerald-400 font-bold">

                    {createdOrder.order_code || createdOrder.id}

                  </span>

                  . Complete payment to finish checkout.

                </>

              ) : (

                <>

                  Your order{' '}

                  <span className="font-mono text-emerald-400 font-bold">

                    {createdOrder.order_code || createdOrder.id}

                  </span>{' '}

                  is ready. Complete payment below.

                </>

              )}

            </p>

            <p className="text-xs text-slate-400">

              Total:{' '}

              <span className="font-mono text-emerald-300 font-semibold">

                {formatInrTotal(createdOrder.total_amount, createdOrder.currency)}

              </span>{' '}

              | Status:{' '}

              <span className="font-semibold text-emerald-300">{createdOrder.payment_status}</span>

            </p>

            {paymentResult && <p className="text-xs text-emerald-300">{paymentResult}</p>}

            {error && <p className="text-xs text-red-300">{error}</p>}

            {createdOrder.payment_status !== 'Paid' && (

              <>

                <button

                  onClick={handlePayNow}

                  disabled={isPaying}

                  className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition"

                >

                  {isPaying ? 'Opening Payment...' : 'Pay Now'}

                </button>

                {isResumedGuestOrder && (

                  <button

                    type="button"

                    onClick={handleDismissPendingGuest}

                    className="mt-2 block mx-auto text-xs text-slate-400 hover:text-slate-200 underline"

                  >

                    Start a new order instead

                  </button>

                )}

              </>

            )}

            <button

              onClick={handleClose}

              className="mt-4 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-sm transition"

            >

              Back to Catalog

            </button>

          </div>

        ) : submittedCode ? (

          <div className="text-center py-8 space-y-4">

            <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/30 rounded-full flex items-center justify-center mx-auto text-sky-400">

              <CheckCircle className="w-10 h-10" />

            </div>

            <h3 className="text-2xl font-bold text-white">Quotation Request Received!</h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto">

              Your official quotation request reference code is{' '}

              <span className="font-mono text-sky-400 font-bold">{submittedCode}</span>. Our export

              sales manager will reach out within 12 business hours.

            </p>

            <button

              onClick={handleClose}

              className="mt-4 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-sm transition"

            >

              Back to Catalog

            </button>

          </div>

        ) : isPayMode ? (

          <div>

            <div className="mb-6">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">

                <Package className="w-3.5 h-3.5" /> Secure Checkout

              </div>

              <h2 className="text-2xl font-bold text-white">Pay Now</h2>

              <p className="text-xs text-slate-400 mt-1">

                Instant order for {items.length} item(s). All prices in INR — pay securely via

                Razorpay.

              </p>

            </div>



            <PayOrderSummary items={items} totalPrice={totalPrice} />



            {error && (

              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs">

                {error}

              </div>

            )}



            <PayNowCheckoutForm

              values={payValues}

              onChange={(patch) => setPayValues((prev) => ({ ...prev, ...patch }))}

              onSubmit={handleCreateOrder}

              isSubmitting={isSubmitting}

              onSwitchToQuote={() => openCheckout('quote')}

            />

          </div>

        ) : (

          <div>

            <div className="mb-6">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">

                <FileText className="w-3.5 h-3.5" /> Export Quote

              </div>

              <h2 className="text-2xl font-bold text-white">Request Export Quote</h2>

              <p className="text-xs text-slate-400 mt-1">

                Submit a bulk/export quotation request for {items.length} selected line(s). Our sales

                team will respond within 12 business hours.

              </p>

            </div>



            <QuoteOrderSummary items={items} totalPrice={totalPrice} />



            {error && (

              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs">

                {error}

              </div>

            )}



            <QuoteRequestForm

              values={quoteValues}

              onChange={(patch) => setQuoteValues((prev) => ({ ...prev, ...patch }))}

              onSubmit={handleSubmitEnquiry}

              isSubmitting={isSubmitting}

              onSwitchToPay={() => openCheckout('pay')}

            />

          </div>

        )}

      </div>

    </div>

  );

};


