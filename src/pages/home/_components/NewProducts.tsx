import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard.tsx";
import { useProducts } from "@/components/providers/products.tsx";

export default function NewProducts() {
  const { products: catalog } = useProducts();
  const products = catalog.filter((product) => product.isNew).slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10" id="new">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="mb-1 text-center text-2xl font-bold text-gray-900 md:text-3xl">
          Nouveautés
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">Les dernières arrivées</p>
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
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
