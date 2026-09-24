// Large-order / events delivery request config.
//
// No payment link — submitting the form just saves the request to Supabase
// (name, contact, address, quantity, requested date). You follow up
// directly to confirm details and arrange payment.
//
// Customers pick a delivery date at checkout; we gate the picker so a valid
// date is always at least MIN_LEAD_DAYS out and never lands on a weekend.

// Flip to true to relaunch the eshop.
export const SHOP_LIVE = true;

export const DELIVERY_FEE_EUR = 2;

// 👉 Adjust these once you've settled on real pricing.
export const PRICE_PER_SHOT_EUR = 2.2;
export const MIN_QUANTITY = 10;

type L = { en: string; it: string };

// Small orders go straight to Glovo (Verde or Ceci) instead of the
// self-delivery form. 👉 paste the real store links.
export type GlovoLocation = { id: string; label: string; street: string; url: string };

export const GLOVO_LOCATIONS: GlovoLocation[] = [
  {
    id: "verde",
    label: "Verde",
    street: "Via dell'Aprica 2",
    url: "https://glovoapp.com/it/it/milano/stores/verde-milano-mil",
  },
  {
    id: "ceci",
    label: "Ceci",
    street: "Via Col di Lana 3",
    url: "https://glovoapp.com/it/it/milano/stores/ceci-bowls-libanesi-mil",
  },
];

export const DELIVERY_TIME_SLOTS: { id: string; label: L }[] = [
  { id: "morning", label: { en: "Morning (9:00–12:00)", it: "Mattina (9:00–12:00)" } },
  { id: "midday", label: { en: "Midday (12:00–14:00)", it: "Pranzo (12:00–14:00)" } },
  { id: "afternoon", label: { en: "Afternoon (14:00–18:00)", it: "Pomeriggio (14:00–18:00)" } },
  { id: "evening", label: { en: "Evening (18:00–20:00)", it: "Sera (18:00–20:00)" } },
];

// Minimum notice required before a delivery — gives time to prep the order.
const MIN_LEAD_DAYS = 2;

const toDateOnly = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

const parseDateOnly = (raw: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, day] = raw.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const isValidDeliveryDate = (raw: string): boolean => {
  const d = parseDateOnly(raw);
  if (!d) return false;
  if (isWeekend(d)) return false;

  const min = toDateOnly(new Date());
  min.setDate(min.getDate() + MIN_LEAD_DAYS);
  return toDateOnly(d).getTime() >= min.getTime();
};

// For a date-picker's `disabled` matcher — the inverse of isValidDeliveryDate,
// taking a Date instead of a YYYY-MM-DD string.
export const isDeliveryDateDisabled = (date: Date): boolean => {
  if (isWeekend(date)) return true;
  const min = toDateOnly(new Date());
  min.setDate(min.getDate() + MIN_LEAD_DAYS);
  return toDateOnly(date).getTime() < min.getTime();
};
