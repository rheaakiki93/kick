import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    if (handle) fetch();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants.edges[selectedVariantIdx]?.node;
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { position: "top-center" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Product not found</p>
        </div>
      </Layout>
    );
  }

  const image = product.images.edges[0]?.node;
  const variant = product.variants.edges[selectedVariantIdx]?.node;

  return (
    <Layout>
      <section className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              {image ? (
                <img src={image.url} alt={image.altText || product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.title}</h1>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              {product.variants.edges.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">Variant</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v: any, i: number) => (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariantIdx(i)}
                        className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                          i === selectedVariantIdx
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {variant && (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-foreground">
                    {variant.price.currencyCode} {parseFloat(variant.price.amount).toFixed(2)}
                  </span>
                  <Button size="lg" onClick={handleAddToCart} disabled={isLoading || !variant.availableForSale}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : variant.availableForSale ? "Add to Cart" : "Sold Out"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
