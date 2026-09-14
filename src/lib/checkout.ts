// Revolut checkout config.
//
// Each pack maps to a Revolut Payment Link. Create the links in your Revolut
// Business app (Accept payments → Payment Links), turn ON "Collect shipping
// address" and "Collect phone number" on each one, then paste the URLs below.
// Revolut then captures the customer's name, email, address and phone with
// every paid order and emails them to you — that's your order list.
//
// There's no delivery — customers pick a pickup point, day and time slot
// before checkout. We gate the date/time picker so a valid pickup is always
// at least MIN_LEAD_DAYS out and never lands on a weekend.

// 👉 PASTE YOUR TWO REVOLUT PAYMENT LINK URLS HERE
export const REVOLUT_PAYMENT_LINKS: Record<string, string> = {
  "5": "https://checkout.revolut.com/pay/41fc2fca-744a-4864-8980-a0bc4ab5031d",
  "10": "https://checkout.revolut.com/pay/862b26bb-7ed0-4c4c-8cad-3fd708ffbd7d",
};

export const isPaymentLinkConfigured = (packId: string): boolean => {
  const url = REVOLUT_PAYMENT_LINKS[packId];
  return !!url && !url.includes("REPLACE_WITH");
};

type L = { en: string; it: string };

export type PickupLocation = {
  id: string;
  name: L;
  address: L;
  hours: L;
};

// 👉 Fill in the real address + hours for each spot once confirmed.
export const PICKUP_LOCATIONS: PickupLocation[] = [
  {
    id: "house",
    name: { en: "My place", it: "Casa mia" },
    address: { en: "Address TBC", it: "Indirizzo da confermare" },
    hours: { en: "Hours TBC", it: "Orari da confermare" },
  },
  {
    id: "verde",
    name: { en: "Verde", it: "Verde" },
    address: { en: "Address TBC", it: "Indirizzo da confermare" },
    hours: { en: "Hours TBC", it: "Orari da confermare" },
  },
  {
    id: "ceci",
    name: { en: "Ceci", it: "Ceci" },
    address: { en: "Address TBC", it: "Indirizzo da confermare" },
    hours: { en: "Hours TBC", it: "Orari da confermare" },
  },
];

export const PICKUP_TIME_SLOTS: { id: string; label: L }[] = [
  { id: "morning", label: { en: "Morning (9:00–12:00)", it: "Mattina (9:00–12:00)" } },
  { id: "midday", label: { en: "Midday (12:00–14:00)", it: "Pranzo (12:00–14:00)" } },
  { id: "afternoon", label: { en: "Afternoon (14:00–18:00)", it: "Pomeriggio (14:00–18:00)" } },
  { id: "evening", label: { en: "Evening (18:00–20:00)", it: "Sera (18:00–20:00)" } },
];

// Minimum notice required before a pickup — gives time to prep the order.
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

// Formats a local Date as YYYY-MM-DD. Using toISOString() here would shift
// the date backward for any timezone ahead of UTC (e.g. CEST).
const formatDateOnly = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Earliest date the picker should allow — MIN_LEAD_DAYS from today, pushed
// forward past any weekend.
export const earliestPickupDate = (): string => {
  const d = toDateOnly(new Date());
  d.setDate(d.getDate() + MIN_LEAD_DAYS);
  while (isWeekend(d)) d.setDate(d.getDate() + 1);
  return formatDateOnly(d);
};

export const isValidPickupDate = (raw: string): boolean => {
  const d = parseDateOnly(raw);
  if (!d) return false;
  if (isWeekend(d)) return false;

  const min = toDateOnly(new Date());
  min.setDate(min.getDate() + MIN_LEAD_DAYS);
  return toDateOnly(d).getTime() >= min.getTime();
};
