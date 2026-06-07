import { Link } from "react-router-dom";
import { CheckCircle2, Gift, Minus, Plus, Send, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DELIVERY_FEES, WILAYAS } from "@/lib/products.ts";
import { formatDzd } from "@/lib/utils.ts";
import { useCart } from "@/components/providers/cart";
import { createOrder } from "@/lib/supabase.ts";
import SafeImage from "@/components/SafeImage.tsx";

export default function CartPage() {
  const { products, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"domicile" | "bureau">("domicile");
  const [submitting, setSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const shipping = useMemo(() => (wilaya ? DELIVERY_FEES[deliveryMethod] : 0), [deliveryMethod, wilaya]);
  const orderTotal = total + shipping;

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (products.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    if (!name.trim() || !/^0[567]\d{8}$/.test(phone.trim()) || !wilaya || !address.trim()) {
      toast.error("Veuillez remplir vos informations correctement.");
      return;
    }

    const unavailable = products.find(({ product, quantity }) => product.stock <= 0 || quantity > product.stock);
    if (unavailable) {
      toast.error(`Stock insuffisant pour ${unavailable.product.name}.`);
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        wilaya,
        address: address.trim(),
        delivery_method: deliveryMethod,
        note: note.trim(),
        subtotal: total,
        shipping,
        total: orderTotal,
        items: products.map(({ product, quantity, selectedColor }) => ({
          id: product.id,
          name: product.name,
          reference: product.reference ?? "",
          price: product.price,
          quantity,
          color: selectedColor ?? "",
          total: product.price * quantity,
        })),
      });
      clearCart();
      setOrderSent(true);
      toast.success("Commande envoyée à Nailsy Magic");
    } catch (error) {
      console.warn("Supabase order save failed", error);
      toast.error("La commande n'a pas été envoyée. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-500">Confirmation</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-950 md:text-4xl">Votre panier</h1>
        <p className="mt-2 text-sm text-gray-500">Formulaire simple, paiement à la livraison.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-pink-500" />
            <h2 className="text-lg font-bold text-gray-950">Produits sélectionnés</h2>
          </div>
          {products.length === 0 ? (
            <div className="rounded-2xl bg-pink-50 py-12 text-center">
              <p className="text-gray-500">Votre panier est vide.</p>
              <Link to="/products" className="mt-4 inline-flex rounded-full bg-pink-600 px-5 py-2 text-sm font-bold text-white">
                Voir les produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(({ product, quantity, selectedColor }) => (
                <div key={product.id} className="flex gap-4 rounded-2xl border border-pink-50 p-3">
                  <SafeImage src={product.imageUrl} alt={product.name} fallbackLabel={product.reference || product.name} className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-gray-950">{product.name}</h3>
                    <p className="mt-1 text-sm font-bold text-pink-600">{formatDzd(product.price)}</p>
                    {selectedColor && <p className="mt-1 text-xs font-semibold text-slate-500">Couleur: {selectedColor}</p>}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex h-9 items-center rounded-full border border-pink-100">
                        <button type="button" onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))} className="px-3">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{quantity}</span>
                        <button
                          type="button"
                          disabled={quantity >= product.stock}
                          onClick={() => updateQuantity(product.id, Math.min(product.stock, quantity + 1))}
                          className="px-3 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(product.id)} className="rounded-full p-2 text-gray-400 hover:bg-pink-50 hover:text-pink-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-[0_24px_80px_-55px_rgba(219,39,119,0.55)] md:p-8">
          <h2 className="text-center text-2xl font-extrabold text-pink-600">Confirmer la commande</h2>
          {orderSent ? (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <p className="mt-3 text-lg font-extrabold text-emerald-900">Commande bien reçue</p>
              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Elle est maintenant visible dans l'administration. Nous vous contacterons pour la confirmation.
              </p>
              <Button asChild className="mt-5 rounded-full bg-emerald-700 hover:bg-emerald-800">
                <Link to="/products">Continuer mes achats</Link>
              </Button>
            </div>
          ) : (
          <form className="mt-6 space-y-4" onSubmit={submitOrder}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nom et prénom" />
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="numeric" maxLength={10} placeholder="Téléphone" />
            </div>

            <select
              value={wilaya}
              onChange={(event) => setWilaya(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Choisir la wilaya</option>
              {WILAYAS.map((entry, index) => (
                <option key={entry} value={entry}>
                  {String(index + 1).padStart(2, "0")} - {entry}
                </option>
              ))}
            </select>

            <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Adresse complète" />
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note" />

            <div>
              <p className="mb-3 text-sm font-bold text-gray-900">Méthode de livraison</p>
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-pink-100 px-4 py-3 text-sm font-semibold">
                  <input type="radio" checked={deliveryMethod === "domicile"} onChange={() => setDeliveryMethod("domicile")} />
                  Domicile
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-pink-100 px-4 py-3 text-sm font-semibold">
                  <input type="radio" checked={deliveryMethod === "bureau"} onChange={() => setDeliveryMethod("bureau")} />
                  Bureau
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-pink-50 px-4 py-3 text-sm font-bold text-pink-700">
              <Gift className="h-4 w-4" />
              Livraison calculée selon la méthode choisie.
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-4 text-sm font-bold text-gray-600">
              Livraison: {wilaya ? formatDzd(shipping) : "Choisissez une wilaya"}
            </div>
            <div className="rounded-2xl bg-gray-950 px-4 py-4 text-lg font-extrabold text-white">
              Total: {formatDzd(orderTotal)}
            </div>

            <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-pink-600 hover:bg-pink-700">
              <Send className="h-4 w-4" />
              {submitting ? "Envoi en cours..." : "Envoyer la commande"}
            </Button>
          </form>
          )}
        </section>
      </div>
    </div>
  );
}
