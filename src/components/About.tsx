import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="min-h-screen">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 bg-kick-cream"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
            {t("about.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-foreground font-sans">
            {t("about.title_1")}<br />{t("about.title_2")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            {t("about.description")}
          </p>
          <a href="#ingredients" className="inline-flex items-center gap-2 text-foreground font-medium group">
            {t("about.learn_more")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
