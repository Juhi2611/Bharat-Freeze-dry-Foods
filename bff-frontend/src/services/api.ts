const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  country?: string;
  role: 'super_admin' | 'export_manager' | 'content_editor' | 'customer';
  avatar_url?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
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
  status: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  availability: 'available' | 'coming_soon' | 'custom_dev';
  display_order: number;
}

// Token helper
export const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bff_access_token');
  }
  return null;
};

export const setStoredTokens = (access: string, refresh: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bff_access_token', access);
    localStorage.setItem('bff_refresh_token', refresh);
  }
};

export const clearStoredTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bff_access_token');
    localStorage.removeItem('bff_refresh_token');
    localStorage.removeItem('bff_user');
  }
};

// Generic fetch wrapper with auth header
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || errorData.error || Object.values(errorData)[0] || 'API request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return response.json();
}

// API methods
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<AuthTokens> => {
    const tokens = await request<{ access: string; refresh: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredTokens(tokens.access, tokens.refresh);
    
    // Fetch profile
    const user = await request<UserProfile>('/auth/me/');
    if (typeof window !== 'undefined') {
      localStorage.setItem('bff_user', JSON.stringify(user));
    }
    return { ...tokens, user };
  },

  register: async (payload: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    company_name?: string;
    country?: string;
  }): Promise<AuthTokens> => {
    const res = await request<{ access: string; refresh: string; user: UserProfile }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredTokens(res.access, res.refresh);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bff_user', JSON.stringify(res.user));
    }
    return res;
  },

  getMe: (): Promise<UserProfile> => request<UserProfile>('/auth/me/'),

  // Catalog
  getProducts: (categorySlug?: string): Promise<{ results: ApiProduct[] } | ApiProduct[]> => {
    const query = categorySlug ? `?category__slug=${categorySlug}` : '';
    return request<any>(`/products/${query}`);
  },

  getCategories: (): Promise<{ results: ApiCategory[] } | ApiCategory[]> => {
    return request<any>('/categories/');
  },

  // Enquiries
  submitEnquiry: (data: any) => request('/enquiries/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  submitPrivateLabelEnquiry: (data: any) => request('/private-label-enquiries/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updatePrivateLabelEnquiry: (id: string, data: any) => request(`/private-label-enquiries/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};
