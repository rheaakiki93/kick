import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import ComingSoonShop from "@/components/ComingSoonShop";
import SEO from "@/components/SEO";
import FindKickNearYou from "@/components/FindKickNearYou";
import WavyDivider from "@/components/WavyDivider";
import { SHOP_LIVE } from "@/lib/checkout";

type L = { en: string; it: string };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const FAQS: { q: L; a: L }[] = [
  { q: { en: "How is Kick made?", it: "Come è fatto Kick?" }, a: { en: "Cold-pressed in small batches from fresh ginger, apple and lemon. Nothing added, nothing heated.", it: "Pressato a freddo in piccoli lotti da zenzero, mela e limone freschi. Niente aggiunto, niente riscaldato." } },
  { q: { en: "What's in the bundle?", it: "Cosa contiene il pacco?" }, a: { en: "Choose your own quantity (10 shots minimum) of 60ml ginger shots — your daily kicks, fresh and delivered.", it: "Scegli tu la quantità (minimo 10 shot) di shot di zenzero da 60ml — le tue cariche quotidiane, fresche e consegnate." } },
  { q: { en: "How does delivery work?", it: "Come funziona la consegna?" }, a: { en: "For a few shots, order via Glovo from Verde or Ceci. For bigger orders or events, fill out the delivery form (self-delivered by car in Milan, +€2) or reach out directly by email or Instagram.", it: "Per pochi shot, ordina su Glovo da Verde o Ceci. Per ordini grandi o eventi, compila il modulo di consegna (in auto a Milano, +€2) oppure scrivici via email o Instagram." } },
];

const Shop = () => (
  <>
    <SEO
      title={SHOP_LIVE ? "Shop | Kick Ginger Shots" : "Shop | Kick by Kicklab — Coming Soon"}
      description={
        SHOP_LIVE
          ? "Order Kick's cold-pressed ginger shots — delivered in Milan via Glovo or self-delivery. Pure ginger, apple and lemon, 60ml daily energy shots, no added sugar."
          : "Kick's online shop is paused for now. Leave your email to be notified the moment fresh cold-pressed ginger shots are back."
      }
      path="/shop"
    />
    {SHOP_LIVE ? <ShopLive /> : <ComingSoonShop />}
  </>
);

const ShopLive = () => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  return (
    <Layout>
      <FindKickNearYou />
      <WavyDivider className="bg-secondary text-background" />

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
    </Layout>
  );
};

export default Shop;
