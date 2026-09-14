import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, ShieldCheck, CalendarClock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  REVOLUT_PAYMENT_LINKS,
  isPaymentLinkConfigured,
  PICKUP_LOCATIONS,
  PICKUP_TIME_SLOTS,
  earliestPickupDate,
  isValidPickupDate,
} from "@/lib/checkout";

type L = { en: string; it: string };

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packId: string;
  packLabel: string;
  amount: number;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  pickupLocationId: PICKUP_LOCATIONS[0].id,
  pickupDate: "",
  pickupTimeId: "",
  notes: "",
};

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

  const minDate = earliestPickupDate();
  const selectedLocation = PICKUP_LOCATIONS.find((p) => p.id === form.pickupLocationId) ?? PICKUP_LOCATIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError({ en: "Please fill in all required fields.", it: "Compila tutti i campi obbligatori." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError({ en: "Please enter a valid email address.", it: "Inserisci un indirizzo email valido." });
      return;
    }
    if (!form.pickupDate || !isValidPickupDate(form.pickupDate)) {
      setError({
        en: "Please pick a valid pickup date — at least 2 days from now, Monday to Friday.",
        it: "Scegli una data di ritiro valida — almeno 2 giorni da oggi, dal lunedì al venerdì.",
      });
      return;
    }
    if (!form.pickupTimeId) {
      setError({ en: "Please choose a pickup time.", it: "Scegli un orario di ritiro." });
      return;
    }
    if (!isPaymentLinkConfigured(packId)) {
      setError({ en: "Checkout isn't connected yet. Please try again shortly.", it: "Il checkout non è ancora attivo. Riprova tra poco." });
      return;
    }

    const pickupTime = PICKUP_TIME_SLOTS.find((s) => s.id === form.pickupTimeId);

    setSubmitting(true);
    const { error: dbError } = await supabase.from("orders").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      pickup_location: selectedLocation.id,
      pickup_date: form.pickupDate,
      pickup_time: pickupTime ? pickupTime.id : form.pickupTimeId,
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
    key: "name" | "email" | "phone",
    label: L,
    opts: { type?: string; placeholder?: string; inputMode?: "text" | "numeric" | "email" | "tel" } = {}
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>
        {tr(label)}
        <span className="text-primary"> *</span>
      </Label>
      <Input
        id={key}
        type={opts.type ?? "text"}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {tr({ en: "Pickup details", it: "Dettagli di ritiro" })}
          </DialogTitle>
          <DialogDescription>
            {`${packLabel} · €${amount.toFixed(2)} — ${tr({ en: "no delivery, pick up in person.", it: "nessuna consegna, ritiro di persona." })}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {field("name", { en: "Full name", it: "Nome e cognome" }, { placeholder: "Giulia Rossi" })}
          {field("email", { en: "Email", it: "Email" }, { type: "email", inputMode: "email", placeholder: "giulia@email.com" })}
          {field("phone", { en: "Phone", it: "Telefono" }, { type: "tel", inputMode: "tel", placeholder: "+39 333 123 4567" })}

          {/* Pickup location */}
          <div className="space-y-1.5">
            <Label>
              {tr({ en: "Pickup location", it: "Luogo di ritiro" })}
              <span className="text-primary"> *</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {PICKUP_LOCATIONS.map((loc) => {
                const active = loc.id === form.pickupLocationId;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => set("pickupLocationId", loc.id)}
                    aria-pressed={active}
                    className={`font-semibold px-3 py-2.5 text-sm border-2 transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {tr(loc.name)}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground pt-0.5">
              {tr(selectedLocation.address)} · {tr(selectedLocation.hours)}
            </p>
          </div>

          {/* Pickup date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pickupDate">
                {tr({ en: "Pickup date", it: "Data di ritiro" })}
                <span className="text-primary"> *</span>
              </Label>
              <Input
                id="pickupDate"
                type="date"
                min={minDate}
                value={form.pickupDate}
                onChange={(e) => set("pickupDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pickupTime">
                {tr({ en: "Pickup time", it: "Orario di ritiro" })}
                <span className="text-primary"> *</span>
              </Label>
              <select
                id="pickupTime"
                value={form.pickupTimeId}
                onChange={(e) => set("pickupTimeId", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  {tr({ en: "Select…", it: "Seleziona…" })}
                </option>
                {PICKUP_TIME_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {tr(slot.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            {tr({ en: "Pickup needs at least 2 days' notice, Monday to Friday.", it: "Il ritiro richiede almeno 2 giorni di preavviso, dal lunedì al venerdì." })}
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="notes">{tr({ en: "Pickup notes (optional)", it: "Note di ritiro (facoltativo)" })}</Label>
            <Input
              id="notes"
              value={form.notes}
              placeholder={tr({ en: "e.g. picking up for a friend too", it: "es. ritiro anche per un'amica" })}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

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
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              {tr({ en: "No delivery — pick up in person at your chosen spot.", it: "Nessuna consegna — ritiro di persona nel luogo scelto." })}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="w-4 h-4 text-primary flex-shrink-0" />
              {tr({ en: "We'll confirm your exact pickup slot by email or phone.", it: "Confermeremo l'orario esatto di ritiro via email o telefono." })}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
