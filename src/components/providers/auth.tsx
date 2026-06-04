import {
  createContext,
  type PropsWithChildren,
  useState,
} from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  customerName: string;
  signIn: (name: string) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [customerName, setCustomerName] = useState("");

  const value: AuthContextValue = {
    isAuthenticated: customerName.length > 0,
    customerName,
    signIn: setCustomerName,
    signOut: () => setCustomerName(""),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
