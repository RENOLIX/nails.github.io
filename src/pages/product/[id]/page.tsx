import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { PRODUCTS } from "@/lib/products.ts";
import { formatDzd } from "@/lib/utils.ts";
import { useCart } from "@/components/providers/cart";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useMemo(() => PRODUCTS.find((entry) => entry.id === id), [id]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-gray-950">Produit introuvable</h1>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-bold text-white">
          Retour boutique
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product.id, quantity);
    toast.success("Produit ajouté au panier");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section>
          <div className="overflow-hidden rounded-3xl bg-pink-50">
            <img src={product.images[activeImage]} alt={product.name} className="aspect-square h-full w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-2xl border ${activeImage === index ? "border-pink-500" : "border-pink-100"}`}
              >
                <img src={image} alt="" className="aspect-square h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="pt-2">
          <Link to="/products" className="text-sm font-bold text-pink-600">Retour aux produits</Link>
          <h1 className="mt-3 text-4xl font-extrabold text-gray-950 md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm font-semibold text-gray-400">{product.reference}</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-extrabold text-pink-600">{formatDzd(product.price)}</span>
            {product.oldPrice ? <span className="text-lg font-bold text-gray-400 line-through">{formatDzd(product.oldPrice)}</span> : null}
          </div>
          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">{product.description}</p>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-11 items-center rounded-full border border-pink-100 bg-white">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-pink-700">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-4 text-pink-700">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAdd} className="h-11 rounded-full bg-pink-600 px-6 hover:bg-pink-700">
              <ShoppingBag className="h-4 w-4" />
              Ajouter au panier
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full border-pink-200 text-pink-700">
              <Link to="/wishlist"><Heart className="h-4 w-4" /> Avis</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3">
            {["Paiement à la livraison", "Livraison domicile ou bureau", "Support pour demander les références manquantes"].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-pink-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pink-500" />
                <p className="text-sm font-medium text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-pink-100 bg-white p-4">
              <Truck className="h-5 w-5 text-pink-500" />
              <p className="mt-2 text-sm font-bold">Livraison rapide</p>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-white p-4">
              <ShieldCheck className="h-5 w-5 text-pink-500" />
              <p className="mt-2 text-sm font-bold">Produits sélectionnés</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
