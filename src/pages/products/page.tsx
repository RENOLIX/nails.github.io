import { Link, useParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard.tsx";
import { CATEGORIES } from "@/lib/categories.ts";
import { findCategoryLabel, PRODUCTS } from "@/lib/products.ts";

export default function ProductsPage() {
  const { category, subcategory } = useParams();
  const products = PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-pink-600">
            <SlidersHorizontal className="h-4 w-4" />
            Catalogue Nailsy Magic
          </p>
          <h1 className="text-3xl font-extrabold text-gray-950 md:text-4xl">
            {category ? findCategoryLabel(category) : "Tous les produits"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{products.length} produit(s) disponible(s)</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Link to="/products" className="whitespace-nowrap rounded-full border border-pink-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-pink-50">
            Tous
          </Link>
          {CATEGORIES.map((entry) => (
            <Link
              key={entry.id}
              to={`/products/${entry.id}`}
              className="whitespace-nowrap rounded-full border border-pink-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-pink-50"
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </div>

      {category ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.find((entry) => entry.id === category)?.subcategories.map((entry) => (
            <Link
              key={entry.id}
              to={`/products/${category}/${entry.id}`}
              className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700 hover:bg-pink-100"
            >
              {entry.label}
            </Link>
          ))}
        </div>
      ) : null}

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-pink-200 bg-pink-50/50 py-16 text-center">
          <Filter className="mx-auto h-10 w-10 text-pink-300" />
          <p className="mt-4 text-gray-500">Aucun produit dans cette sélection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showBestSeller />
          ))}
        </div>
      )}
    </div>
  );
}
