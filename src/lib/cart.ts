// Lightweight Stripe cart backed by localStorage. Both the shop and the cart
// drawer read/write through here and listen for the "stripe-cart-updated" event
// so they stay in sync without a global store.

export interface CartItem {
  priceId: string;
  productId: string;
  name: string;
  amount: number;
  currency: string;
  image: string | null;
  quantity: number;
}

const KEY = "stripe-cart";
export const CART_EVENT = "stripe-cart-updated";

export const getCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
};

export const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
  const items = getCart();
  const existing = items.find((i) => i.priceId === item.priceId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...item, quantity });
  }
  saveCart(items);
};

// Create a Stripe Checkout session for everything in the cart and return its URL.
export const createCartCheckout = async (items: CartItem[]): Promise<string> => {
  const origin = window.location.origin;
  const response = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((i) => ({
        name: i.name,
        price: { amount: String(i.amount), currencyCode: i.currency },
        quantity: i.quantity,
        // Stripe requires an absolute https URL; skip on localhost.
        ...(i.image && origin.startsWith("https")
          ? { imageUrl: origin + i.image }
          : {}),
      })),
      successUrl: `${origin}/?order=success`,
      cancelUrl: `${origin}/shop`,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data?.url) {
    throw new Error(data?.error || "Failed to create checkout");
  }
  return data.url as string;
};
