import { Outlet } from "react-router-dom";
import { NavbarPublic } from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <NavbarPublic />
      <main className="min-w-0 flex-1 overflow-x-hidden pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
