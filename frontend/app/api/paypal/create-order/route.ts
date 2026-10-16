import { NextResponse } from "next/server";
import { CURRENCY, PAYPAL_API, getAccessToken, priceLines } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const { cents } = await priceLines(items);
    const token = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Bakery order",
            amount: { currency_code: CURRENCY, value: (cents / 100).toFixed(2) },
          },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message ?? "PayPal order creation failed");
    return NextResponse.json({ id: data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}