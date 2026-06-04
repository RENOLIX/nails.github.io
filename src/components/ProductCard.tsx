import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn, formatDzd } from "@/lib/utils.ts";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/providers/cart";

type Props = {
  product: Product;
  showBestSeller?: boolean;
};

export default function ProductCard({ product, showBestSeller = false }: Props) {
  const { addToCart } = useCart();

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product.id, 1);
    toast.success("Ajouté au panier");
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-pink-50 bg-white shadow-sm transition-shadow hover:shadow-lg"
      >
        {showBestSeller && product.isBestSeller && (
          <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-yellow-950">
            <Star className="h-2.5 w-2.5 fill-yellow-950" />
            Best
          </div>
        )}

        <div className="relative aspect-square overflow-hidden bg-pink-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Link
            to="/wishlist"
            className="absolute right-2 top-2 z-10 rounded-full bg-white/85 p-1.5 text-pink-500 shadow-sm transition hover:bg-pink-50"
            aria-label="Laisser un avis"
          >
            <Heart className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "absolute bottom-2 right-2 z-10 rounded-full bg-pink-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-pink-600",
            )}
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-3">
          <p className="mb-0.5 text-xs text-gray-400">{product.reference ?? product.subcategory}</p>
          <h3 className="truncate text-sm font-semibold leading-tight text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm font-bold text-pink-600">{formatDzd(product.price)}</p>
        </div>
      </motion.div>
    </Link>
  );
}
