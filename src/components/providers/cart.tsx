import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { useProducts } from "./products";

export type CartLine = {
  productId: string;
  quantity: number;
  selectedColor?: string;
};

type CartContextValue = {
  lines: CartLine[];
  products: Array<{ product: Product; quantity: number; selectedColor?: string }>;
  count: number;
  total: number;
  addToCart: (productId: string, quantity?: number, selectedColor?: string) => void;
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
          return product ? { product, quantity: line.quantity, selectedColor: line.selectedColor } : null;
        })
        .filter(Boolean) as Array<{ product: Product; quantity: number; selectedColor?: string }>,
    [lines, catalog],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      products,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: products.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
      addToCart: (productId, quantity = 1, selectedColor) => {
        setLines((current) => {
          const product = catalog.find((entry) => entry.id === productId);
          if (!product || product.stock <= 0) return current;
          const existing = current.find((line) => line.productId === productId);
          if (existing) {
            return current.map((line) =>
              line.productId === productId
                ? { ...line, quantity: Math.min(product.stock, line.quantity + quantity), selectedColor }
                : line,
            );
          }
          return [...current, { productId, quantity: Math.min(product.stock, quantity), selectedColor }];
        });
      },
      updateQuantity: (productId, quantity) => {
        const product = catalog.find((entry) => entry.id === productId);
        setLines((current) =>
          current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.max(1, Math.min(product?.stock ?? quantity, quantity)) }
              : line,
          ),
        );
      },
      removeFromCart: (productId) => setLines((current) => current.filter((line) => line.productId !== productId)),
      clearCart: () => setLines([]),
    }),
    [catalog, lines, products],
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
