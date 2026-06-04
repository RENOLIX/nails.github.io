"use client";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const HERO_IMAGE = "/nails.github.io/images/dvok-glace-individual.webp";

export default function Hero() {
  return (
    <section className="bg-white px-4 py-6">
      <motion.div
        className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#f8f1ea]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <Link to="/products/vernis">
          <img
            src={HERO_IMAGE}
            alt="DVOK Glacé Collection"
            className="block h-auto max-h-[420px] w-full object-contain"
          />
        </Link>
      </motion.div>
    </section>
  );
}
