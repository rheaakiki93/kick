import { motion } from "framer-motion";
import heroBottle from "@/assets/hero-bottle.png"; // used as video poster & mobile fallback
import kickLogoCropped from "@/assets/kick-logo-cropped.png";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-96px)] mt-[96px] flex items-center justify-center overflow-hidden">

      {/* Video background – desktop only */}
      <video
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-poster.jpg"
        style={{ filter: 'brightness(0.85) contrast(1.15) saturate(1.3)' }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Poster image – mobile only */}
      <img
        src={heroBottle}
        alt="Kick wellness shot"
        className="absolute inset-0 w-full h-full object-cover block md:hidden"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />

      {/* Centered tagline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center px-6"
        style={{ fontFamily: 'Garet, sans-serif' }}
      >
        <p className="text-yellow-400 text-lg md:text-2xl lg:text-3xl tracking-normal drop-shadow-lg font-normal mb-2">
          piccolo formato,
        </p>
        <div className="flex items-center justify-center gap-0 flex-nowrap">
          <span
            className="text-yellow-400 text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg leading-none"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            grande
          </span>
          <img
            src={kickLogoCropped}
            alt="Kick"
            className="h-10 md:h-16 lg:h-20 w-auto drop-shadow-lg"
            style={{ filter: 'brightness(0) saturate(100%) invert(87%) sepia(68%) saturate(788%) hue-rotate(327deg) brightness(101%)' }}
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
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
