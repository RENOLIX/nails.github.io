"use client";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/dvok-glace-individual.webp`;
const HERO_MOBILE_IMAGE = `${import.meta.env.BASE_URL}images/dvok-glace-mobile.jpeg`;

export default function Hero() {
  return (
    <section className="bg-white">
      <motion.div
        className="w-full overflow-hidden bg-[#f8f1ea]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <Link to="/products/vernis">
          <picture>
            <source media="(max-width: 767px)" srcSet={HERO_MOBILE_IMAGE} />
            <img
              src={HERO_IMAGE}
              alt="DVOK Glacé Collection"
              className="block h-auto w-full object-cover"
            />
          </picture>
        </Link>
      </motion.div>
    </section>
  );
}
