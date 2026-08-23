/**
 * API origin including `/api/v1` prefix.
 * Local default is fine for `npm run dev`. Staging/production builds MUST set
 * VITE_API_BASE_URL (see `.env.example`).
 */
const API_BASE_URL = (
  // Use localhost (not 127.0.0.1) so SPA on localhost:* is same-site as the API
  // and the httpOnly refresh cookie is sent on silent refresh after page reload.
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
).replace(/\/$/, '');

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  country?: string;
  role: 'super_admin' | 'export_manager' | 'content_editor' | 'customer';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthTokens {
  access: string;
  user: UserProfile;
}

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category?: string;
  category_name?: string;
  category_slug?: string;
  pack_image: string;
  ingredient_image: string;
  accent_color: string;
  price_inr: string | number;
  is_organic: boolean;
  white_label_available: boolean;
  export_ready: boolean;
  blurb: string;
  full_description?: string;
  stock_quantity?: number;
  status: string;
  recipe?: ApiRecipe | null;
  interactive_experience?: ApiInteractiveExperience | null;
}

export interface ApiRecipe {
  id?: number;
  product: string;
  slug: string;
  title: string;
  description: string;
  video_url: string;
  prep_time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  calories?: string | null;
}

export interface ApiInteractiveExperience {
  id?: number;
  product: string;
  title: string;
  description: string;
  features: string[];
  video_url: string;
  ingredient_benefits: Array<Record<string, string>>;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  availability: 'available' | 'coming_soon' | 'custom_dev';
  display_order: number;
  product_count: number;
  created_at?: string;
}

export interface ApiEnquiry {
  id: string;
  enquiry_code: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  interested_products: string[];
  quantity_requirement: string;
  private_label_required: boolean;
  packaging_preference: string;
  status: string;
  message: string;
  internal_notes: string;
  created_at: string;
  updated_at: string;
}

export interface ApiPrivateLabelEnquiry extends ApiEnquiry {
  brand_name: string;
  step_completed: number;
}

export interface ApiCustomer {
  id: string;
  customer_code: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  country: string;
  tier: 'VIP' | 'Standard' | 'Lead';
  is_active: boolean;
  created_at: string;
  total_orders: number;
  lifetime_value: string | number;
}

export interface ApiOrder {
  id: string;
  order_code: string;
  customer: string | null;
  customer_name?: string;
  customer_company?: string;
  items_summary: string;
  total_amount: string | number;
  currency: string;
  payment_status: string;
  fulfillment_status: string;
  order_date: string;
  items?: ApiOrderItem[];
  order_access_token?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_country?: string;
  is_domestic?: boolean;
  payment_rail?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  source_enquiry?: string | null;
  source_private_label_enquiry?: string | null;
  created_at?: string;
}

export interface ApiOrderItem {
  id: number;
  order: string;
  product: string | null;
  product_name_snapshot: string;
  unit_price_snapshot: string;
  quantity: number;
  total_price: string;
}

export interface CheckoutCartLineInput {
  product_id: string;
  quantity: number;
  price?: string | number;
}

export interface CheckoutOrderInput {
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  country: string;
  shipping_method?: string;
  incoterm?: string;
  payment_terms?: string;
  message?: string;
  cart: CheckoutCartLineInput[];
}

export interface CreatePaymentOrderInput {
  order_access_token?: string;
}

export interface CreatePaymentOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  key_id: string;
}

export interface VerifyPaymentInput {
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_access_token?: string;
}

export interface ApiMediaFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size_mb: string | number;
  dimensions: string;
  category: string;
  uploaded_by_name?: string;
  uploaded_at: string;
}

export interface ApiActivityLog {
  id: string;
  user: string | null;
  user_name: string;
  action: string;
  target: string;
  activity_type: string;
  created_at: string;
}

export interface FxRateResponse {
  inr_per_usd: number;
  base_currency: string;
  quote_currency: string;
  source?: string;
  cached?: boolean;
  fallback?: 'last_good' | 'static';
}

export interface PublicContactResponse {
  whatsapp_number: string;
  support_phone: string;
  support_email: string;
}

type ApiList<T> = { results: T[] } | T[];

const unwrapList = <T>(response: ApiList<T>): T[] =>
  Array.isArray(response) ? response : response.results;

// F5 interim hybrid auth:
// - access token: in-memory only (not localStorage) — mitigates persistent XSS theft
// - refresh token: httpOnly Secure cookie set by the backend — JS cannot read it
// - CSRF: double-submit cookie; X-CSRFToken required on refresh/logout
let memoryAccessToken: string | null = null;

export const getStoredToken = (): string | null => memoryAccessToken;

export const setAccessToken = (access: string | null) => {
  memoryAccessToken = access;
};

export const clearStoredTokens = () => {
  memoryAccessToken = null;
  memoryCsrfToken = null;
  if (typeof window !== 'undefined') {
    // Clear legacy keys from earlier localStorage-based auth.
    localStorage.removeItem('bff_access_token');
    localStorage.removeItem('bff_refresh_token');
    localStorage.removeItem('bff_user');
  }
};

/** @deprecated use setAccessToken — kept for call-site compatibility during migration */
export const setStoredTokens = (access: string, _refresh?: string) => {
  setAccessToken(access);
};

let refreshPromise: Promise<string | null> | null = null;
let csrfPromise: Promise<string | null> | null = null;
// Cached CSRF token from /auth/csrf/ JSON body (cross-origin SPAs cannot read API cookies via document.cookie).
let memoryCsrfToken: string | null = null;

const forceLogout = () => {
  clearStoredTokens();
  if (typeof window !== 'undefined') {
    window.location.assign(window.location.pathname.startsWith('/admin') ? '/admin/login' : '/');
  }
};

function readCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfToken(): Promise<string | null> {
  const existing = memoryCsrfToken || readCsrfTokenFromCookie();
  if (existing) {
    memoryCsrfToken = existing;
    return existing;
  }
  if (csrfPromise) return csrfPromise;

  csrfPromise = fetch(`${API_BASE_URL}/auth/csrf/`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) return memoryCsrfToken || readCsrfTokenFromCookie();
      const data = await response.json().catch(() => ({})) as { csrfToken?: string };
      memoryCsrfToken = data.csrfToken || readCsrfTokenFromCookie();
      return memoryCsrfToken;
    })
    .catch(() => null)
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

/**
 * Silent refresh via httpOnly cookie. Returns access token or null.
 * When `redirectOnFailure` is false (app boot), do not hard-redirect — just clear memory.
 */
export const refreshAccessToken = async (
  redirectOnFailure = true,
): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const csrf = await ensureCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrf) headers['X-CSRFToken'] = csrf;

    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      clearStoredTokens();
      if (redirectOnFailure) forceLogout();
      return null;
    }
    const tokens = await response.json() as { access: string };
    setAccessToken(tokens.access);
    return tokens.access;
  })()
    .catch(() => {
      clearStoredTokens();
      if (redirectOnFailure) forceLogout();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

function formatApiError(errorData: Record<string, unknown>): string {
  if (typeof errorData.detail === 'string') return errorData.detail;
  if (typeof errorData.error === 'string') return errorData.error;

  const first = Object.values(errorData)[0];
  if (typeof first === 'string') return first;
  if (Array.isArray(first) && first.length > 0) {
    return typeof first[0] === 'string' ? first[0] : String(first[0]);
  }
  if (first && typeof first === 'object') {
    return formatApiError(first as Record<string, unknown>);
  }
  return 'API request failed';
}

// Generic fetch wrapper with Bearer access token from memory + credentialed cookies
async function request<T>(endpoint: string, options: RequestInit = {}, canRefresh = true): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Try cookie refresh on 401 (even if memory access is already gone).
  if (response.status === 401 && canRefresh) {
    const refreshedToken = await refreshAccessToken(true);
    if (refreshedToken) {
      return request<T>(endpoint, { ...options }, false);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(formatApiError(errorData));
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

async function requestBlob(endpoint: string, canRefresh = true): Promise<Blob> {
  const token = getStoredToken();
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && canRefresh) {
    const refreshedToken = await refreshAccessToken(true);
    if (refreshedToken) {
      return requestBlob(endpoint, false);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || 'API request failed');
  }
  return response.blob();
}

/**
 * Login/register must not use `request()` — a stale access token + 401 would
 * trigger refreshAccessToken(true) → forceLogout and bounce the user away
 * instead of surfacing "invalid credentials".
 */
async function authCredentialPost<T>(endpoint: string, body: unknown): Promise<T> {
  const csrf = await ensureCsrfToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (csrf) headers['X-CSRFToken'] = csrf;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(formatApiError(errorData as Record<string, unknown>));
  }

  return response.json() as Promise<T>;
}

// API methods
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const tokens = await authCredentialPost<{ access: string }>('/auth/login/', {
      email,
      password,
    });
    setAccessToken(tokens.access);
    // Refresh cookie is set by the server (httpOnly); never stored in JS.
    const user = await request<UserProfile>('/auth/me/');
    return { access: tokens.access, user };
  },

  register: async (payload: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    company_name?: string;
    country?: string;
  }): Promise<AuthTokens> => {
    const res = await authCredentialPost<{ access: string; user: UserProfile }>(
      '/auth/register/',
      payload,
    );
    setAccessToken(res.access);
    return { access: res.access, user: res.user };
  },

  sendEmailOtp: (email: string) =>
    request<{ detail: string }>('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyEmailOtp: (email: string, otp: string) =>
    request<{ detail: string; email: string; verified: boolean }>('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  logout: async (): Promise<void> => {
    try {
      const csrf = await ensureCsrfToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (csrf) headers['X-CSRFToken'] = csrf;
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({}),
      });
    } finally {
      clearStoredTokens();
    }
  },

  getMe: (): Promise<UserProfile> => request<UserProfile>('/auth/me/'),

  updateMe: (data: Partial<Pick<UserProfile, 'full_name' | 'company_name' | 'country' | 'avatar_url'>>) =>
    request<UserProfile>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Catalog
  getProducts: (categorySlug?: string): Promise<{ results: ApiProduct[] } | ApiProduct[]> => {
    const query = categorySlug ? `?category__slug=${categorySlug}` : '';
    return request<any>(`/products/${query}`);
  },

  getProduct: (slug: string): Promise<ApiProduct> => request<ApiProduct>(`/products/${slug}/`),
  getRecipes: async () => unwrapList(await request<ApiList<ApiRecipe>>('/recipes/')),
  getInteractiveExperiences: async () => unwrapList(await request<ApiList<ApiInteractiveExperience>>('/interactive-experiences/')),

  getCategories: async (): Promise<ApiCategory[]> =>
    unwrapList(await request<ApiList<ApiCategory>>('/categories/')),

  getCategory: (id: string): Promise<ApiCategory> => request<ApiCategory>(`/categories/${id}/`),

  createCategory: (data: Partial<ApiCategory>) => request<ApiCategory>('/categories/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateCategory: (id: string, data: Partial<ApiCategory>) => request<ApiCategory>(`/categories/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  deleteCategory: (id: string) => request<void>(`/categories/${id}/`, { method: 'DELETE' }),

  getFxRate: async (): Promise<FxRateResponse> => {
    const response = await fetch(`${API_BASE_URL}/fx-rate/`, { credentials: 'include' });
    if (!response.ok) throw new Error('FX rate unavailable');
    return response.json();
  },

  getPublicContact: async (): Promise<PublicContactResponse> => {
    const response = await fetch(`${API_BASE_URL}/cms/public-contact/`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Public contact unavailable');
    return response.json();
  },

  createProduct: (data: Partial<ApiProduct>) => request<ApiProduct>('/products/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateProduct: (slug: string, data: Partial<ApiProduct>) => request<ApiProduct>(`/products/${slug}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  deleteProduct: (slug: string) => request<void>(`/products/${slug}/`, { method: 'DELETE' }),

  getEnquiries: async (params = '') => unwrapList(await request<ApiList<ApiEnquiry>>(`/enquiries/${params}`)),
  updateEnquiry: (id: string, data: Partial<ApiEnquiry>) => request<ApiEnquiry>(`/enquiries/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  getPrivateLabelEnquiries: async () => unwrapList(await request<ApiList<ApiPrivateLabelEnquiry>>('/private-label-enquiries/')),

  getCustomers: async () => unwrapList(await request<ApiList<ApiCustomer>>('/customers/')),
  getCustomerOrders: async (id: string) => unwrapList(await request<ApiList<ApiOrder>>(`/customers/${id}/orders/`)),
  createCustomer: (data: Partial<ApiCustomer>) => request<ApiCustomer>('/customers/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCustomer: (id: string, data: Partial<ApiCustomer>) => request<ApiCustomer>(`/customers/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  getOrders: async () => unwrapList(await request<ApiList<ApiOrder>>('/orders/')),
  getOrder: (id: string) => request<ApiOrder>(`/orders/${id}/`),
  updateOrder: (id: string, data: Partial<ApiOrder>) => request<ApiOrder>(`/orders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  downloadOrderInvoice: (id: string) => requestBlob(`/orders/${id}/invoice/`),
  getMyOrders: async () => unwrapList(await request<ApiList<ApiOrder>>('/orders/mine/')),
  getMyOrder: (id: string) => request<ApiOrder>(`/orders/mine/${id}/`),
  getMediaFiles: async () => unwrapList(await request<ApiList<ApiMediaFile>>('/media/files/')),
  deleteMediaFile: (id: string) => request<void>(`/media/files/${id}/`, { method: 'DELETE' }),

  uploadMediaFile: async (file: File, category = 'Categories'): Promise<ApiMediaFile> => {
    const token = getStoredToken();
    const body = new FormData();
    body.append('file', file);
    body.append('category', category);

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/media/files/`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body,
    });

    if (response.status === 401) {
      const refreshed = await refreshAccessToken(true);
      if (refreshed) return api.uploadMediaFile(file, category);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatApiError(errorData as Record<string, unknown>));
    }
    return response.json();
  },
  getActivityLogs: async () => unwrapList(await request<ApiList<ApiActivityLog>>('/activity/logs/')),
  getAdminUsers: async () => unwrapList(await request<ApiList<UserProfile>>('/admin/users/')),

  getWebsiteSections: async () => unwrapList(await request<ApiList<Record<string, unknown>>>('/cms/sections/')),
  updateWebsiteSection: (id: string, data: Record<string, unknown>) => request<Record<string, unknown>>(`/cms/sections/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  getSiteSettings: () => request<Record<string, unknown>>('/cms/settings'),
  updateSiteSettings: (data: Record<string, unknown>) => request<Record<string, unknown>>('/cms/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getSubscribers: async () => unwrapList(await request<ApiList<Record<string, unknown>>>('/newsletter/subscribers/')),

  // Enquiries
  submitEnquiry: (data: any) => request('/enquiries/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  createCheckoutOrder: (data: CheckoutOrderInput) => request<ApiOrder>('/orders/checkout/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  createOrderPayment: (orderId: string, data: CreatePaymentOrderInput = {}) =>
    request<CreatePaymentOrderResponse>(`/orders/${orderId}/create-payment/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyOrderPayment: (orderId: string, data: VerifyPaymentInput) =>
    request<{ order_id: string; payment_status: string; razorpay_payment_id: string }>(
      `/orders/${orderId}/verify-payment/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  submitPrivateLabelEnquiry: (data: any) => request('/private-label-enquiries/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updatePrivateLabelEnquiry: (id: string, data: any) => request(`/private-label-enquiries/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};
