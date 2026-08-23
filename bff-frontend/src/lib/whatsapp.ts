/**
 * Storefront WhatsApp / phone — loaded from GET /api/v1/cms/public-contact/.
 * Falls back to constants below if the API is unreachable.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
).replace(/\/$/, '');

export const FALLBACK_WHATSAPP_NUMBER = '919993377038';
export const FALLBACK_PHONE_DISPLAY = '+91 99933 77038';
export const FALLBACK_PHONE_TEL = '+919993377038';

let whatsappDigits = FALLBACK_WHATSAPP_NUMBER;
let phoneDisplay = FALLBACK_PHONE_DISPLAY;
let phoneTel = FALLBACK_PHONE_TEL;
let contactLoaded = false;

/** Strip non-digits for wa.me links (keeps country code). */
export function normalizeWhatsAppDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits || FALLBACK_WHATSAPP_NUMBER;
}

export function getWhatsAppNumber(): string {
  return whatsappDigits;
}

export function getPhoneDisplay(): string {
  return phoneDisplay;
}

export function getPhoneTel(): string {
  return phoneTel;
}

export function isPublicContactLoaded(): boolean {
  return contactLoaded;
}

/** Fetch CMS public contact and update module state (safe to call multiple times). */
export async function loadPublicContact(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/public-contact/`, {
      credentials: 'include',
    });
    if (!response.ok) return;
    const data = (await response.json()) as {
      whatsapp_number?: string;
      support_phone?: string;
    };
    if (data.whatsapp_number) {
      whatsappDigits = normalizeWhatsAppDigits(data.whatsapp_number);
      phoneDisplay = data.whatsapp_number;
      phoneTel = data.support_phone || data.whatsapp_number;
      contactLoaded = true;
    }
  } catch {
    /* keep fallback */
  }
}

export function buildWhatsAppLink(productName?: string, quantity?: number, message?: string) {
  let msg: string;
  if (message) {
    msg = message;
  } else if (productName) {
    msg = `Hi BFF! I'd like to inquire about *${productName}*${
      quantity ? ` — Quantity: ${quantity} pack${quantity > 1 ? 's' : ''}` : ''
    }. Please share pricing and export details.`;
  } else {
    msg = "Hi BFF! I'd like to know more about your freeze-dried products.";
  }
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(msg)}`;
}

/** @deprecated use getWhatsAppNumber — kept for older imports */
export const WHATSAPP_NUMBER = FALLBACK_WHATSAPP_NUMBER;
export const PHONE_DISPLAY = FALLBACK_PHONE_DISPLAY;
export const PHONE_TEL = FALLBACK_PHONE_TEL;

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  youtube: 'https://youtube.com/',
  pinterest: 'https://pinterest.com/',
  linkedin: 'https://linkedin.com/',
  twitter: 'https://x.com/',
  snapchat: 'https://snapchat.com/',
};
