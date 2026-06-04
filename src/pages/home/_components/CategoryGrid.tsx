import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CATEGORIES } from "@/lib/categories.ts";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Catégories</h2>
        <p className="mt-1 text-sm text-gray-500">Tout pour préparer, poser et décorer.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            >
              <Link
                to={`/products/${category.id}`}
                className="group block overflow-hidden rounded-2xl border border-pink-50 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-pink-50">
                  <img src={category.image} alt={category.label} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900">
                    <Icon className="h-4 w-4 text-pink-500" />
                    {category.label}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
