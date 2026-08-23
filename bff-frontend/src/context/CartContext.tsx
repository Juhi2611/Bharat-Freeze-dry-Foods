import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/** Catalog product UUID — the only valid cart/checkout product identifier. */
const CATALOG_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isCatalogProductId(value: unknown): value is string {
  return typeof value === 'string' && CATALOG_UUID_RE.test(value);
}

export interface CartItem {
  id: string; // catalog product UUID (sent as product_id at checkout)
  sku: string;
  name: string;
  price_inr: number;
  pack_image: string;
  accent_color?: string;
  quantity: number;
  pack_size?: string;
}

export type CheckoutMode = 'pay' | 'quote';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number, pack_size?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutMode: CheckoutMode;
  openCheckout: (mode: CheckoutMode) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('bff_cart');
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    // Drop legacy rows that used SKU/name as id (would 400 at checkout).
    return parsed.filter(
      (item) => item && isCatalogProductId(item.id) && typeof item.name === 'string',
    ) as CartItem[];
  } catch (e) {
    console.error('Error parsing cart:', e);
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('pay');

  const openCheckout = useCallback((mode: CheckoutMode) => {
    setCheckoutMode(mode);
    setIsCheckoutOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bff_cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (product: any, quantity = 1, pack_size = 'Retail Pouch') => {
    // Never fall back to SKU/name — checkout product_id must be the catalog UUID.
    if (!isCatalogProductId(product?.id)) {
      console.error('Cannot add to cart: expected catalog product UUID on product.id', product);
      return;
    }
    const productId = product.id as string;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === productId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: productId,
        sku: product.sku || '',
        name: product.name,
        price_inr: Number(product.price_inr || product.price || 250),
        pack_image: product.pack_image || product.image || '/assets/products/default.png',
        accent_color: product.accent_color || '#4FA8D8',
        quantity,
        pack_size,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price_inr * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutMode,
        openCheckout,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
