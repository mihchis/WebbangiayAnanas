import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productVariantId: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    isSale?: boolean;
    style: string;
    gender: string;
  };
  color: {
    id: number;
    name: string;
    hexCode: string;
  };
  size: {
    id: number;
    value: string;
  };
  image: string; // The primary image URL
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart
      addItem: (newItem, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productVariantId === newItem.productVariantId,
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.productVariantId === newItem.productVariantId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...newItem, quantity }],
          });
        }
      },

      // Remove item from cart
      removeItem: (productVariantId) => {
        set({
          items: get().items.filter((item) => item.productVariantId !== productVariantId),
        });
      },

      // Update quantity
      updateQuantity: (productVariantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productVariantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productVariantId === productVariantId ? { ...item, quantity } : item,
          ),
        });
      },

      // Clear the entire cart
      clearCart: () => set({ items: [] }),

      // Helpers
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + Number(item.product.price) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'ananas-shopping-cart', // key for localStorage
    },
  ),
);
