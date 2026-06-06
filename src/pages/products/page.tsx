import { Link, useParams } from "react-router-dom";
import { ChevronRight, Filter } from "lucide-react";
import ProductCard from "@/components/ProductCard.tsx";
import SafeImage from "@/components/SafeImage.tsx";
import { CATEGORIES } from "@/lib/categories.ts";
import { CANNI_COLLECTIONS } from "@/lib/product-options.ts";
import { findCategoryLabel } from "@/lib/products.ts";
import { useProducts } from "@/components/providers/products.tsx";

export default function ProductsPage() {
  const { category, subcategory, collection } = useParams();
  const { products: catalog } = useProducts();
  const currentCategory = CATEGORIES.find((entry) => entry.id === category);
  const currentSubcategory = currentCategory?.subcategories.find((entry) => entry.id === subcategory);
  const currentCollection = CANNI_COLLECTIONS.find((entry) => entry.id === collection);
  const isCanni = category === "vernis" && subcategory === "canni";

  const products = catalog.filter((product) => {
    if (category && product.category !== category) return false;
    if (subcategory && product.subcategory !== subcategory) return false;
    if (collection && product.canniCollection !== collection) return false;
    return true;
  });

  const title = currentCollection
    ? `Vernis Canni — ${currentCollection.label}`
    : category
      ? `${findCategoryLabel(category)}${currentSubcategory ? ` — ${currentSubcategory.label}` : ""}`
      : "Tous les produits";

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-extrabold text-gray-950 md:text-4xl">Catégories</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CATEGORIES.map((entry) => (
            <Link
              key={entry.id}
              to={`/products/${entry.id}`}
              className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-pink-50">
                <SafeImage
                  src={entry.image}
                  alt={entry.label}
                  fallbackLabel={entry.label}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-0 right-0 text-center text-base font-extrabold text-white">
                  {entry.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-pink-600">Accueil</Link>
        {currentCategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/products/${currentCategory.id}`} className="hover:text-pink-600">
              {currentCategory.label}
            </Link>
          </>
        )}
        {currentSubcategory && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              to={`/products/${currentCategory?.id}/${currentSubcategory.id}`}
              className={currentCollection ? "hover:text-pink-600" : "font-bold text-gray-950"}
            >
              {currentSubcategory.label}
            </Link>
          </>
        )}
        {currentCollection && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="font-bold text-gray-950">{currentCollection.label}</span>
          </>
        )}
      </nav>

      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-950 md:text-4xl">{title}</h1>
        {!isCanni || currentCollection ? (
          <p className="mt-2 text-base text-slate-500">
            {products.length} {products.length > 1 ? "produits" : "produit"}
          </p>
        ) : (
          <p className="mt-2 text-base text-slate-500">Choisissez une collection Canni</p>
        )}
      </div>

      {currentCategory?.subcategories.length && !collection ? (
        <div className="mb-7 flex flex-wrap gap-2">
          {!isCanni && (
            <Link
              to={`/products/${currentCategory.id}`}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                !subcategory ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-pink-50"
              }`}
            >
              Tout
            </Link>
          )}
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

      {isCanni && !currentCollection ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {CANNI_COLLECTIONS.map((entry) => {
            const count = catalog.filter(
              (product) =>
                product.category === "vernis" &&
                product.subcategory === "canni" &&
                product.canniCollection === entry.id,
            ).length;
            return (
              <Link
                key={entry.id}
                to={`/products/vernis/canni/${entry.id}`}
                className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden bg-pink-50">
                  <SafeImage
                    src={entry.image}
                    alt={`Collection Canni ${entry.label}`}
                    fallbackLabel={entry.label}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-extrabold text-slate-950">{entry.label}</span>
                  <span className="text-xs font-semibold text-slate-400">{count} produit{count > 1 ? "s" : ""}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : products.length === 0 ? (
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
