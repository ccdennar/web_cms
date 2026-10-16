export const PAYPAL_API = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
export const PAYLOAD_URL = process.env.PAYLOAD_URL ?? "http://localhost:3001";
export const CURRENCY = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY ?? "USD";

export type CartLine = { pastryId: number | string; quantity: number };

export type OrderItem = {
  pastryId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("PayPal auth failed");
  return (await res.json()).access_token;
}

/**
 * Builds the order items and total from Payload's data.
 * The client only supplies pastryId + quantity; name and price come from the database.
 */
export async function priceLines(
  lines: CartLine[]
): Promise<{ items: OrderItem[]; cents: number }> {
  if (!Array.isArray(lines) || lines.length === 0) throw new Error("Your cart is empty");

  const items: OrderItem[] = [];
  let cents = 0;

  for (const line of lines) {
    const quantity = Math.floor(Number(line.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 100) {
      throw new Error("Invalid quantity");
    }

    const res = await fetch(`${PAYLOAD_URL}/api/pastries/${line.pastryId}?depth=0`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("An item in your cart no longer exists");
    const pastry = await res.json();

    if (pastry.available === false) throw new Error(`${pastry.name} is currently unavailable`);
    if (typeof pastry.price !== "number" || !pastry.name) {
      throw new Error("An item in your cart has no price");
    }

    const unitCents = Math.round(pastry.price * 100);
    cents += unitCents * quantity;
    items.push({
      pastryId: String(line.pastryId),
      name: pastry.name,
      unitPrice: unitCents / 100,
      quantity,
    });
  }

  if (cents <= 0) throw new Error("Empty order");
  return { items, cents };
}