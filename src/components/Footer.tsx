import { Heart, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <img
            src="https://hercules-cdn.com/file_kph7rblw10KlLe96KcNfrsHH"
            alt="Nailsy Magic"
            className="h-16 w-auto"
          />
          <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
            Boutique nails professionnelle en Algérie: vernis, gels, capsules, outils et accessoires sélectionnés pour des poses propres et durables.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Navigation</h3>
          <div className="mt-4 grid gap-2 text-sm text-gray-500">
            <Link to="/products" className="hover:text-pink-600">Produits</Link>
            <Link to="/products/vernis" className="hover:text-pink-600">Vernis</Link>
            <Link to="/wishlist" className="hover:text-pink-600">Avis et demandes</Link>
            <Link to="/cart" className="hover:text-pink-600">Panier</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-pink-500" /> 0550 00 00 00</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-pink-500" /> contact@nailsy-magic.dz</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-pink-500" /> Livraison partout en Algérie</span>
            <span className="flex items-center gap-2"><Instagram className="h-4 w-4 text-pink-500" /> @nailsy.magic</span>
          </div>
        </div>
      </div>
      <div className="border-t border-pink-50 px-4 py-4 text-center text-xs text-gray-400">
        Made with <Heart className="mx-1 inline h-3 w-3 fill-pink-400 text-pink-400" /> for Nailsy Magic.
      </div>
    </footer>
  );
}
