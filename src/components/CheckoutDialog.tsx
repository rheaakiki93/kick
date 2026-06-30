import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  REVOLUT_PAYMENT_LINKS,
  isPaymentLinkConfigured,
  isInDeliveryZone,
  normalizeCap,
} from "@/lib/checkout";

type L = { en: string; it: string };

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packId: string;
  packLabel: string;
  amount: number;
}

export const CheckoutDialog = ({ open, onOpenChange, packId, packLabel, amount }: CheckoutDialogProps) => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  const [cap, setCap] = useState("");
  const [error, setError] = useState<L | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const handleContinue = () => {
    setError(null);

    if (!isInDeliveryZone(cap)) {
      setError({
        en: "Sorry — we don't deliver to that postcode yet. We currently deliver across Milan (CAP 201xx).",
        it: "Spiacenti — non consegniamo ancora a questo CAP. Al momento consegniamo in tutta Milano (CAP 201xx).",
      });
      return;
    }

    if (!isPaymentLinkConfigured(packId)) {
      setError({
        en: "Checkout isn't connected yet. Please try again shortly.",
        it: "Il checkout non è ancora attivo. Riprova tra poco.",
      });
      return;
    }

    setRedirecting(true);
    // Remember the verified delivery postcode so it can be reused later.
    try {
      localStorage.setItem("kick-delivery-cap", normalizeCap(cap));
    } catch {
      /* ignore storage errors */
    }
    window.location.href = REVOLUT_PAYMENT_LINKS[packId];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {tr({ en: "Where are we delivering?", it: "Dove consegniamo?" })}
          </DialogTitle>
          <DialogDescription>
            {tr({
              en: `${packLabel} · €${amount.toFixed(2)} — fresh delivery in Milan every Wednesday.`,
              it: `${packLabel} · €${amount.toFixed(2)} — consegna fresca a Milano ogni mercoledì.`,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="cap">{tr({ en: "Your postcode (CAP)", it: "Il tuo CAP" })}</Label>
            <Input
              id="cap"
              inputMode="numeric"
              autoFocus
              placeholder="20121"
              value={cap}
              maxLength={5}
              onChange={(e) => {
                setCap(normalizeCap(e.target.value));
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleContinue();
              }}
            />
            {error && <p className="text-sm text-destructive leading-snug">{tr(error)}</p>}
          </div>

          <Button className="w-full rounded-none py-6 text-base" onClick={handleContinue} disabled={redirecting}>
            {redirecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              tr({ en: "Continue to secure payment", it: "Vai al pagamento sicuro" })
            )}
          </Button>

          <div className="space-y-2 pt-1">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
              {tr({
                en: "You'll enter your address and pay securely via Revolut.",
                it: "Inserirai l'indirizzo e pagherai in sicurezza tramite Revolut.",
              })}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-primary flex-shrink-0" />
              {tr({
                en: "Order by Sunday evening for Wednesday delivery.",
                it: "Ordina entro domenica sera per la consegna di mercoledì.",
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
