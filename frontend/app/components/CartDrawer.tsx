"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartDrawer() {
  const { items, count, total, updateQty, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="cart-fab" onClick={() => setOpen(true)}>
        🧺 Cart <span className="cart-badge">{count}</span>
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <h2>Your Order</h2>
        {items.length === 0 && <p>Your cart is empty.</p>}
        {items.map((item) => (
          <div className="cart-item" key={item.pastryId}>
            <div>
              <strong>{item.name}</strong>
              <div>${(item.unitPrice * item.quantity).toFixed(2)}</div>
            </div>
            <div className="qty-controls">
              <button onClick={() => updateQty(item.pastryId, item.quantity - 1)}>−</button>
              <span style={{ margin: "0 0.4rem" }}>{item.quantity}</span>
              <button onClick={() => updateQty(item.pastryId, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.pastryId)} style={{ marginLeft: "0.5rem" }}>🗑</button>
            </div>
          </div>
        ))}
        <div className="cart-total">Total: ${total.toFixed(2)}</div>
        {items.length > 0 && (
          <Link href="/order" className="btn" style={{ width: "100%", textAlign: "center" }} onClick={() => setOpen(false)}>
            Checkout →
          </Link>
        )}
      </aside>
    </>
  );
}
