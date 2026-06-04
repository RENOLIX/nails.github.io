"use client";
import { motion } from "motion/react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1772322586649-fc11154e76b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxuYWlsJTIwc2Fsb24lMjBwaW5rJTIwYWVzdGhldGljJTIwYmVhdXR5fGVufDB8fHx8MTc4MDUyMjUzOHww&ixlib=rb-4.1.0&q=80&w=1600";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <motion.img
        src={HERO_IMAGE}
        alt="Nails esthétiques roses"
        className="block h-auto w-full object-contain"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </section>
  );
}
