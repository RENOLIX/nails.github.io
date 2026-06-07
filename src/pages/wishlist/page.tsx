import { Heart, PackagePlus, Send, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { createProductRequest, createReview } from "@/lib/supabase.ts";

type Review = {
  name: string;
  rating: number;
  message: string;
};

const initialReviews: Review[] = [
  { name: "Lina", rating: 5, message: "Produits bien emballés, couleurs très jolies et livraison rapide." },
  { name: "Meriem", rating: 5, message: "J’ai demandé une référence, réponse claire et commande facile." },
];

export default function WishlistPage() {
  const reviews = initialReviews;
  const [reviewName, setReviewName] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestProduct, setRequestProduct] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewMessage.trim()) {
      toast.error("Ajoutez votre nom et votre avis.");
      return;
    }
    const nextReview = { name: reviewName.trim(), rating, message: reviewMessage.trim() };
    setReviewSubmitting(true);
    try {
      await createReview(nextReview);
      setReviewName("");
      setReviewMessage("");
      setRating(5);
      toast.success("Avis envoyé à l'administration pour validation");
    } catch (error) {
      console.warn("Supabase review save failed", error);
      toast.error("Impossible d'envoyer votre avis. Réessayez.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!requestName.trim() || !requestProduct.trim()) {
      toast.error("Indiquez votre nom et le produit souhaité.");
      return;
    }
    setRequestSubmitting(true);
    try {
      await createProductRequest({
        name: requestName.trim(),
        phone: requestPhone.trim(),
        product: requestProduct.trim(),
      });
      setRequestName("");
      setRequestPhone("");
      setRequestProduct("");
      toast.success("Demande envoyée à l'administration");
    } catch (error) {
      console.warn("Supabase product request save failed", error);
      toast.error("Impossible d'envoyer la demande. Réessayez.");
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-600">
          <Heart className="h-6 w-6 fill-pink-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-950 md:text-4xl">Avis clientes & demandes produits</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Le cœur du header mène ici: vos clientes peuvent laisser un avis ou demander une référence à ajouter.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-extrabold text-gray-950">Laisser un avis</h2>
          </div>
          <form className="space-y-4" onSubmit={submitReview}>
            <Input value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Votre nom" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  className="rounded-full p-1 text-yellow-400"
                  aria-label={`${index + 1} étoiles`}
                >
                  <Star className={`h-6 w-6 ${index < rating ? "fill-yellow-400" : "fill-transparent"}`} />
                </button>
              ))}
            </div>
            <Textarea value={reviewMessage} onChange={(event) => setReviewMessage(event.target.value)} placeholder="Votre expérience avec Nailsy Magic..." />
            <Button type="submit" disabled={reviewSubmitting} className="h-11 rounded-full bg-pink-600 px-6 hover:bg-pink-700">
              {reviewSubmitting ? "Envoi..." : "Publier l’avis"}
            </Button>
          </form>

          <div className="mt-8 space-y-3">
            {reviews.map((review, index) => (
              <article key={`${review.name}-${index}`} className="rounded-2xl bg-pink-50/70 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-gray-950">{review.name}</h3>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-6 text-gray-600">{review.message}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-pink-50 to-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <PackagePlus className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-extrabold text-gray-950">Demander un produit</h2>
          </div>
          <p className="mb-5 text-sm leading-6 text-gray-500">
            Une cliente cherche une couleur Canni, Venalisa, une lampe, des capsules ou une déco qui manque? Elle peut envoyer une demande directe.
          </p>
          <form className="space-y-4" onSubmit={submitRequest}>
            <Input value={requestName} onChange={(event) => setRequestName(event.target.value)} placeholder="Nom" />
            <Input value={requestPhone} onChange={(event) => setRequestPhone(event.target.value)} inputMode="tel" placeholder="Téléphone optionnel" />
            <Textarea value={requestProduct} onChange={(event) => setRequestProduct(event.target.value)} placeholder="Produit souhaité, marque, référence, couleur..." />
            <Button type="submit" disabled={requestSubmitting} className="h-11 rounded-full bg-gray-950 px-6 text-white hover:bg-gray-800">
              <Send className="h-4 w-4" />
              {requestSubmitting ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
