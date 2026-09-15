import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import bottleStraight from "@/assets/kick-bottle-straight.png";

type L = { en: string; it: string };
type Position = "top-left" | "bottom-left" | "top-right" | "bottom-right";
type DoodleProps = { className?: string };

// Hand-drawn line doodles, same loose sketchy style as the origin-story
// icons — colored here (not white) since this section sits on white.
const FlameDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M24 5c2 7-6 10-6 17a6 6 0 0 0 12 0c0-3-2-4-2-4s1 3-1 5c1-6-5-8-3-14 0 0-1 3 0 5-3-2-2-6 0-9z" />
    <path d="M16 26a8 8 0 0 0 16 0c0-2-.5-3.5-1.5-5" />
  </svg>
);

const ShieldDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M24 5 39 11v11c0 11-7 17-15 20-8-3-15-9-15-20V11z" />
    <path d="M17 23l5 5 10-11" />
  </svg>
);

const CitrusDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="24" cy="24" r="17" />
    <circle cx="24" cy="24" r="7" />
    <path d="M24 17v-9M24 31v9M31 24h9M17 24H8M29 19l6-6M19 29l-6 6M29 29l6 6M19 19l-6-6" />
  </svg>
);

const LeafDoodle = ({ className }: DoodleProps) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 41c-1-19 14-32 32-32 1 19-13 32-32 32z" />
    <path d="M12 38c7-10 15-17 24-21" />
  </svg>
);

const CALLOUTS: { icon: (p: DoodleProps) => JSX.Element; title: L; desc: L; position: Position }[] = [
  {
    icon: FlameDoodle,
    title: { en: "Thermogenic", it: "Termogenico" },
    desc: {
      en: "Ginger boosts <strong>metabolism</strong> & <strong>circulation</strong>",
      it: "Lo zenzero stimola <strong>metabolismo</strong> e <strong>circolazione</strong>",
    },
    position: "top-left",
  },
  {
    icon: ShieldDoodle,
    title: { en: "Anti-inflammatory", it: "Antinfiammatorio" },
    desc: {
      en: "Gingerols fight <strong>inflammation</strong> & <strong>oxidative stress</strong>",
      it: "I gingeroli combattono <strong>infiammazione</strong> e <strong>stress ossidativo</strong>",
    },
    position: "bottom-left",
  },
  {
    icon: CitrusDoodle,
    title: { en: "Vitamin C", it: "Vitamina C" },
    desc: {
      en: "Lemon supports your <strong>immune system</strong>",
      it: "Il limone sostiene il <strong>sistema immunitario</strong>",
    },
    position: "top-right",
  },
  {
    icon: LeafDoodle,
    title: { en: "Digestive aid", it: "Aiuto digestivo" },
    desc: {
      en: "Apple & lemon pectin ease <strong>digestion</strong>",
      it: "La pectina di mela e limone facilita la <strong>digestione</strong>",
    },
    position: "bottom-right",
  },
];

const Callout = ({
  icon: Icon,
  title,
  desc,
  position,
  index,
}: {
  icon: (p: DoodleProps) => JSX.Element;
  title: string;
  desc: string;
  position: Position;
  index: number;
}) => {
  const isRight = position.endsWith("right");
  const isTop = position.startsWith("top");
  return (
    <motion.div
      initial={{ opacity: 0, y: isTop ? -12 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
      className={`absolute w-[108px] sm:w-[230px] text-left flex items-start gap-1.5 sm:gap-2 ${isTop ? "top-[12%] sm:top-[14%]" : "bottom-[12%] sm:bottom-[14%]"} ${
        isRight ? "left-full ml-2 sm:ml-8" : "right-full mr-2 sm:mr-8"
      }`}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-secondary text-xs sm:text-base leading-tight sm:whitespace-nowrap mb-0.5">{title}</p>
        <p
          className="text-xs sm:text-base text-secondary/80 leading-snug [&_strong]:font-bold [&_strong]:text-secondary"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      </div>
    </motion.div>
  );
};

const BenefitCallouts = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  return (
    <section className="bg-background py-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-secondary font-semibold mb-4 block">
            {tr({ en: "Why you'll love it", it: "Perché ti piacerà" })}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-secondary font-sans mb-16 sm:mb-24">
            {language === "en" ? (
              <>Small bottle, <span className="italic">real science</span>.</>
            ) : (
              <>Piccola bottiglia, <span className="italic">scienza vera</span>.</>
            )}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-32 sm:w-40 min-h-[320px] sm:min-h-[380px] flex items-center justify-center"
        >
          <div className="absolute inset-0 m-auto w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
          {CALLOUTS.map((c, i) => (
            <Callout key={c.title.en} icon={c.icon} title={tr(c.title)} desc={tr(c.desc)} position={c.position} index={i} />
          ))}
          <img src={bottleStraight} alt="Kick ginger shot bottle" className="relative z-10 w-full h-auto object-contain drop-shadow-xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitCallouts;
