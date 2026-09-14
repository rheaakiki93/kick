import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import shakeBottleDoodle from "@/assets/shake-bottle-doodle.png";
import coffeeDoodle from "@/assets/coffee-doodle.png";
import sunDoodle from "@/assets/sun-doodle.png";
import gingerRootDoodle from "@/assets/ginger-root-doodle.png";
import WavyDivider from "./WavyDivider";

type L = { en: string; it: string };
type IconProps = { className?: string };

// Solid, filled white doodles — matching the hand-drawn sticker style of
// the bottle illustration, not a thin-stroke icon-font look.
const SunDoodle = ({ className }: IconProps) => (
  <img src={sunDoodle} alt="" className={className} />
);

const CoffeeCupDoodle = ({ className }: IconProps) => (
  <img src={coffeeDoodle} alt="" className={className} />
);

const GingerRootDoodle = ({ className }: IconProps) => (
  <img src={gingerRootDoodle} alt="" className={className} />
);

const STEPS: { icon: (p: IconProps) => JSX.Element; text: L }[] = [
  {
    icon: SunDoodle,
    text: {
      en: "We wanted <strong>energy</strong> that doesn't <strong>crash</strong>.",
      it: "Volevamo <strong>energia</strong> che non <strong>crolla</strong>.",
    },
  },
  {
    icon: CoffeeCupDoodle,
    text: {
      en: "But most quick fixes are just <strong>sugar and caffeine</strong> in disguise.",
      it: "Ma la maggior parte delle soluzioni rapide sono solo <strong>zucchero e caffeina</strong> travestiti.",
    },
  },
];

const OriginStory = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bottleTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <WavyDivider className="bg-secondary text-background" variant="line" />
      <section
      ref={sectionRef}
      className="text-background py-20"
      style={{ background: "linear-gradient(to bottom, #F97A20 0%, #F97A20 40%, #DD6A17 100%)" }}
    >
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="relative">
          <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 border-l border-dashed border-background/30" aria-hidden="true" />
          <motion.div
            style={{ top: bottleTop }}
            className="absolute left-1/2 z-20 -translate-y-1/2 translate-x-9 sm:translate-x-14 pointer-events-none"
          >
            <img src={shakeBottleDoodle} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
          </motion.div>
          <div className="space-y-16">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex flex-col items-center text-center gap-4"
                >
                  <Icon className="relative z-10 h-16 w-auto object-contain text-background" />
                  <p
                    className="text-lg sm:text-xl font-normal leading-snug max-w-md [&_strong]:font-bold"
                    dangerouslySetInnerHTML={{ __html: tr(step.text) }}
                  />
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: STEPS.length * 0.1 }}
              className="relative flex flex-col items-center text-center gap-4"
            >
              <GingerRootDoodle className="relative z-10 h-16 w-auto object-contain text-background" />
              <p
                className="text-lg sm:text-xl font-normal leading-snug max-w-md mb-2 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{
                  __html: tr({
                    en: "So we went back to the <strong>root</strong>. Literally.",
                    it: "Quindi siamo tornati alla <strong>radice</strong>. Letteralmente.",
                  }),
                }}
              />
              <p
                className="text-2xl sm:text-3xl font-normal leading-snug max-w-md mt-2 [&_strong]:font-bold"
                dangerouslySetInnerHTML={{
                  __html: tr({
                    en: "<strong>Ginger, apple, lemon.</strong> Cold-pressed. <strong>Nothing else.</strong>",
                    it: "<strong>Zenzero, mela, limone.</strong> Pressato a freddo. <strong>Niente altro.</strong>",
                  }),
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default OriginStory;
