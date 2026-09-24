import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { Loader2, CalendarClock, CalendarDays, Car } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DELIVERY_FEE_EUR,
  PRICE_PER_SHOT_EUR,
  MIN_QUANTITY,
  isValidDeliveryDate,
  isDeliveryDateDisabled,
} from "@/lib/checkout";

type L = { en: string; it: string };

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  deliveryStreet: "",
  deliveryCity: "Milano",
  deliveryCap: "",
  homeConfirmed: false,
  deliveryDate: "",
  notes: "",
};

const TOTAL_STEPS = 4;

const dottedInputClass =
  "rounded-none border-0 border-b-2 border-dotted border-white/50 bg-transparent px-1 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white";

export const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const { language } = useLanguage();
  const tr = (s: L) => s[language];

  const [form, setForm] = useState(emptyForm);
  const [quantity, setQuantity] = useState(String(MIN_QUANTITY));
  const [error, setError] = useState<L | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (open) {
      setStep(1);
      setQuantity(String(MIN_QUANTITY));
      setForm(emptyForm);
      setSubmitted(false);
    }
  }, [open]);

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError(null);
  };

  const setQty = (value: string) => {
    setQuantity(value);
    if (error) setError(null);
  };

  const quantityNum = parseInt(quantity, 10) || 0;
  const selectedDate = form.deliveryDate ? parse(form.deliveryDate, "yyyy-MM-dd", new Date()) : undefined;
  const totalAmount = quantityNum * PRICE_PER_SHOT_EUR + DELIVERY_FEE_EUR;

  const validateQuantity = () => {
    if (!quantityNum || quantityNum < MIN_QUANTITY) {
      setError({
        en: `Please enter at least ${MIN_QUANTITY} shots.`,
        it: `Inserisci almeno ${MIN_QUANTITY} shot.`,
      });
      return false;
    }
    return true;
  };

  const validateDate = () => {
    if (!form.deliveryDate || !isValidDeliveryDate(form.deliveryDate)) {
      setError({
        en: "Please pick a valid date — at least 2 days from now, Monday to Friday.",
        it: "Scegli una data valida — almeno 2 giorni da oggi, dal lunedì al venerdì.",
      });
      return false;
    }
    return true;
  };

  const validateContact = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError({ en: "Please fill in all required fields.", it: "Compila tutti i campi obbligatori." });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError({ en: "Please enter a valid email address.", it: "Inserisci un indirizzo email valido." });
      return false;
    }
    return true;
  };

  const validateAddress = () => {
    if (!form.deliveryStreet.trim() || !form.deliveryCity.trim() || !form.deliveryCap.trim()) {
      setError({ en: "Please complete your delivery address.", it: "Completa il tuo indirizzo di consegna." });
      return false;
    }
    if (!form.homeConfirmed) {
      setError({
        en: "Please confirm someone will be there to receive the delivery.",
        it: "Conferma che qualcuno sarà presente per ricevere la consegna.",
      });
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateQuantity()) return;
    if (step === 2 && !validateDate()) return;
    if (step === 3 && !validateContact()) return;
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateQuantity() || !validateDate() || !validateContact() || !validateAddress()) return;

    setSubmitting(true);
    const orderId = crypto.randomUUID();
    const { error: dbError } = await supabase.from("orders").insert({
      id: orderId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      fulfillment_method: "delivery",
      pickup_location: null,
      address: form.deliveryStreet.trim(),
      city: form.deliveryCity.trim(),
      cap: form.deliveryCap.trim(),
      pickup_date: form.deliveryDate,
      pickup_time: null,
      notes: form.notes.trim() || null,
      pack_id: String(quantityNum),
      pack_label: tr({ en: `${quantityNum} shots`, it: `${quantityNum} shot` }),
      amount: totalAmount,
      currency: "EUR",
    });

    if (dbError) {
      console.error("Order save failed:", dbError);
      setError({ en: "Something went wrong saving your order. Please try again.", it: "Si è verificato un errore nel salvare l'ordine. Riprova." });
      setSubmitting(false);
      return;
    }

    // Order is already saved — a broken notification email shouldn't block
    // the confirmation screen, so this failure is only logged.
    supabase.functions.invoke("notify-order", { body: { orderId } }).then(({ error: notifyError }) => {
      if (notifyError) console.error("Order notification email failed:", notifyError);
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  const field = (
    key: "name" | "email" | "phone",
    label: L,
    opts: { type?: string; placeholder?: string; inputMode?: "text" | "numeric" | "email" | "tel" } = {}
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>
        {tr(label)}
        <span className="text-destructive"> *</span>
      </Label>
      <Input
        id={key}
        type={opts.type ?? "text"}
        inputMode={opts.inputMode}
        placeholder={opts.placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className={dottedInputClass}
      />
    </div>
  );

  const stepTitle =
    step === 1
      ? tr({ en: "How many shots?", it: "Quanti shot?" })
      : step === 2
      ? tr({ en: "Delivery date", it: "Data di consegna" })
      : step === 3
      ? tr({ en: "Your details", it: "I tuoi dati" })
      : tr({ en: "Delivery address", it: "Indirizzo di consegna" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inset-0 top-0 left-0 translate-x-0 translate-y-0 w-screen h-screen max-w-none max-h-none rounded-none border-0 overflow-y-auto bg-secondary text-secondary-foreground p-6 sm:p-10 flex flex-col">
        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <h2 className="text-3xl font-bold text-white">{tr({ en: "Thanks!", it: "Grazie!" })}</h2>
            <p className="text-secondary-foreground/80 max-w-sm">
              {tr({
                en: "We've got your request and will be in touch to confirm the details and payment.",
                it: "Abbiamo ricevuto la tua richiesta, ti contatteremo per confermare i dettagli e il pagamento.",
              })}
            </p>
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-4 rounded-none py-6 px-10 border-2 border-white bg-white text-secondary hover:bg-white/90"
            >
              {tr({ en: "Close", it: "Chiudi" })}
            </Button>
          </div>
        ) : (
        <>
        <div className="max-w-lg mx-auto w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">{stepTitle}</DialogTitle>
          <DialogDescription className="text-secondary-foreground/80">
            {`${quantityNum} ${tr({ en: "shots", it: "shot" })} · €${totalAmount.toFixed(2)}`}
          </DialogDescription>
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div key={s} className={`h-1 flex-1 ${s <= step ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>
        </DialogHeader>
        </div>

        <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto w-full space-y-4 pt-1">
          {step === 1 && (
            <div className="flex flex-col items-center gap-5 py-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => setQty(String(Math.max(MIN_QUANTITY, quantityNum - 1)))}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-white text-white text-2xl font-bold hover:bg-white hover:text-secondary transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_QUANTITY}
                  value={quantity}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-28 sm:w-32 text-center text-4xl sm:text-5xl font-bold bg-transparent border-0 border-b-2 border-dotted border-white/50 text-white focus:outline-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setQty(String(quantityNum + 1))}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-white text-white text-2xl font-bold hover:bg-white hover:text-secondary transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-secondary-foreground/75">
                {tr({ en: `shots · minimum ${MIN_QUANTITY}`, it: `shot · minimo ${MIN_QUANTITY}` })}
              </p>
              <p className="text-xl font-bold text-white">€{totalAmount.toFixed(2)}</p>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-5 py-8">
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 px-8 py-6 sm:px-10 sm:py-8 border-2 border-white text-white text-2xl sm:text-3xl font-bold hover:bg-white hover:text-secondary transition-colors"
                  >
                    <CalendarDays className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" />
                    {selectedDate ? format(selectedDate, "d MMM yyyy") : tr({ en: "Select date", it: "Scegli data" })}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-none" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (!date) return;
                      set("deliveryDate", format(date, "yyyy-MM-dd"));
                      setDateOpen(false);
                    }}
                    disabled={isDeliveryDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-secondary-foreground/75">
                {tr({ en: "Needs at least 2 days' notice, Monday to Friday.", it: "Richiede almeno 2 giorni di preavviso, dal lunedì al venerdì." })}
              </p>
            </div>
          )}

          {step === 3 && (
            <>
              {field("name", { en: "Full name", it: "Nome e cognome" }, { placeholder: "Giulia Rossi" })}
              {field("email", { en: "Email", it: "Email" }, { type: "email", inputMode: "email", placeholder: "giulia@email.com" })}
              {field("phone", { en: "Phone", it: "Telefono" }, { type: "tel", inputMode: "tel", placeholder: "+39 333 123 4567" })}
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-sm text-secondary-foreground/90 -mt-1">
                {tr({
                  en: "I'll drive it to you myself — Milan city only. It needs to go straight in the fridge, so make sure someone's there to receive it — home or office both work.",
                  it: "Te lo porto io stessa in auto — solo Milano città. Va messo subito in frigo, quindi assicurati che qualcuno sia presente per riceverlo — va bene sia casa che ufficio.",
                })}
              </p>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="deliveryStreet">
                    {tr({ en: "Street and number", it: "Via e numero civico" })}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <AddressAutocomplete
                    id="deliveryStreet"
                    placeholder={tr({ en: "Via Roma 1", it: "Via Roma 1" })}
                    value={form.deliveryStreet}
                    onChange={(v) => set("deliveryStreet", v)}
                    onSelectAddress={({ street, city, cap }) =>
                      setForm((f) => ({ ...f, deliveryStreet: street, deliveryCity: city, deliveryCap: cap }))
                    }
                    className={dottedInputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="deliveryCity">
                      {tr({ en: "City", it: "Città" })}
                      <span className="text-destructive"> *</span>
                    </Label>
                    <Input
                      id="deliveryCity"
                      value={form.deliveryCity}
                      onChange={(e) => set("deliveryCity", e.target.value)}
                      className={dottedInputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="deliveryCap">
                      {tr({ en: "ZIP / CAP", it: "CAP" })}
                      <span className="text-destructive"> *</span>
                    </Label>
                    <Input
                      id="deliveryCap"
                      placeholder="20121"
                      value={form.deliveryCap}
                      onChange={(e) => set("deliveryCap", e.target.value)}
                      className={dottedInputClass}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">{tr({ en: "Notes (optional)", it: "Note (facoltativo)" })}</Label>
                  <Input
                    id="notes"
                    value={form.notes}
                    placeholder={tr({ en: "e.g. intercom code, floor", it: "es. codice citofono, piano" })}
                    onChange={(e) => set("notes", e.target.value)}
                    className={dottedInputClass}
                  />
                </div>
                <label className="flex items-start gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={form.homeConfirmed}
                    onChange={(e) => set("homeConfirmed", e.target.checked)}
                  />
                  <span>
                    {tr({
                      en: "I confirm someone will be there (home or office) at the chosen date and time to receive it.",
                      it: "Confermo che qualcuno sarà presente (casa o ufficio) nel giorno e orario scelti per riceverlo.",
                    })}
                    <span className="text-destructive"> *</span>
                  </span>
                </label>
              </div>

              <div className="space-y-2 pt-1">
                <p className="flex items-center gap-2 text-sm text-secondary-foreground/90">
                  <Car className="w-4 h-4 text-white flex-shrink-0" />
                  {tr({
                    en: "Self-delivery by car, Milan only — needs to go in the fridge, so someone must be there to receive it (home or office).",
                    it: "Consegna in auto, solo Milano — va messo in frigo, quindi qualcuno deve essere presente per riceverlo (casa o ufficio).",
                  })}
                </p>
                <p className="flex items-center gap-2 text-sm text-secondary-foreground/90">
                  <CalendarClock className="w-4 h-4 text-white flex-shrink-0" />
                  {tr({ en: "We'll confirm the exact time and payment by email or phone.", it: "Confermeremo l'orario esatto e il pagamento via email o telefono." })}
                </p>
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive leading-snug">{tr(error)}</p>}

          <div className="flex gap-3 pt-1">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={goBack}
                  className="flex-1 rounded-none py-6 text-base border-2 border-white text-white bg-transparent hover:bg-white/10"
                >
                  {tr({ en: "Back", it: "Indietro" })}
                </Button>
              )}
              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-none py-6 text-base border-2 border-white bg-white text-secondary hover:bg-white/90"
                >
                  {tr({ en: "Continue", it: "Continua" })}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-none py-6 text-base border-2 border-white bg-white text-secondary hover:bg-white/90"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : tr({ en: "Done", it: "Fatto" })}
                </Button>
              )}
          </div>
        </form>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};
