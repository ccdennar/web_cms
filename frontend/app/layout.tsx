import type { Metadata } from "next";
import Link from "next/link";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "./components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sweet Crumb Bakery",
  description: "Handcrafted pastries, baked fresh daily.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header className="site-header">
            <Link href="/" className="logo">🥐 Sweet Crumb</Link>
            <nav>
              <Link href="/menu">Menu</Link>
              <Link href="/order">Order</Link>
            </nav>
            <CartDrawer />
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>© {new Date().getFullYear()} Sweet Crumb Bakery · 123 Flour Lane</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
