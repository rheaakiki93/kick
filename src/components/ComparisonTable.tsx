import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import WavyDivider from "./WavyDivider";
import kickBottle from "@/assets/kick-bottle-straight.png";

type L = { en: string; it: string };
type Mark = "yes" | "no" | "partial";
type IconProps = { className?: string };

const CanDoodle = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
    <path d="M15 10h18v4l-3 3v21a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3V17l-3-3v-4z" />
  </svg>
);

const CoffeeCupIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
    <path d="M10 18h22v11c0 6.1-4.9 11-11 11S10 35.1 10 29V18z" />
    <path d="M32 20c4-1 8 1.5 8 5s-4 6-8 5v-3c2 .4 4-.6 4-2s-2-2.4-4-2v-3z" />
  </svg>
);

const JuiceBottleIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
    <rect x="18" y="6" width="10" height="7" rx="2" />
    <path d="M16 13h16l2 6v21a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V19z" />
  </svg>
);

const COLUMNS: { label: L; icon?: (p: IconProps) => JSX.Element; image?: string }[] = [
  { label: { en: "Energy drinks", it: "Energy drink" }, icon: CanDoodle },
  { label: { en: "Coffee", it: "Caffè" }, icon: CoffeeCupIcon },
  { label: { en: "Juices", it: "Succhi" }, icon: JuiceBottleIcon },
  { label: { en: "Kick", it: "Kick" }, image: kickBottle },
];

const ROWS: { label: L; marks: [Mark, Mark, Mark, Mark] }[] = [
  {
    label: { en: "Natural energy, no crash", it: "Energia naturale, senza crollo" },
    marks: ["no", "no", "no", "yes"],
  },
  {
    label: { en: "Zero added sugar", it: "Zero zuccheri aggiunti" },
    marks: ["no", "yes", "no", "yes"],
  },
  {
    label: { en: "Real, whole ingredients", it: "Ingredienti veri e interi" },
    marks: ["no", "yes", "yes", "yes"],
  },
  {
    label: { en: "Cold-pressed & unprocessed", it: "Pressato a freddo e non processato" },
    marks: ["no", "no", "no", "yes"],
  },
];

const MarkIcon = ({ mark }: { mark: Mark }) => {
  if (mark === "yes") return <Check className="w-4 h-4 sm:w-5 sm:h-5 text-background mx-auto" />;
  if (mark === "no") return <X className="w-4 h-4 sm:w-5 sm:h-5 text-background/30 mx-auto" />;
  return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-background/50 mx-auto" />;
};

const colBorder = (i: number) => (i < COLUMNS.length - 1 ? "border-r border-dashed border-background/30" : "");
const lastColHighlight = (i: number) => (i === COLUMNS.length - 1 ? "border-2 border-dashed border-background/70 bg-background/10" : "");

const ComparisonTable = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  return (
    <>
      <WavyDivider className="bg-background text-secondary" />
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-background/70 mb-4 block">
              {tr({ en: "How it compares", it: "Come si confronta" })}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-background font-sans">
              {tr({ en: "Kick vs. the usual fixes", it: "Kick vs. le solite soluzioni" })}
            </h2>
          </motion.div>

          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[26%] sm:w-[30%]" />
              {COLUMNS.map((col) => (
                <col key={col.label.en} className="w-[18.5%] sm:w-[17.5%]" />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b-2 border-background">
                <th className="text-left py-3 px-0.5 sm:px-2"> </th>
                {COLUMNS.map((col, i) => (
                  <th key={col.label.en} className={`py-3 px-0.5 sm:px-3 text-center align-bottom ${colBorder(i)} ${lastColHighlight(i)}`}>
                    <div className="flex flex-col items-center gap-1.5 sm:gap-3 pb-2">
                      {col.image ? (
                        <img src={col.image} alt="" className="h-7 sm:h-14 w-auto object-contain" />
                      ) : col.icon ? (
                        <col.icon className="h-5 w-5 sm:h-9 sm:w-9 text-background" />
                      ) : null}
                      <span className="text-[9px] sm:text-xs uppercase tracking-wide font-bold text-background leading-tight">{tr(col.label)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label.en} className="border-t border-background/20">
                  <td className="py-4 px-0.5 sm:px-2 text-xs sm:text-sm font-medium text-background leading-snug">{tr(row.label)}</td>
                  {row.marks.map((mark, i) => (
                    <td key={i} className={`py-4 px-0.5 sm:px-3 text-center ${colBorder(i)} ${lastColHighlight(i)}`}>
                      <MarkIcon mark={mark} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <WavyDivider className="bg-secondary text-background" />
    </>
  );
};

export default ComparisonTable;
