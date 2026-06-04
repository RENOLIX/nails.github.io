import { motion } from "motion/react";
import { Star } from "lucide-react";
import ProductCard from "@/components/ProductCard.tsx";
import { useProducts } from "@/components/providers/products.tsx";

export default function BestSellers() {
  const { products: catalog } = useProducts();
  const products = catalog.filter((product) => product.isBestSeller).slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10" id="bestsellers">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <div className="mb-1 flex items-center justify-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Best Sellers</h2>
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        </div>
        <p className="text-sm text-gray-500">Les favoris de nos clientes</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
          >
            <ProductCard product={product} showBestSeller />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
