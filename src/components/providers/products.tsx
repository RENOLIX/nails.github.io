import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products.ts";
import { listPublicProducts } from "@/lib/supabase.ts";

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    listPublicProducts()
      .then((nextProducts) => {
        if (alive) setProducts(nextProducts);
      })
      .catch(() => {
        if (alive) setProducts(PRODUCTS);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ products, loading }), [products, loading]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const value = useContext(ProductsContext);
  if (!value) {
    throw new Error("useProducts must be used inside ProductsProvider");
  }
  return value;
}
