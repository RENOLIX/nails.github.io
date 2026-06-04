import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { useCart } from "@/components/providers/cart";

function CartBadge() {
  const { count } = useCart();
  if (count === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

export function NavbarPublic() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] w-full overflow-visible border-b border-pink-100 bg-[#fadbe0] shadow-sm">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex w-1/3 items-center gap-1">
            <form onSubmit={handleSearch} className="hidden w-full items-center gap-2 md:flex">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher..."
                className="h-8 border-pink-200 bg-white/80 text-sm"
              />
              <button type="submit" className="cursor-pointer rounded-full p-2 transition-colors hover:bg-pink-200/50">
                <Search className="h-5 w-5 text-pink-700" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              className="cursor-pointer rounded-full p-2 transition-colors hover:bg-pink-200/50 md:hidden"
              aria-label={searchOpen ? "Fermer la recherche" : "Rechercher"}
            >
              {searchOpen ? <X className="h-5 w-5 text-pink-700" /> : <Search className="h-5 w-5 text-pink-700" />}
            </button>
          </div>

          <div className="flex w-1/3 justify-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://hercules-cdn.com/file_kph7rblw10KlLe96KcNfrsHH"
                alt="Nailsy Magic"
                className="h-12 w-auto object-contain md:h-16"
              />
            </Link>
          </div>

          <div className="flex w-1/3 items-center justify-end gap-1">
            <Link
              to="/wishlist"
              className="relative cursor-pointer rounded-full p-2 transition-colors hover:bg-pink-200/50"
              aria-label="Avis et demandes"
            >
              <Heart className="h-5 w-5 text-pink-700" />
            </Link>
            <Link
              to="/cart"
              className="relative cursor-pointer rounded-full p-2 transition-colors hover:bg-pink-200/50"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5 text-pink-700" />
              <CartBadge />
            </Link>
          </div>
        </div>

        {searchOpen ? (
          <div className="absolute left-0 right-0 top-full border-t border-pink-200 bg-[#fadbe0] px-4 py-3 shadow-lg md:hidden">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-xl items-center gap-2 rounded-2xl bg-white/85 p-2 shadow-sm ring-1 ring-pink-100">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50">
                <Search className="h-4 w-4 text-pink-600" />
              </div>
              <Input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher..."
                className="h-9 border-0 bg-transparent px-1 shadow-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default NavbarPublic;
