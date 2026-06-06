import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { formatDzd } from "@/lib/utils.ts";
import { useCart } from "@/components/providers/cart";
import SafeImage from "@/components/SafeImage.tsx";
import { useProducts } from "@/components/providers/products.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = useMemo(() => products.find((entry) => entry.id === id), [id, products]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)] lg:gap-10">
          <div>
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="space-y-5 pt-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-28 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    if (product.stock <= 0) {
      toast.error("Ce produit est en rupture de stock");
      return;
    }
    const color = selectedColor || product.colors[0]?.name;
    addToCart(product.id, quantity, color);
    toast.success("Produit ajouté au panier");
  };

  const gallery = product.images.length > 0 ? product.images : [product.imageUrl];

  return (
    <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-6 md:py-8">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)] lg:gap-10">
        <section className="min-w-0">
          <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-pink-50 lg:max-w-none">
            <SafeImage
              src={gallery[activeImage] ?? gallery[0]}
              alt={product.name}
              fallbackLabel={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mx-auto mt-4 grid max-w-md grid-cols-4 gap-2 sm:gap-3 lg:max-w-none">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-2xl border ${activeImage === index ? "border-pink-500" : "border-pink-100"}`}
              >
                <SafeImage src={image} alt={product.name} fallbackLabel={product.reference || product.name} className="aspect-square h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="min-w-0 pt-2">
          <Link to="/products" className="text-sm font-bold text-pink-600">Retour aux produits</Link>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm font-semibold text-gray-400">{product.reference}</p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-2xl font-extrabold text-pink-600 md:text-3xl">{formatDzd(product.price)}</span>
            {product.oldPrice ? <span className="text-lg font-bold text-gray-400 line-through">{formatDzd(product.oldPrice)}</span> : null}
          </div>
          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">{product.description}</p>
          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                {product.stock} en stock
              </span>
            ) : (
              <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700">Rupture de stock</span>
            )}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-extrabold text-slate-950">
                Couleur: <span className="text-pink-600">{selectedColor || product.colors[0].name}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const active = (selectedColor || product.colors[0].name) === color.name;
                  return (
                    <button
                      key={`${color.name}-${color.value}`}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                        active ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-md border border-black/10 shadow-inner"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center rounded-full border border-pink-100 bg-white">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-pink-700">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button
                type="button"
                disabled={quantity >= product.stock}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 text-pink-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button disabled={product.stock <= 0} onClick={handleAdd} className="h-11 flex-1 rounded-full bg-pink-600 px-5 hover:bg-pink-700 sm:flex-none sm:px-6">
              <ShoppingBag className="h-4 w-4" />
              {product.stock > 0 ? "Ajouter au panier" : "Indisponible"}
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full border-pink-200 px-5 text-pink-700">
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
