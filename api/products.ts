import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 50, expand: ["data.default_price"] }),
      stripe.prices.list({ active: true, limit: 50 }),
    ]);

    const result = products.data.map((product) => {
      const productPrices = prices.data.filter((p) => p.product === product.id);
      const defaultPrice =
        (product.default_price as Stripe.Price) ||
        productPrices[0] ||
        null;

      return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        image: product.images?.[0] || null,
        prices: productPrices.map((p) => ({
          id: p.id,
          amount: p.unit_amount ? p.unit_amount / 100 : 0,
          currency: p.currency.toUpperCase(),
          nickname: p.nickname || null,
        })),
        defaultPrice: defaultPrice
          ? {
              id: defaultPrice.id,
              amount: defaultPrice.unit_amount ? defaultPrice.unit_amount / 100 : 0,
              currency: defaultPrice.currency.toUpperCase(),
            }
          : null,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
