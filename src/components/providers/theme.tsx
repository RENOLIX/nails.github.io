import { type PropsWithChildren, useEffect } from "react";

export function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    document.documentElement.dataset.theme = "atelier";
  }, []);

  return <>{children}</>;
}
