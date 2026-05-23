import { motion } from "framer-motion";
import heroBottle from "@/assets/hero-bottle.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-secondary" />

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[380px] lg:w-[460px] h-[300px] md:h-[380px] lg:h-[460px] bg-primary/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src={heroBottle}
        alt="Kick immunity shot bottle"
        className="relative w-[220px] md:w-[280px] lg:w-[340px] drop-shadow-2xl z-10"
        animate={{ y: [0, -18, 0], rotate: [-15, 5, -15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="w-[1px] h-[60px] bg-white origin-center"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};
export default Hero;