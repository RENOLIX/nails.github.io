import { Package, Star, Users } from "lucide-react";
import { PRODUCTS } from "@/lib/products.ts";

export default function AdminPage() {
  const stats = [
    { label: "Produits", value: PRODUCTS.length, icon: Package },
    { label: "Best sellers", value: PRODUCTS.filter((product) => product.isBestSeller).length, icon: Star },
    { label: "Avis démo", value: 2, icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-950">Admin Nailsy Magic</h1>
      <p className="mt-2 text-sm text-gray-500">Tableau de bord vitrine pour préparer la future connexion backend.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
              <Icon className="h-6 w-6 text-pink-500" />
              <p className="mt-4 text-3xl font-extrabold text-gray-950">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
