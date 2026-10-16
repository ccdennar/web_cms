"use client";

import { useRef, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCart } from "@/lib/cart";

const CURRENCY = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY ?? "USD";

export default function OrderPage() {
  const { items, total, clear } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");

  // Only IDs and quantities go to the server. It looks up names and prices itself.
  const lines = items.map((i) => ({ pastryId: i.pastryId, quantity: i.quantity }));

  function getCustomer() {
    const form = new FormData(formRef.current!);
    return {
      customerName: form.get("name") as string,
      customerEmail: form.get("email") as string,
      customerPhone: form.get("phone") as string,
      pickupDate: form.get("pickupDate") as string,
      notes: (form.get("notes") as string) || undefined,
    };
  }

  if (status === "success") {
    return (
      <div className="page-title" style={{ padding: "5rem 1rem" }}>
        <div className="success-msg" style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2>Order placed! 🎉</h2>
          <p style={{ marginTop: "0.5rem" }}>
            Thank you! Your order <strong>#{orderId}</strong> is paid and being prepared.
            We&apos;ll confirm by email shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="page-title">Place Your Order</h1>

      {items.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "#7a6a6a" }}>
          Your cart is empty — <a href="/menu" style={{ color: "#a0522d" }}>browse the menu</a> first.
        </p>
      ) : (
        <form ref={formRef} className="order-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name">Full Name *</label>
            <input id="name" name="name" required placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required placeholder="jane@example.com" />
          </div>
          <div>
            <label htmlFor="phone">Phone *</label>
            <input id="phone" name="phone" type="tel" required placeholder="(555) 123-4567" />
          </div>
          <div>
            <label htmlFor="pickupDate">Pickup Date *</label>
            <input id="pickupDate" name="pickupDate" type="date" required />
          </div>
          <div>
            <label htmlFor="notes">Notes (allergies, custom message on cake, etc.)</label>
            <textarea id="notes" name="notes" rows={3} />
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem" }}>
            {items.map((i) => (
              <div key={i.pastryId} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0" }}>
                <span>{i.quantity}× {i.name}</span>
                <span>${(i.unitPrice * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "1.2rem", marginTop: "0.5rem" }}>
              Total: ${total.toFixed(2)}
            </div>
          </div>

          {status === "error" && <div className="error-msg">{errorMsg}</div>}

          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: CURRENCY,
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              // Don't open PayPal until the form fields are valid
              onClick={(_data, actions) =>
                formRef.current?.reportValidity() ? actions.resolve() : actions.reject()
              }
              createOrder={async () => {
                setStatus("idle");
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ items: lines }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                return data.id;
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paypalOrderId: data.orderID,
                    customer: getCustomer(),
                    items: lines,
                  }),
                });
                const result = await res.json();
                if (!res.ok) {
                  setErrorMsg(result.error);
                  setStatus("error");
                  return;
                }
                setOrderId(String(result.id));
                setStatus("success");
                clear();
              }}
              onError={(err) => {
                setErrorMsg(err instanceof Error ? err.message : "PayPal error. Please try again.");
                setStatus("error");
              }}
            />
          </PayPalScriptProvider>
        </form>
      )}
    </>
  );
}