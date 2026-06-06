import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CATEGORIES } from "@/lib/categories.ts";
import SafeImage from "@/components/SafeImage.tsx";

export default function CategoryGrid() {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold text-gray-950 md:text-3xl">Catégories</h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => {
                  if (category.subcategories.length === 0) {
                    navigate(`/products/${category.id}`);
                    return;
                  }
                  setSelectedCategoryId(isSelected ? null : category.id);
                }}
                className="group w-full overflow-hidden rounded-2xl border border-pink-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-pink-50">
                  <SafeImage
                    src={category.image}
                    alt={category.label}
                    fallbackLabel={category.label}
                    fallbackClassName="rounded-none"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-0 right-0 text-center text-base font-extrabold text-white drop-shadow">
                    {category.label}
                  </div>
                </div>
              </button>

              {isSelected && category.subcategories.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 grid grid-cols-2 gap-2"
                >
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      to={`/products/${category.id}/${subcategory.id}`}
                      className="rounded-full bg-[#fadbe0] px-4 py-2 text-center text-sm font-medium text-gray-950 shadow-[inset_0_-2px_0_rgba(255,255,255,0.35)] transition hover:bg-pink-300"
                    >
                      {subcategory.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
