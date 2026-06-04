import { motion } from "motion/react";

export default function AboutBlock() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid items-center gap-12 md:grid-cols-[0.75fr_1.25fr]">
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
          className="md:ml-auto md:max-w-2xl"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="mb-5 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            More than a supplier
          </h2>
          <p className="text-center text-lg leading-relaxed text-gray-600">
            Our mission is to keep the love and excitement for nails alive by nurturing a space where artistry, self-expression, and community come together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
