import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Loader2, Leaf, Snowflake, MapPin, Check, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

import bottleGinger from "@/assets/kick-bottle-ginger.png";
import drinkingImg from "@/assets/illustration-drinking.png";
import ingGinger from "@/assets/ingredient-ginger.png";
import ingApple from "@/assets/ingredient-apple.png";
import ingLemon from "@/assets/ingredient-lemon.png";

const PRODUCT_NAME = "Ginger Shot Bundle";

type L = { en: string; it: string };

type Pack = { id: string; label: L; amount: number };
const PACKS: Pack[] = [
  { id: "5", label: { en: "Pack of 5", it: "Pacco da 5" }, amount: 13 },
  { id: "10", label: { en: "Pack of 10", it: "Pacco da 10" }, amount: 22 },
];
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const GALLERY = [
  bottleGinger,
  "/images/shop-5pack.webp",
  "/images/shop-flatlay.webp",
  "/images/shop-lifestyle.webp",
];

const STATS: { value: string; label: L }[] = [
  { value: "60ml", label: { en: "Per shot", it: "Per shot" } },
  { value: "0g", label: { en: "Added sugar", it: "Zuccheri aggiunti" } },
  { value: "3", label: { en: "Real ingredients", it: "Ingredienti veri" } },
  { value: "100%", label: { en: "Cold-pressed", it: "Pressato a freddo" } },
];

const INGREDIENTS: { img: string; name: L; desc: L; bg: string }[] = [
  { img: ingGinger, name: { en: "Ginger", it: "Zenzero" }, desc: { en: "The fiery base — warming and energising.", it: "La base piccante — riscaldante ed energizzante." }, bg: "bg-kick-ginger" },
  { img: ingApple, name: { en: "Apple", it: "Mela" }, desc: { en: "Crisp natural sweetness, no added sugar.", it: "Dolcezza naturale e croccante, senza zuccheri aggiunti." }, bg: "bg-kick-lime" },
  { img: ingLemon, name: { en: "Lemon", it: "Limone" }, desc: { en: "Bright vitamin C to kick off your day.", it: "Vitamina C luminosa per iniziare la giornata." }, bg: "bg-kick-turmeric" },
];

const FAQS: { q: L; a: L }[] = [
  { q: { en: "How is Kick made?", it: "Come è fatto Kick?" }, a: { en: "Cold-pressed in small batches from fresh ginger, apple and lemon. Nothing added, nothing heated.", it: "Pressato a freddo in piccoli lotti da zenzero, mela e limone freschi. Niente aggiunto, niente riscaldato." } },
  { q: { en: "What's in the bundle?", it: "Cosa contiene il pacco?" }, a: { en: "Choose a pack of 5 or 10 60ml ginger shots — your daily kicks delivered fresh.", it: "Scegli un pacco da 5 o 10 shot di zenzero da 60ml — le tue cariche quotidiane consegnate fresche." } },
  { q: { en: "How does delivery work?", it: "Come funziona la consegna?" }, a: { en: "Order by Sunday evening and we deliver fresh to your door in Milan every Wednesday.", it: "Ordina entro domenica sera e consegniamo fresco a casa tua a Milano ogni mercoledì." } },
];

const Shop = () => {
  const [selectedPackId, setSelectedPackId] = useState(PACKS[0].id);
  const [activeImg, setActiveImg] = useState(0);
  const [buying, setBuying] = useState(false);
  const { t, language } = useLanguage();
  const tr = (s: L) => s[language];

  const selectedPack = PACKS.find((p) => p.id === selectedPackId) ?? PACKS[0];
  const priceLabel = `€${selectedPack.amount.toFixed(2)}`;

  const handleBuyNow = async () => {
    setBuying(true);
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            name: PRODUCT_NAME,
            variantTitle: selectedPack.label.en,
            price: {
              amount: String(selectedPack.amount),
              currencyCode: "eur",
            },
            quantity: 1,
            imageUrl: `${window.location.origin}/images/shop-5pack.webp`,
          }],
          successUrl: `${window.location.origin}/?order=success`,
          cancelUrl: `${window.location.origin}/shop`,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data?.url) throw new Error(data?.error || "Failed to create checkout");
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Errore. Riprova.", { position: "top-center" });
    } finally {
      setBuying(false);
    }
  };

  const scrollToBuy = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Layout>
      {/* Announcement bar */}
      <div className="bg-kick-dark text-kick-cream text-center text-xs sm:text-sm font-medium tracking-wide py-2.5 px-4 mt-20 sm:mt-24 flex items-center justify-center gap-2">
        <Truck className="w-4 h-4" />
        {tr({ en: "Fresh delivery every Wednesday in Milan", it: "Consegna fresca ogni mercoledì a Milano" })}
      </div>

      {/* ===== HERO / PRODUCT ===== */}
      <section className="bg-background pt-10 sm:pt-14 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Gallery */}
              <div className="lg:sticky lg:top-28">
                <div className="aspect-square w-full bg-muted flex items-center justify-center p-10">
                  <img
                    src={GALLERY[activeImg]}
                    alt={PRODUCT_NAME}
                    className="w-full h-full object-contain transition-opacity duration-300"
                  />
                </div>
                <div className="grid grid-cols-4 gap-px mt-px">
                  {GALLERY.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-square bg-muted p-3 transition-all ${
                        activeImg === i ? "ring-2 ring-inset ring-primary" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Buy box */}
              <div>
                <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.15em] mb-5">
                  <span className="w-6 h-px bg-primary" />
                  {tr({ en: "Best seller", it: "Più venduto" })}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.02]">
                  {PRODUCT_NAME}
                </h1>

                <p className="text-primary text-xl font-semibold mt-3">
                  {tr({ en: "Any time you need a kick", it: "Ogni volta che ti serve una carica" })}
                </p>

                <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
                  {tr({
                    en: "A pack of pure, cold-pressed ginger shots with apple and lemon. A daily kick of natural energy — nothing added.",
                    it: "Un pacco di shot di zenzero puri e pressati a freddo con mela e limone. Una carica quotidiana di energia naturale — niente aggiunto.",
                  })}
                </p>

                {/* Stat badges — sharp, divided */}
                <div className="grid grid-cols-4 border-y border-border mt-8">
                  {STATS.map((s, i) => (
                    <div key={s.value} className={`text-center py-4 px-1 ${i > 0 ? "border-l border-border" : ""}`}>
                      <p className="text-lg sm:text-xl font-bold text-foreground leading-none">{s.value}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 leading-tight uppercase tracking-wide">{tr(s.label)}</p>
                    </div>
                  ))}
                </div>

                {/* Size selector */}
                <div className="mt-8">
                  <p className="text-sm font-semibold text-foreground mb-3">{tr({ en: "Size", it: "Formato" })}</p>
                  <div className="flex gap-3">
                    {PACKS.map((p) => {
                      const active = p.id === selectedPackId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPackId(p.id)}
                          aria-pressed={active}
                          className={`flex-1 font-semibold px-6 py-3 text-base border-2 transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-transparent text-foreground border-border hover:border-primary"
                          }`}
                        >
                          {tr(p.label)}
                          <span className={`block text-xs font-normal mt-0.5 ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            €{p.amount.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="mt-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-foreground">{priceLabel}</span>
                    <span className="text-sm text-muted-foreground">{tr({ en: "incl. VAT", it: "IVA inclusa" })}</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-5 text-base py-6 rounded-none"
                    onClick={handleBuyNow}
                    disabled={buying}
                  >
                    {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : t("shop.buy_now")}
                  </Button>

                  {/* Delivery callout — sharp */}
                  <div className="flex items-start gap-3 border-l-2 border-primary pl-4 mt-6">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t("shop.delivery_title").replace("🚚 ", "")}</p>
                      <p className="text-muted-foreground text-sm mt-1">{t("shop.delivery_desc")}</p>
                    </div>
                  </div>

                  {/* Trust row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                    {[
                      { icon: Leaf, label: { en: "100% natural", it: "100% naturale" } },
                      { icon: Snowflake, label: { en: "Cold-pressed", it: "Pressato a freddo" } },
                      { icon: MapPin, label: { en: "Made in Milan", it: "Fatto a Milano" } },
                    ].map(({ icon: Icon, label }) => (
                      <span key={label.en} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4 text-primary" />
                        {tr(label)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="bg-secondary text-white py-14">
        <div className="container mx-auto px-6 max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.value}>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight">{s.value}</p>
              <p className="text-sm text-white/70 mt-2 uppercase tracking-wide">{tr(s.label)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INGREDIENTS ===== */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6 max-w-6xl mb-8">
          <motion.div {...fadeUp} className="max-w-xl">
            <p className="text-primary font-bold uppercase tracking-[0.15em] text-sm mb-3">
              {tr({ en: "What's inside", it: "Cosa c'è dentro" })}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {tr({ en: "Three real ingredients. Nothing else.", it: "Tre ingredienti veri. Niente altro." })}
            </h2>
          </motion.div>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-border border-y border-border">
          {INGREDIENTS.map((ing, i) => (
            <motion.div
              key={ing.name.en}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`flex flex-col p-6 h-64 sm:h-72 ${ing.bg}`}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src={ing.img} alt={tr(ing.name)} className="w-28 h-28 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{tr(ing.name)}</h3>
                <p className="text-sm text-foreground/75 mt-1 leading-snug">{tr(ing.desc)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== WHY KICK ===== */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-6 max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp} className="flex items-center justify-center">
            <img src={drinkingImg} alt="" className="w-full max-w-[260px] h-auto object-contain" />
          </motion.div>
          <motion.div {...fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-5">
              {tr({ en: "A daily kick, done right", it: "Una carica quotidiana, fatta bene" })}
            </h2>
            <ul className="space-y-3">
              {[
                { en: "Cold-pressed to keep every nutrient alive", it: "Pressato a freddo per preservare ogni nutriente" },
                { en: "No added sugar, no concentrates, no preservatives", it: "Senza zuccheri aggiunti, concentrati o conservanti" },
                { en: "Just ginger, apple and lemon", it: "Solo zenzero, mela e limone" },
                { en: "Delivered fresh, never sitting on a shelf", it: "Consegnato fresco, mai fermo su uno scaffale" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-base">{tr(item)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.h2 {...fadeUp} className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-center mb-12">
            {tr({ en: "Questions, answered", it: "Domande, risposte" })}
          </motion.h2>
          <div className="border-t border-border">
            {FAQS.map((f) => (
              <div key={f.q.en} className="py-6 border-b border-border">
                <h3 className="font-bold text-foreground text-lg">{tr(f.q)}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{tr(f.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-primary-foreground tracking-tight">
            {tr({ en: "Ready to feel the kick?", it: "Pronto a sentire la carica?" })}
          </h2>
          <p className="text-primary-foreground/80 text-lg mt-4">
            {tr({ en: "Fresh ginger shots, delivered weekly in Milan.", it: "Ginger shot freschi, consegnati ogni settimana a Milano." })}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 px-12 py-6 text-base rounded-none"
            onClick={scrollToBuy}
          >
            {t("shop.buy_now")}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
