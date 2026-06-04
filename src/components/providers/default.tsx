import type { PropsWithChildren } from "react";
import { AuthProvider } from "./auth";
import { ConvexProvider } from "./convex";
import { QueryClientProvider } from "./query-client";
import { ThemeProvider } from "./theme";
import { Toaster } from "sonner";
import { CartProvider } from "./cart";
import { ProductsProvider } from "./products";

export function DefaultProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryClientProvider>
        <ConvexProvider>
          <AuthProvider>
            <ProductsProvider>
              <CartProvider>{children}</CartProvider>
            </ProductsProvider>
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </ConvexProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
