import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const BenefitCard = ({ benefit, index }: { benefit: { title: string; headline: string; source: string; hoverBg: string; hoverContent: ReactNode[] }; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer bg-background h-full"
    >
      <div className={`aspect-square bg-muted flex flex-col justify-between p-6 relative overflow-hidden transition-all duration-500 ${benefit.hoverBg}`}>
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-background/80 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
          {benefit.title}
        </span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] lg:text-[10rem] font-bold text-foreground/5 transition-all duration-500 select-none group-hover:opacity-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-lg lg:text-xl font-semibold text-muted-foreground group-hover:text-background leading-tight relative z-10 transition-all duration-500 font-sans group-hover:opacity-0 group-hover:translate-y-4">
          {benefit.headline}
        </h3>
        <div className="absolute inset-0 p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="space-y-3">
            {benefit.hoverContent.map((line, idx) => (
              <p key={idx} className="text-sm text-background leading-relaxed">{line}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="py-3 px-6 flex flex-col gap-1 border-b border-border">
        <p className="text-xs font-medium text-foreground">{benefit.title}</p>
        <p className="text-[10px] text-muted-foreground">{benefit.source}</p>
      </div>
    </motion.div>
  );
};

const Benefits = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      title: t("benefits.energy_title"),
      headline: t("benefits.energy_headline"),
      source: t("benefits.energy_source"),
      hoverBg: "group-hover:bg-amber-500",
      hoverContent: [
        <span dangerouslySetInnerHTML={{ __html: t("benefits.energy_h1") }} />,
        <span dangerouslySetInnerHTML={{ __html: t("benefits.energy_h2") }} />,
        <span dangerouslySetInnerHTML={{ __html: t("benefits.energy_h3") }} />,
      ]
    },
    {
      title: t("benefits.digestion_title"),
      headline: t("benefits.digestion_headline"),
      source: t("benefits.digestion_source"),
      hoverBg: "group-hover:bg-[#80c322]",
      hoverContent: [
        <span dangerouslySetInnerHTML={{ __html: t("benefits.digestion_h1") }} />,
        <span dangerouslySetInnerHTML={{ __html: t("benefits.digestion_h2") }} />,
        <span dangerouslySetInnerHTML={{ __html: t("benefits.digestion_h3") }} />,
      ]
    },
    {
      title: t("benefits.immunity_title"),
      headline: t("benefits.immunity_headline"),
      source: t("benefits.immunity_source"),
      hoverBg: "group-hover:bg-yellow-500",
      hoverContent: [
        <span dangerouslySetInnerHTML={{ __html: t("benefits.immunity_h1") }} />,
        <span dangerouslySetInnerHTML={{ __html: t("benefits.immunity_h2") }} />,
        <span dangerouslySetInnerHTML={{ __html: t("benefits.immunity_h3") }} />,
      ]
    }
  ];

  return (
    <section id="benefits" className="pt-24 bg-background">
      <div className="container mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 block">
            {t("benefits.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground font-sans">
            {t("benefits.title")}
          </h2>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} benefit={benefit} index={index} />
        ))}
      </div>

      <div className="flex items-center justify-center py-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <motion.div
            className="w-[1px] h-[60px] bg-foreground origin-center"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
