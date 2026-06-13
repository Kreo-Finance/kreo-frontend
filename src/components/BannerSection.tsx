import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.png";

const BannerSection = () => {
  return (
    <section className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <img
          src={heroBanner}
          alt="Vibrant web3 creator marketplace scene"
          className="w-full h-70 md:h-90 object-cover"
        />
      </motion.div>

      {/* Color bars like Gumroad */}
      <div className="h-3 bg-gradient-teal-pink" />
      <div className="h-2 bg-creo-yellow" />
      <div className="h-3 bg-creo-teal" />
    </section>
  );
};

export default BannerSection;
