import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

interface CartLineItem {
  name: string;
  variantTitle?: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  imageUrl?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { items, successUrl, cancelUrl } = req.body as {
      items: CartLineItem[];
      successUrl: string;
      cancelUrl: string;
    };

    const lineItems = items.map((item) => ({
      price_data: {
        currency: item.price.currencyCode.toLowerCase(),
        product_data: {
          name:
            item.variantTitle && item.variantTitle !== "Default Title"
              ? `${item.name} – ${item.variantTitle}`
              : item.name,
          ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: Math.round(parseFloat(item.price.amount) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "LU", "CH", "IT", "ES", "DE", "NL", "PT"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "eur" },
            display_name: "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
