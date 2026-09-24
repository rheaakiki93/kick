import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Package, Mail, Instagram } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { GLOVO_LOCATIONS } from "@/lib/checkout";
import { CheckoutDialog } from "@/components/CheckoutDialog";

type L = { en: string; it: string };

const STATS: { value: string; label: L }[] = [
  { value: "60ml", label: { en: "Per shot", it: "Per shot" } },
  { value: "0g", label: { en: "Added sugar", it: "Zuccheri aggiunti" } },
  { value: "3", label: { en: "Real ingredients", it: "Ingredienti veri" } },
  { value: "100%", label: { en: "Cold-pressed", it: "Pressato a freddo" } },
];

const INSTAGRAM_URL = "https://www.instagram.com/kick_lab_/";
const CONTACT_EMAIL = "rhea@kicklab.it";

const FindKickNearYou = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];
  const [glovoOpen, setGlovoOpen] = useState(false);
  const [largerOpen, setLargerOpen] = useState(false);
  const [largerView, setLargerView] = useState<"choice" | "contact">("choice");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openLarger = () => {
    setLargerView("choice");
    setLargerOpen(true);
  };

  const startForm = () => {
    setLargerOpen(false);
    setCheckoutOpen(true);
  };

  const duplicatedStats = [...STATS, ...STATS];

  return (
    <section className="w-full min-h-screen bg-secondary flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-28 sm:pt-32">
        <div className="flex flex-col gap-4 sm:gap-6 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-6 w-full">
          <button
            type="button"
            onClick={() => setGlovoOpen(true)}
            className="flex items-center justify-center gap-3 py-6 sm:py-8 md:py-10 text-base sm:text-xl md:text-2xl font-bold uppercase tracking-wide border-2 bg-transparent text-white border-white/70 hover:border-white transition-colors"
          >
            <Car className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            {tr({ en: "Delivery", it: "Consegna" })}
          </button>
          <button
            type="button"
            onClick={openLarger}
            className="flex items-center justify-center gap-3 py-6 sm:py-8 md:py-10 text-base sm:text-xl md:text-2xl font-bold uppercase tracking-wide border-2 bg-transparent text-white border-white/70 hover:border-white transition-colors"
          >
            <Package className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            {tr({ en: "Larger orders / Events", it: "Ordini grandi / Eventi" })}
          </button>
        </div>
      </div>

      {/* Sliding stats marquee — same pattern as the homepage banner — pinned above the section's bottom edge */}
      <div className="pb-8 sm:pb-10 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ x: { duration: 20, repeat: Infinity, ease: "linear" } }}
        >
          {duplicatedStats.map((s, i) => (
            <div key={i} className="flex items-center">
              <span className="text-sm md:text-base font-medium tracking-widest text-white px-6 md:px-10">
                <span className="font-bold">{s.value}</span> {tr(s.label)}
              </span>
              <span className="text-white/40 text-lg">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Delivery → choose Verde or Ceci on Glovo */}
      <Dialog open={glovoOpen} onOpenChange={setGlovoOpen}>
        <DialogContent className="inset-0 top-0 left-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none rounded-none border-0 overflow-y-auto bg-secondary text-secondary-foreground p-6 sm:p-10 flex flex-col">
          <div className="max-w-lg mx-auto w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {tr({ en: "Choose a location", it: "Scegli un punto" })}
            </DialogTitle>
            <DialogDescription className="text-secondary-foreground/80">
              {tr({ en: "Order via Glovo from Verde or Ceci.", it: "Ordina su Glovo da Verde o Ceci." })}
            </DialogDescription>
          </DialogHeader>
          </div>

          <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
            {GLOVO_LOCATIONS.map((loc) => (
              <a
                key={loc.id}
                href={loc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setGlovoOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-6 border-2 border-white bg-white text-secondary font-bold transition-colors hover:bg-white/90"
              >
                <span className="text-lg">{loc.label}</span>
                <span className="text-sm font-normal opacity-75">{loc.street}</span>
              </a>
            ))}
          </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Larger orders / Events → fill the form, or contact directly */}
      <Dialog open={largerOpen} onOpenChange={setLargerOpen}>
        <DialogContent className="inset-0 top-0 left-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none rounded-none border-0 overflow-y-auto bg-secondary text-secondary-foreground p-6 sm:p-10 flex flex-col">
          <div className="max-w-lg mx-auto w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              {largerView === "choice"
                ? tr({ en: "How would you like to order?", it: "Come vuoi ordinare?" })
                : tr({ en: "Get in touch", it: "Contattaci" })}
            </DialogTitle>
            <DialogDescription className="text-secondary-foreground/80">
              {largerView === "choice"
                ? tr({ en: "For bigger orders or events — pick what works.", it: "Per ordini grandi o eventi — scegli quello che preferisci." })
                : tr({ en: "We'll get back to you as soon as we can.", it: "Ti risponderemo il prima possibile." })}
            </DialogDescription>
          </DialogHeader>
          </div>

          <div className="flex-1 flex items-center justify-center">
          {largerView === "choice" ? (
            <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
              <button
                type="button"
                onClick={startForm}
                className="flex items-center justify-center gap-3 py-6 border-2 border-white bg-white text-secondary font-bold transition-colors hover:bg-white/90"
              >
                <Package className="w-5 h-5" />
                {tr({ en: "Fill out the form", it: "Compila il modulo" })}
              </button>
              <button
                type="button"
                onClick={() => setLargerView("contact")}
                className="flex items-center justify-center gap-3 py-6 border-2 bg-transparent border-white/80 text-white font-bold transition-colors hover:bg-white hover:text-secondary"
              >
                <Mail className="w-5 h-5" />
                {tr({ en: "Contact us directly", it: "Contattaci direttamente" })}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-lg mx-auto w-full">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center justify-center gap-3 py-6 border-2 border-white bg-white text-secondary font-bold transition-colors hover:bg-white/90"
              >
                <Mail className="w-5 h-5" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-6 border-2 border-white bg-white text-secondary font-bold transition-colors hover:bg-white/90"
              >
                <Instagram className="w-5 h-5" />
                @kick_lab_
              </a>
              <button
                type="button"
                onClick={() => setLargerView("choice")}
                className="text-sm text-white/80 hover:text-white underline underline-offset-4 mt-2"
              >
                {tr({ en: "Back", it: "Indietro" })}
              </button>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </section>
  );
};

export default FindKickNearYou;
