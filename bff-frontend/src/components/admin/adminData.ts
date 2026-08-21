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
  id: string;
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

export const DUMMY_ORDERS: OrderItem[] = [
  {
    id: "ORD-8901",
    customer: "Apex Global Foods LLC",
    country: "United States",
    items: "5x 1-Ton Alphonso Mango Slices (FCL)",
    total: "$48,500",
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    date: "2026-07-25",
  },
  {
    id: "ORD-8902",
    customer: "EuroGourmet HoReCa",
    country: "Germany",
    items: "2x 500kg Velvet Red Gravy Base",
    total: "€14,200",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    date: "2026-07-24",
  },
  {
    id: "ORD-8903",
    customer: "Al-Khaleej Distribution",
    country: "UAE",
    items: "10x 1-Ton Pre-Cooked Biryani Packs",
    total: "$92,000",
    paymentStatus: "Pending",
    fulfillmentStatus: "Pending",
    date: "2026-07-23",
  },
  {
    id: "ORD-8904",
    customer: "Nippon Wellness Products",
    country: "Japan",
    items: "1x 500kg Organic Moringa Powder",
    total: "¥3,800,000",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    date: "2026-07-20",
  },
  {
    id: "ORD-8905",
    customer: "Nordic Adventure Ration Co",
    country: "Norway",
    items: "3x 500kg Salmon Dog Treats",
    total: "$28,400",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    date: "2026-07-19",
  },
];

export const DUMMY_CUSTOMERS: CustomerItem[] = [
  {
    id: "CUST-401",
    name: "Sarah Jenkins",
    company: "Apex Global Foods LLC",
    country: "United States",
    email: "sarah@apexglobal.com",
    phone: "+1 (555) 019-2834",
    totalOrders: 12,
    lifetimeValue: "$240,000",
    tier: "VIP",
    status: "Active",
  },
  {
    id: "CUST-402",
    name: "Markus Webber",
    company: "EuroGourmet HoReCa",
    country: "Germany",
    email: "m.webber@eurogourmet.de",
    phone: "+49 89 1234 5678",
    totalOrders: 6,
    lifetimeValue: "€84,500",
    tier: "VIP",
    status: "Active",
  },
  {
    id: "CUST-403",
    name: "Tariq Al-Mansoor",
    company: "Al-Khaleej Distribution",
    country: "United Arab Emirates",
    email: "tariq@alkhaleej.ae",
    phone: "+971 4 987 6543",
    totalOrders: 3,
    lifetimeValue: "$115,000",
    tier: "Standard",
    status: "Active",
  },
  {
    id: "CUST-404",
    name: "Kenji Sato",
    company: "Nippon Wellness Products",
    country: "Japan",
    email: "kenji@nipponwellness.jp",
    phone: "+81 3 1111 2222",
    totalOrders: 8,
    lifetimeValue: "$98,000",
    tier: "VIP",
    status: "Active",
  },
  {
    id: "CUST-405",
    name: "Astrid Lindgren",
    company: "Nordic Adventure Ration Co",
    country: "Norway",
    email: "astrid@nordicration.no",
    phone: "+47 22 33 44 55",
    totalOrders: 2,
    lifetimeValue: "$42,000",
    tier: "Lead",
    status: "Active",
  },
];

export const DUMMY_STATS: StatCardItem[] = [
  { id: "1", title: "Total Products", value: "48", change: "+12% this month", trend: "up", accent: "#4FA8D8", iconName: "Package" },
  { id: "2", title: "New Enquiries", value: "128", change: "+24% this week", trend: "up", accent: "#E1B84A", iconName: "Mail" },
  { id: "3", title: "Countries Reached", value: "28", change: "+3 new nations", trend: "up", accent: "#5FA755", iconName: "Globe" },
  { id: "4", title: "Pending Requests", value: "14", change: "Requires action", trend: "neutral", accent: "#E1832E", iconName: "Clock" },
  { id: "5", title: "Private Label Leads", value: "42", change: "High conversion", trend: "up", accent: "#D19A2E", iconName: "Tag" },
  { id: "6", title: "Website Visitors", value: "45.2k", change: "+18.4% growth", trend: "up", accent: "#8ABB4A", iconName: "Users" },
];

export const DUMMY_ENQUIRIES: EnquiryItem[] = [
  {
    id: "ENQ-9081",
    company: "Apex Global Foods LLC",
    country: "United States",
    contactPerson: "Sarah Jenkins",
    email: "sarah@apexglobal.com",
    phone: "+1 (555) 019-2834",
    interestedProducts: ["Freeze-Dried Fruits", "Superfood Powders"],
    quantity: "5 - 20 Tons (FCL)",
    privateLabel: "Yes",
    packagingPreference: "Bulk",
    status: "New",
    date: "2026-07-25",
    message: "We are interested in sourcing 10 metric tons of Alphonso Mango dice & Moringa powder for our organic cereal line in the US.",
    notes: "Requires US FDA compliance certificate and moisture test report under 2%.",
  },
  {
    id: "ENQ-9082",
    company: "EuroGourmet HoReCa Import",
    country: "Germany",
    contactPerson: "Markus Webber",
    email: "m.webber@eurogourmet.de",
    phone: "+49 89 1234 5678",
    interestedProducts: ["Gravy & Sauce Bases", "Pre-Cooked Ready Meals"],
    quantity: "1 - 5 Tons",
    privateLabel: "No",
    packagingPreference: "Food Service",
    status: "Contacted",
    date: "2026-07-24",
    message: "Seeking instant red & white gravy bases for 120 hotel kitchens across Bavaria.",
    notes: "Sent sample kit via DHL on July 24.",
  },
  {
    id: "ENQ-9083",
    company: "Al-Khaleej Distribution",
    country: "United Arab Emirates",
    contactPerson: "Tariq Al-Mansoor",
    email: "tariq@alkhaleej.ae",
    phone: "+971 4 987 6543",
    interestedProducts: ["Freeze-Dried Fruits", "Pre-Cooked Ready Meals"],
    quantity: "20+ Tons",
    privateLabel: "Yes",
    packagingPreference: "Retail Packs",
    status: "Pending",
    date: "2026-07-23",
    message: "Full container shipment required for Dubai retail chain. Custom stand-up pouch packaging with Arabic nutrition labeling.",
    notes: "Artwork in review by compliance team.",
  },
  {
    id: "ENQ-9084",
    company: "Nippon Wellness Products",
    country: "Japan",
    contactPerson: "Kenji Sato",
    email: "kenji@nipponwellness.jp",
    phone: "+81 3 1111 2222",
    interestedProducts: ["Superfood Powders", "Freeze-Dried Spices"],
    quantity: "500 kg - 1 Ton",
    privateLabel: "Yes",
    packagingPreference: "Retail Packs",
    status: "Closed",
    date: "2026-07-20",
    message: "Contract finalized for organic turmeric powder & moringa capsules packaging.",
    notes: "Deposit received. Batch 04 in production.",
  },
  {
    id: "ENQ-9085",
    company: "Nordic Adventure Ration Co",
    country: "Norway",
    contactPerson: "Astrid Lindgren",
    email: "astrid@nordicration.no",
    phone: "+47 22 33 44 55",
    interestedProducts: ["Pre-Cooked Ready Meals", "Pet Food Ingredients"],
    quantity: "1 - 5 Tons",
    privateLabel: "Yes",
    packagingPreference: "Bulk",
    status: "New",
    date: "2026-07-25",
    message: "Inquiring about high-protein freeze-dried salmon and biryani ready-meals for outdoor expeditions.",
    notes: "Needs cold-resistance foil packaging test.",
  },
];

export const DUMMY_PRODUCTS: AdminProductItem[] = [
  {
    id: "PROD-01",
    name: "Alphonso Mango Slices",
    category: "Fruits",
    packImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
    price: "₹399",
    status: "Published",
    stock: 1420,
    exportReady: true,
  },
  {
    id: "PROD-02",
    name: "Organic Moringa Powder",
    category: "Superfoods",
    packImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    price: "₹499",
    status: "Published",
    stock: 980,
    exportReady: true,
  },
  {
    id: "PROD-03",
    name: "Velvet Red Gravy Base",
    category: "Gravies",
    packImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
    price: "₹299",
    status: "Published",
    stock: 2150,
    exportReady: true,
  },
  {
    id: "PROD-04",
    name: "Biryani Ready Meal",
    category: "Pre-Cooked Meals",
    packImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
    price: "₹449",
    status: "Published",
    stock: 840,
    exportReady: true,
  },
  {
    id: "PROD-05",
    name: "Crisp Green Peas",
    category: "Vegetables",
    packImage: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&q=80&w=400",
    price: "₹249",
    status: "Draft",
    stock: 0,
    exportReady: false,
  },
  {
    id: "PROD-06",
    name: "Freeze-Dried Salmon Dog Treats",
    category: "Pet Food",
    packImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400",
    price: "₹649",
    status: "Published",
    stock: 620,
    exportReady: true,
  },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  { id: "act-1", user: "Export Specialist", action: "received new FCL inquiry from", target: "Apex Global Foods (USA)", time: "12 mins ago", type: "enquiry" },
  { id: "act-2", user: "Content Manager", action: "uploaded 4 high-res pack renders to", target: "Media Library", time: "45 mins ago", type: "upload" },
  { id: "act-3", user: "Admin", action: "updated price & export compliance on", target: "Alphonso Mango Slices", time: "2 hours ago", type: "product" },
  { id: "act-4", user: "Logistics Desk", action: "generated certificate of origin for", target: "Container #BFF-9021", time: "4 hours ago", type: "export" },
  { id: "act-5", user: "System", action: "completed daily database backup", target: "Cloud Storage", time: "6 hours ago", type: "upload" },
];

export const DUMMY_MEDIA: MediaFileItem[] = [
  { id: "m-1", name: "mango_pack_render_4k.webp", size: "2.4 MB", dimensions: "3840 x 2160", category: "Products", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-07-24" },
  { id: "m-2", name: "moringa_powder_hero.webp", size: "1.8 MB", dimensions: "2560 x 1440", category: "Superfoods", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-07-23" },
  { id: "m-3", name: "b2b_container_loading.webp", size: "3.1 MB", dimensions: "4096 x 2304", category: "B2B Export", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-07-22" },
  { id: "m-4", name: "biryani_pack_front.webp", size: "2.1 MB", dimensions: "3000 x 3000", category: "Meals", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400", uploadedAt: "2026-07-21" },
];

export const COMPANY_SETTINGS = {
  companyName: "Bharat Freeze Dry Foods (BFF)",
  tagline: "Frozen at the Peak. Preserved for Life.",
  email: "export@bff-foods.com",
  phone: "+91 98765 43210",
  whatsApp: "+91 98765 43210",
  address: "Plot 42, Export Processing Zone, Industrial Park, Gujarat, India",
  websiteUrl: "https://bff-foods.com",
  socialLinks: {
    linkedin: "https://linkedin.com/company/bff-foods",
    instagram: "https://instagram.com/bff_foods",
    facebook: "https://facebook.com/bff.foods",
    twitter: "https://twitter.com/bff_foods",
  },
  adminProfile: {
    name: "Juhi Patel",
    role: "Chief Export Director",
    email: "juhi@bff-foods.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
};
