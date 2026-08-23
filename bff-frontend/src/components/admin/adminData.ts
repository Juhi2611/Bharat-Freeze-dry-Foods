export interface StatCardItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  accent: string;
  iconName: string;
}

export interface EnquiryItem {
  /** UUID primary key — use for API PATCH/GET detail. */
  id: string;
  /** Human-readable enquiry_code for display only. */
  code?: string;
  company: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  interestedProducts: string[];
  quantity: string;
  privateLabel: string;
  packagingPreference: string;
  status: "New" | "Contacted" | "Pending" | "Closed";
  date: string;
  message: string;
  notes: string;
}

export interface AdminProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  packImage: string;
  price: string;
  status: "Published" | "Draft" | "Out of Stock";
  stock: number;
  exportReady: boolean;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "enquiry" | "upload" | "product" | "export";
}

export interface MediaFileItem {
  id: string;
  name: string;
  size: string;
  dimensions: string;
  category: string;
  url: string;
  uploadedAt: string;
}

export interface WebsiteSectionItem {
  id: string;
  title: string;
  subtitle: string;
  routeUrl: string;
  lastUpdated: string;
  status: "Active" | "Draft";
}

export const WEBSITE_SECTIONS: WebsiteSectionItem[] = [
  { id: "sec-hero", title: "Homepage Video Hero", subtitle: "Main title, typed subtitle, video background source, CTA buttons", routeUrl: "/", lastUpdated: "2026-07-25", status: "Active" },
  { id: "sec-about", title: "About & Freeze Drying Process", subtitle: "Brand story, sublimator technology steps, certification grid", routeUrl: "/about", lastUpdated: "2026-07-20", status: "Active" },
  { id: "sec-categories", title: "Category Showcase", subtitle: "6 human food categories & pet food showcase links", routeUrl: "/products", lastUpdated: "2026-07-25", status: "Active" },
  { id: "sec-b2b", title: "B2B Export Landing Page", subtitle: "Video hero, global partnership enquiry form, 12 industries served", routeUrl: "/b2b", lastUpdated: "2026-07-26", status: "Active" },
  { id: "sec-contact", title: "Contact & Global Offices", subtitle: "Official corporate email, phone, location map, quick enquiry", routeUrl: "/contact", lastUpdated: "2026-07-15", status: "Active" },
];

export interface OrderItem {
  id: string;
  customer: string;
  country: string;
  items: string;
  total: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  fulfillmentStatus: "Processing" | "Shipped" | "Delivered" | "Pending";
  date: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  totalOrders: number;
  lifetimeValue: string;
  tier: "VIP" | "Standard" | "Lead";
  status: "Active" | "Inactive";
}

export const DUMMY_ORDERS: OrderItem[] = [];

export const DUMMY_CUSTOMERS: CustomerItem[] = [];

export const DUMMY_STATS: StatCardItem[] = [];

export const DUMMY_ENQUIRIES: EnquiryItem[] = [];

export const DUMMY_PRODUCTS: AdminProductItem[] = [];

export const RECENT_ACTIVITIES: ActivityItem[] = [];

export const DUMMY_MEDIA: MediaFileItem[] = [];

export const COMPANY_SETTINGS = {
  companyName: "Bharat Freeze Dry Foods (BFF)",
  tagline: "Frozen at the Peak. Preserved for Life.",
  email: "",
  phone: "",
  whatsApp: "",
  address: "",
  websiteUrl: "",
  socialLinks: {
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
  },
};
