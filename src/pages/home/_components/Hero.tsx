"use client";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1772322586649-fc11154e76b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxuYWlsJTIwc2Fsb24lMjBwaW5rJTIwYWVzdGhldGljJTIwYmVhdXR5fGVufDB8fHx8MTc4MDUyMjUzOHww&ixlib=rb-4.1.0&q=80&w=1080";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-[520px] md:grid-cols-2 md:min-h-[600px]">
          <div className="order-2 flex flex-col justify-center px-8 py-12 md:order-1 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
                <Sparkles className="h-4 w-4" />
                Nailsy Magic Boutique
              </div>
              <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-gray-950 md:text-6xl">
                Le matériel nails pro, joli et prêt à commander.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-gray-500 md:text-lg">
                Vernis, gels, capsules, outils et déco pour créer des poses propres, brillantes et durables.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-pink-600 px-6 text-sm font-bold text-white transition hover:bg-pink-700"
                >
                  Voir la boutique
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/wishlist"
                  className="inline-flex h-11 items-center rounded-full border border-pink-200 px-6 text-sm font-bold text-pink-700 transition hover:bg-pink-50"
                >
                  Demander un produit
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative order-1 md:order-2"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <img
              src={HERO_IMAGE}
              alt="Nails esthétiques roses"
              className="h-[300px] w-full object-cover md:h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
