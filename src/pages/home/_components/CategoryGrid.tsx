import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CATEGORIES } from "@/lib/categories.ts";

export default function CategoryGrid() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => (
          <motion.button
            key={category.id}
            type="button"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            onClick={() => {
              if (category.subcategories.length === 0) {
                navigate(`/products/${category.id}`);
                return;
              }
              setSelectedCategory(category);
            }}
            className="group overflow-hidden rounded-2xl border border-pink-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-pink-50">
              <img
                src={category.image}
                alt={category.label}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-0 right-0 text-center text-base font-extrabold text-white drop-shadow">
                {category.label}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedCategory.subcategories.length > 0 ? (
        <motion.div
          key={selectedCategory.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {selectedCategory.subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/products/${selectedCategory.id}/${subcategory.id}`}
              className="min-w-28 rounded-full bg-[#fadbe0] px-6 py-2 text-center text-sm font-medium text-gray-950 shadow-[inset_0_-2px_0_rgba(255,255,255,0.35)] transition hover:bg-pink-300"
            >
              {subcategory.label}
            </Link>
          ))}
        </motion.div>
      ) : null}
    </section>
  );
}
