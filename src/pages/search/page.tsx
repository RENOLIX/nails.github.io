import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard.tsx";
import { useProducts } from "@/components/providers/products.tsx";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const search = q.toLowerCase();
  const { products: catalog } = useProducts();

  const results = catalog.filter((product) =>
    product.name.toLowerCase().includes(search) ||
    product.description.toLowerCase().includes(search) ||
    (product.reference ?? "").toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search) ||
    product.subcategory.toLowerCase().includes(search)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Search className="h-5 w-5 text-gray-400" />
        <h1 className="text-xl font-bold text-gray-900">
          Résultats pour &ldquo;{q}&rdquo;
        </h1>
      </div>

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 flex justify-center text-5xl"><Search className="h-12 w-12 text-gray-200" /></div>
          <p className="text-lg text-gray-500">Aucun résultat pour &ldquo;{q}&rdquo;</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} showBestSeller />
          ))}
        </div>
      )}
    </div>
  );
}
