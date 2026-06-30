import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
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

const emptyForm = { name: "", email: "", phone: "", address: "", city: "Milano", cap: "", notes: "" };

export const CheckoutDialog = ({ open, onOpenChange, packId, packLabel, amount }: CheckoutDialogProps) => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<L | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      setError({ en: "Please fill in all required fields.", it: "Compila tutti i campi obbligatori." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError({ en: "Please enter a valid email address.", it: "Inserisci un indirizzo email valido." });
      return;
    }
    if (!isInDeliveryZone(form.cap)) {
      setError({
        en: "Sorry — we don't deliver to that postcode yet. We currently deliver across Milan (CAP 201xx).",
        it: "Spiacenti — non consegniamo ancora a questo CAP. Al momento consegniamo in tutta Milano (CAP 201xx).",
      });
      return;
    }
    if (!isPaymentLinkConfigured(packId)) {
      setError({ en: "Checkout isn't connected yet. Please try again shortly.", it: "Il checkout non è ancora attivo. Riprova tra poco." });
      return;
    }

    setSubmitting(true);
    const { error: dbError } = await supabase.from("orders").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim() || "Milano",
      cap: normalizeCap(form.cap),
      notes: form.notes.trim() || null,
      pack_id: packId,
      pack_label: packLabel,
      amount,
      currency: "EUR",
    });

    if (dbError) {
      console.error("Order save failed:", dbError);
      setError({ en: "Something went wrong saving your order. Please try again.", it: "Si è verificato un errore nel salvare l'ordine. Riprova." });
      setSubmitting(false);
      return;
    }

    window.location.href = REVOLUT_PAYMENT_LINKS[packId];
  };

  const field = (
    key: keyof typeof form,
    label: L,
    opts: { type?: string; placeholder?: string; required?: boolean; maxLength?: number; inputMode?: "text" | "numeric" | "email" | "tel" } = {}
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>
        {tr(label)}
        {opts.required !== false && <span className="text-primary"> *</span>}
      </Label>
      <Input
        id={key}
        type={opts.type ?? "text"}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        maxLength={opts.maxLength}
        value={form[key]}
        onChange={(e) => set(key, key === "cap" ? normalizeCap(e.target.value) : e.target.value)}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {tr({ en: "Delivery details", it: "Dettagli di consegna" })}
          </DialogTitle>
          <DialogDescription>
            {`${packLabel} · €${amount.toFixed(2)} — ${tr({ en: "fresh delivery in Milan every Wednesday.", it: "consegna fresca a Milano ogni mercoledì." })}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {field("name", { en: "Full name", it: "Nome e cognome" }, { placeholder: "Giulia Rossi" })}
          {field("email", { en: "Email", it: "Email" }, { type: "email", inputMode: "email", placeholder: "giulia@email.com" })}
          {field("phone", { en: "Phone", it: "Telefono" }, { type: "tel", inputMode: "tel", placeholder: "+39 333 123 4567" })}
          {field("address", { en: "Address (street, number, floor/buzzer)", it: "Indirizzo (via, numero, piano/citofono)" }, { placeholder: "Via Dante 12, scala B, 3° piano" })}

          <div className="grid grid-cols-2 gap-3">
            {field("city", { en: "City", it: "Città" })}
            {field("cap", { en: "Postcode (CAP)", it: "CAP" }, { inputMode: "numeric", placeholder: "20121", maxLength: 5 })}
          </div>

          {field("notes", { en: "Delivery notes (optional)", it: "Note di consegna (facoltativo)" }, { required: false, placeholder: tr({ en: "e.g. leave with the doorman", it: "es. lasciare al portinaio" }) })}

          {error && <p className="text-sm text-destructive leading-snug">{tr(error)}</p>}

          <Button type="submit" className="w-full rounded-none py-6 text-base" disabled={submitting}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `${tr({ en: "Pay", it: "Paga" })} €${amount.toFixed(2)}`
            )}
          </Button>

          <div className="space-y-2 pt-1">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
              {tr({ en: "Payment is processed securely by Revolut.", it: "Il pagamento è gestito in sicurezza da Revolut." })}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-primary flex-shrink-0" />
              {tr({ en: "Order by Sunday evening for Wednesday delivery.", it: "Ordina entro domenica sera per la consegna di mercoledì." })}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
