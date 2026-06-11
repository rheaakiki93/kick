import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  image: string | null;
  defaultPrice: { id: string; amount: number; currency: string } | null;
}

const Shop = () => {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Failed to fetch products:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleBuyNow = async (product: StripeProduct) => {
    if (!product.defaultPrice) return;
    setBuyingId(product.id);
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            name: product.name,
            price: {
              amount: String(product.defaultPrice.amount),
              currencyCode: product.defaultPrice.currency,
            },
            quantity: 1,
            imageUrl: product.image,
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
      setBuyingId(null);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen bg-background pt-36 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 font-sans tracking-tight">
            {t("shop.title")}
          </h1>
          <p className="text-muted-foreground text-lg mb-16 max-w-lg">
            {t("shop.subtitle")}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Nessun prodotto trovato</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {products.map((product) => (
                <div key={product.id} className="group flex flex-col sm:flex-row gap-10">
                  <div className="aspect-square w-full sm:w-80 rounded-2xl overflow-hidden flex-shrink-0 bg-[#f5c5c5]">
                    <img
                      src="/product-ginger-shots.png"
                      alt={product.name}
                      className="w-full h-full object-cover object-center scale-[1.08] group-hover:scale-[1.13] transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-2 flex-1">
                    <div>
                      <h3 className="font-semibold text-foreground text-2xl leading-tight">{product.name}</h3>
                      {product.description && (
                        <p className="text-muted-foreground text-base mt-4 leading-relaxed">{product.description}</p>
                      )}
                    </div>
                    <div className="mt-8 space-y-4">
                      <p className="font-bold text-foreground text-2xl">
                        {product.defaultPrice ? `€${product.defaultPrice.amount.toFixed(2)}` : "—"}
                      </p>
                      <Button
                        size="lg"
                        className="w-full sm:w-auto px-12"
                        onClick={() => handleBuyNow(product)}
                        disabled={buyingId === product.id || !product.defaultPrice}
                      >
                        {buyingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : t("shop.buy_now")}
                      </Button>
                      <div className="flex items-start gap-3 bg-primary/10 rounded-xl px-4 py-4">
                        <span className="text-xl">🚚</span>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{t("shop.delivery_title").replace("🚚 ", "")}</p>
                          <p className="text-muted-foreground text-sm mt-1">{t("shop.delivery_desc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
