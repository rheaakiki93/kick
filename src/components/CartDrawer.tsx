import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CartItem, CART_EVENT, getCart, saveCart, createCartCheckout } from "@/lib/cart";
import { useLanguage } from "@/contexts/LanguageContext";

export const CartDrawer = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(getCart());
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const sync = () => setItems(getCart());
    window.addEventListener(CART_EVENT, sync);
    return () => window.removeEventListener(CART_EVENT, sync);
  }, []);

  useEffect(() => { if (isOpen) setItems(getCart()); }, [isOpen]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.amount * i.quantity, 0);
  const currency = items[0]?.currency || "EUR";

  const updateQuantity = (priceId: string, quantity: number) => {
    const updated = quantity <= 0
      ? items.filter((i) => i.priceId !== priceId)
      : items.map((i) => i.priceId === priceId ? { ...i, quantity } : i);
    saveCart(updated);
    setItems(updated);
  };

  const removeItem = (priceId: string) => {
    const updated = items.filter((i) => i.priceId !== priceId);
    saveCart(updated);
    setItems(updated);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const url = await createCartCheckout(items);
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Errore. Riprova.", { position: "top-center" });
      setCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative text-white/90 hover:text-white transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center text-secondary-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>{t("shop.cart_title")}</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? t("shop.cart_empty")
              : `${totalItems} ${totalItems === 1 ? "item" : "items"}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("shop.cart_empty")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.priceId} className="flex gap-4 p-2">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🫚</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="font-semibold">{item.currency} {item.amount.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.priceId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.priceId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.priceId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{t("shop.cart_total")}</span>
                  <span className="text-xl font-bold">{currency} {totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={checkingOut}>
                  {checkingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : t("shop.checkout")}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
