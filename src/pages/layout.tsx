import { Outlet } from "react-router-dom";
import { NavbarPublic } from "@/components/Navbar.tsx";
import Footer from "@/components/Footer.tsx";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavbarPublic />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
