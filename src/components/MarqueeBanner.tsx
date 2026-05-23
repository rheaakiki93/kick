import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const MarqueeBanner = () => {
  const { t } = useLanguage();
  const phrases = [
    t("marquee.vegan"), t("marquee.no_sugar"), t("marquee.natural_energy"),
    t("marquee.natural_ingredients"), t("marquee.cold_pressed"), t("marquee.plant_based"),
    t("marquee.immunity_boost"), t("marquee.made_in_italy")
  ];
  const duplicatedPhrases = [...phrases, ...phrases];
  
  return (
    <section className="py-4 overflow-hidden bg-secondary">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ x: { duration: 20, repeat: Infinity, ease: "linear" } }}
      >
        {duplicatedPhrases.map((phrase, index) => (
          <div key={index} className="flex items-center">
            <span className="text-sm md:text-base font-medium tracking-widest text-background px-6 md:px-10">
              {phrase}
            </span>
            <span className="text-background/40 text-lg">✦</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default MarqueeBanner;
