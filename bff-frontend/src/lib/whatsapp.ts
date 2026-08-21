// Placeholder WhatsApp business number. Replace with real number.
export const WHATSAPP_NUMBER = "919993377038";
export const PHONE_DISPLAY = "+91 99933 77038";
export const PHONE_TEL = "+919993377038";

export function buildWhatsAppLink(productName?: string, quantity?: number) {
  let msg: string;
  if (productName) {
    msg = `Hi BFF! I'd like to inquire about *${productName}*${
      quantity ? ` — Quantity: ${quantity} pack${quantity > 1 ? "s" : ""}` : ""
    }. Please share pricing and export details.`;
  } else {
    msg = "Hi BFF! I'd like to know more about your freeze-dried products.";
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  youtube: "https://youtube.com/",
  pinterest: "https://pinterest.com/",
  linkedin: "https://linkedin.com/",
  twitter: "https://x.com/",
  snapchat: "https://snapchat.com/",
};
