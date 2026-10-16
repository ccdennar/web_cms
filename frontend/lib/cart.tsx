"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type { OrderItem } from "./payload";

type CartContextType = {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (pastryId: string) => void;
  updateQty: (pastryId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = useCallback((item: OrderItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.pastryId === item.pastryId);
      if (existing) {
        return prev.map((i) =>
          i.pastryId === item.pastryId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((pastryId: string) => {
    setItems((prev) => prev.filter((i) => i.pastryId !== pastryId));
  }, []);

  const updateQty = useCallback((pastryId: string, qty: number) => {
    if (qty <= 0) return removeItem(pastryId);
    setItems((prev) =>
      prev.map((i) => (i.pastryId === pastryId ? { ...i, quantity: qty } : i))
    );
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
