import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { useProducts } from "./products";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  products: Array<{ product: Product; quantity: number }>;
  count: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart() {
  try {
    const value = window.localStorage.getItem("nails-cart");
    return value ? (JSON.parse(value) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const { products: catalog } = useProducts();
  const [lines, setLines] = useState<CartLine[]>(() => (typeof window === "undefined" ? [] : readCart()));

  useEffect(() => {
    window.localStorage.setItem("nails-cart", JSON.stringify(lines));
  }, [lines]);

  const products = useMemo(
    () =>
      lines
        .map((line) => {
          const product = catalog.find((entry) => entry.id === line.productId);
          return product ? { product, quantity: line.quantity } : null;
        })
        .filter(Boolean) as Array<{ product: Product; quantity: number }>,
    [lines, catalog],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      products,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: products.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
      addToCart: (productId, quantity = 1) => {
        setLines((current) => {
          const existing = current.find((line) => line.productId === productId);
          if (existing) {
            return current.map((line) =>
              line.productId === productId ? { ...line, quantity: line.quantity + quantity } : line,
            );
          }
          return [...current, { productId, quantity }];
        });
      },
      updateQuantity: (productId, quantity) => {
        setLines((current) =>
          current.map((line) => (line.productId === productId ? { ...line, quantity: Math.max(1, quantity) } : line)),
        );
      },
      removeFromCart: (productId) => setLines((current) => current.filter((line) => line.productId !== productId)),
      clearCart: () => setLines([]),
    }),
    [lines, products],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return value;
}
