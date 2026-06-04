import { Link, useParams } from "react-router-dom";
import { ChevronRight, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard.tsx";
import { CATEGORIES } from "@/lib/categories.ts";
import { COLOR_REFS } from "@/lib/colorRefs.ts";
import { findCategoryLabel } from "@/lib/products.ts";
import { useProducts } from "@/components/providers/products.tsx";

export default function ProductsPage() {
  const { category, subcategory } = useParams();
  const { products: catalog } = useProducts();
  const currentCategory = CATEGORIES.find((entry) => entry.id === category);
  const currentSubcategory = currentCategory?.subcategories.find((entry) => entry.id === subcategory);

  const products = catalog.filter((product) => {
    if (category && product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;
    return true;
  });

  const title = category
    ? `${findCategoryLabel(category)}${currentSubcategory ? ` — ${currentSubcategory.label}` : ""}`
    : "Tous les produits";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-pink-600">Accueil</Link>
        {currentCategory ? (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/products/${currentCategory.id}`} className="hover:text-pink-600">
              {currentCategory.label}
            </Link>
          </>
        ) : null}
        {currentSubcategory ? (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="font-bold text-gray-950">{currentSubcategory.label}</span>
          </>
        ) : null}
      </nav>

      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-950 md:text-4xl">{title}</h1>
        <p className="mt-2 text-base text-slate-500">
          {products.length} {products.length > 1 ? "produits" : "produit"}
        </p>
      </div>

      {currentCategory?.subcategories.length ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            to={`/products/${currentCategory.id}`}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              !subcategory ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-pink-50"
            }`}
          >
            Tout
          </Link>
          {currentCategory.subcategories.map((entry) => (
            <Link
              key={entry.id}
              to={`/products/${currentCategory.id}/${entry.id}`}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                subcategory === entry.id ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-pink-50"
              }`}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      ) : null}

      {subcategory && COLOR_REFS[subcategory] ? (
        <div className="mb-7 flex flex-wrap gap-2">
          <button className="rounded-full bg-slate-950 px-5 py-1.5 text-sm font-bold text-white">Toutes</button>
          {COLOR_REFS[subcategory].map((ref) => (
            <button
              key={ref}
              className="rounded-full border border-slate-200 bg-white px-5 py-1.5 text-sm font-semibold text-slate-700 hover:border-pink-300"
            >
              {ref}
            </button>
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
