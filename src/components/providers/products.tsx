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
        if (!alive) return;

        const mergedProducts = nextProducts.map((product) => {
          const localMatch = PRODUCTS.find(
            (localProduct) =>
              localProduct.id === product.id ||
              (localProduct.reference &&
                product.reference &&
                localProduct.reference.toLowerCase() === product.reference.toLowerCase()),
          );

          return localMatch ? { ...localMatch, ...product, id: localMatch.id } : product;
        });

        const remoteReferences = new Set(
          nextProducts.map((product) => product.reference?.toLowerCase()).filter(Boolean),
        );
        const missingLocalProducts = PRODUCTS.filter(
          (product) =>
            !mergedProducts.some((entry) => entry.id === product.id) &&
            (!product.reference || !remoteReferences.has(product.reference.toLowerCase())),
        );

        setProducts([...mergedProducts, ...missingLocalProducts]);
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
