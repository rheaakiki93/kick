import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Apple, Flame, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import gingerImg from "@/assets/ingredient-ginger.png";
import lemonImg from "@/assets/ingredient-lemon.png";
import appleImg from "@/assets/ingredient-apple.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Ingredients = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const ingredients = [
    {
      name: t("ingredients.ginger_root"),
      image: gingerImg,
      icon: Flame,
      dosage: "20ml",
      benefit: t("ingredients.ginger_benefit"),
      description: t("ingredients.ginger_desc"),
      bgColor: "bg-amber-400"
    },
    {
      name: t("ingredients.fresh_lemon"),
      image: lemonImg,
      icon: Droplets,
      dosage: "20ml",
      benefit: t("ingredients.lemon_benefit"),
      description: t("ingredients.lemon_desc"),
      bgColor: "bg-yellow-300"
    },
    {
      name: t("ingredients.green_apple"),
      image: appleImg,
      icon: Apple,
      dosage: "20ml",
      benefit: t("ingredients.apple_benefit"),
      description: t("ingredients.apple_desc"),
      bgColor: "bg-[#80c322]"
    }
  ];

  const goToSlide = (index: number) => {
    let targetIndex = index;
    if (index < 0) targetIndex = ingredients.length - 1;
    else if (index >= ingredients.length) targetIndex = 0;
    setActiveIndex(targetIndex);
  };

  return (
    <section id="ingredients" className="min-h-screen">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 bg-kick-cream border"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
            {t("ingredients.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-foreground font-sans">
            {t("ingredients.title_1")}<br />{t("ingredients.title_2")}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg font-sans text-base">
            {t("ingredients.description")}
          </p>
          <div className="mb-8 max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t("ingredients.composition")}</span>
              <span className="text-sm font-bold text-foreground">{t("ingredients.natural")}</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{t("ingredients.ginger")}</span>
              <span>•</span>
              <span>{t("ingredients.lemon")}</span>
              <span>•</span>
              <span>{t("ingredients.apple")}</span>
            </div>
          </div>
          <a href="#benefits" className="inline-flex items-center gap-2 text-foreground font-medium group">
            {t("ingredients.view_benefits")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[500px] lg:min-h-screen flex flex-col justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`absolute inset-0 ${ingredients[activeIndex].bgColor}`} />
          </AnimatePresence>

          <div className="relative flex-1 flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="rounded-2xl p-8 md:p-12 max-w-sm w-full text-center bg-transparent">
                <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 flex items-center justify-center">
                  <img src={ingredients[activeIndex].image} alt={ingredients[activeIndex].name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-sans text-secondary-foreground">
                  {ingredients[activeIndex].name}
                </h3>
                <p className="text-sm font-medium flex items-center justify-center gap-2 mb-4 text-secondary-foreground">
                  {(() => { const Icon = ingredients[activeIndex].icon; return <Icon className="w-4 h-4" />; })()}
                  {ingredients[activeIndex].benefit}
                </p>
                <p className="leading-relaxed text-sm text-secondary-foreground">
                  {ingredients[activeIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-3 pb-4">
            {ingredients.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 bg-white" : "bg-white/40 hover:bg-white/60"}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>

          <div className="absolute inset-y-0 left-4 flex items-center z-10">
            <button onClick={() => goToSlide(activeIndex - 1)} className="p-2 rounded-full transition-opacity bg-transparent" aria-label="Previous ingredient">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center z-10">
            <button onClick={() => goToSlide(activeIndex + 1)} className="p-2 rounded-full transition-opacity bg-transparent" aria-label="Next ingredient">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="relative z-10 text-center text-xs text-white pb-6">
            {t("ingredients.scroll_hint")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Ingredients;
