
const PAYLOAD_URL =
  typeof window === "undefined"
    ? process.env.PAYLOAD_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001"
    : process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001";

// ==========================================
// TYPES
// ==========================================

export type Pastry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: "cakes" | "cookies" | "breads" | "seasonal";
  image?: {
    url: string;
    alt: string;
  };
  inStock: boolean;
  featured: boolean;
};

export type OrderItem = {
  pastryId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type OrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  notes?: string;
  items: OrderItem[];
  total: number;
};

export type SiteSettings = {
  bakeryName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: {
    url: string;
    alt?: string;
  };
  featuredHeading: string;
  footerText: string;
  hours: string;
};

// ==========================================
// GET ALL PASTRIES
// ==========================================

export async function getPastries(): Promise<Pastry[]> {
  const res = await fetch(
    `${PAYLOAD_URL}/api/pastries?depth=1`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch pastries: HTTP ${res.status}`
    );
  }

  const data = await res.json();
  return data.docs as Pastry[];
}

// ==========================================
// GET SINGLE PASTRY
// ==========================================

export async function getPastry(
  slug: string
): Promise<Pastry | undefined> {
  const res = await fetch(
    `${PAYLOAD_URL}/api/pastries?depth=1&where[slug][equals]=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch pastry: HTTP ${res.status}`
    );
  }

  const data = await res.json();
  return data.docs[0] as Pastry | undefined;
}

// ==========================================
// GET SITE SETTINGS
// ==========================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(
    `${PAYLOAD_URL}/api/globals/site-settings`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch site settings: HTTP ${res.status}`
    );
  }

  return res.json();
}

// ==========================================
// CREATE ORDER
// ==========================================

export async function createOrder(
  order: OrderPayload
) {
  const res = await fetch(
    `${PAYLOAD_URL}/api/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err?.errors?.[0]?.message ||
        `Failed to place order: HTTP ${res.status}`
    );
  }

  return res.json();
}
