"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import type { Pastry } from "@/lib/payload";

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001";

export default function PastryCard({ pastry }: { pastry: Pastry }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ pastryId: pastry.id, name: pastry.name, unitPrice: pastry.price, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const imgUrl = pastry.image?.url ?? "/placeholder.jpg";

  return (
    <div className={`card ${!pastry.inStock ? "sold-out" : ""}`}>
      <Image src={imgUrl} alt={pastry.image?.alt || pastry.name} width={400} height={180} />
      <div className="card-body">
        <h3>{pastry.name}</h3>
        <p style={{ fontSize: "0.9rem", color: "#7a6a6a" }}>{pastry.description}</p>
        <div className="price">${pastry.price.toFixed(2)}</div>
        <button className="btn" disabled={!pastry.inStock} onClick={handleAdd}>
          {!pastry.inStock ? "Sold Out" : added ? "Added ✓" : "Add to Order"}
        </button>
      </div>
    </div>
  );
}
