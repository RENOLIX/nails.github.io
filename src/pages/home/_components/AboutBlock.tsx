import { motion } from "motion/react";

export default function AboutBlock() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex flex-col items-center gap-16 md:flex-row md:gap-24">
        <motion.div
          className="flex flex-shrink-0 justify-center"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src="https://hercules-cdn.com/file_T5Qx2VbSBP6ngFTmlPDN5ZK6"
            alt="Nailsy mascot"
            className="w-56 object-contain md:w-72 lg:w-80"
          />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-5 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            More than a supplier
          </h2>
          <p className="max-w-xl text-center text-lg leading-relaxed text-gray-600">
            Our mission is to keep the love and excitement for nails alive by nurturing a space where artistry, self-expression, and community come together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
