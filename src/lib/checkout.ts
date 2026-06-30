// Revolut checkout config.
//
// Each pack maps to a Revolut Payment Link. Create the links in your Revolut
// Business app (Accept payments → Payment Links), turn ON "Collect shipping
// address" and "Collect phone number" on each one, then paste the URLs below.
// Revolut then captures the customer's name, email, address and phone with
// every paid order and emails them to you — that's your order list.
//
// The site only adds a Milan delivery-zone gate (postcode check) before
// sending the customer to Revolut, so you never get paid for an order you
// can't deliver.

// 👉 PASTE YOUR TWO REVOLUT PAYMENT LINK URLS HERE
export const REVOLUT_PAYMENT_LINKS: Record<string, string> = {
  "5": "https://checkout.revolut.com/pay/41fc2fca-744a-4864-8980-a0bc4ab5031d",
  "10": "https://checkout.revolut.com/pay/862b26bb-7ed0-4c4c-8cad-3fd708ffbd7d",
};

export const isPaymentLinkConfigured = (packId: string): boolean => {
  const url = REVOLUT_PAYMENT_LINKS[packId];
  return !!url && !url.includes("REPLACE_WITH");
};

// Milan delivery zone. By default we accept every Milan city postcode
// (CAP 20121–20162, i.e. anything starting "201"). To extend to specific
// hinterland CAPs, add them to EXTRA_CAPS.
const EXTRA_CAPS = new Set<string>([
  // e.g. "20090", "20099", // Sesto San Giovanni, etc.
]);

export const normalizeCap = (raw: string): string => raw.replace(/\D/g, "").slice(0, 5);

export const isInDeliveryZone = (raw: string): boolean => {
  const cap = normalizeCap(raw);
  if (cap.length !== 5) return false;
  return cap.startsWith("201") || EXTRA_CAPS.has(cap);
};
