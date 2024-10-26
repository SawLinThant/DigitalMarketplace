import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "~/types/global";

export type CartItem = {
  product: Product;
  totalPrice: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearSingleItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.length > 0) {
            let productToAdd = state.items.find(
              (item) => item.product.id == product.id,
            );
            if (productToAdd) {
              const items = state.items.map((item) => {
                if (item.product.id === product.id) {
                  item.quantity += 1;
                  item.totalPrice =
                    parseFloat(item.product.price) * item.quantity;
                }
                return item;
              });
              return { items: [...items] };
            } else {
              return {
                items: [
                  ...state.items,
                  {
                    product: product,
                    totalPrice: parseInt(product.price),
                    quantity: 1,
                  },
                ],
              };
            }
          }

          return {
            items: [
              // ...state.items,
              {
                product: product,
                totalPrice: parseInt(product.price),
                quantity: 1,
              },
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => {
          let productToRemove = state.items.find(
            (item) => item.product.id == id,
          );
          if (productToRemove?.quantity) {
            if (productToRemove.quantity > 1) {
              const items = state.items.map((item) => {
                if (item.product.id === id) {
                  item.quantity -= 1;
                  item.totalPrice =
                    parseFloat(item.product.price) * item.quantity;
                }
                return item;
              });
              return { items: [...items] };
            } else if (productToRemove.quantity <= 1) {
              return {
                items: state.items.filter((item) => item.product.id !== id),
              };
            }
          }
          return {
            items: state.items,
          };
        }),
      clearSingleItem: (id) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== id),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
