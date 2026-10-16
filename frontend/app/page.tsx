
import Link from "next/link";
import PastryCard from "./components/PastryCard";
import {
  getPastries,
  getSiteSettings,
} from "@/lib/payload";

// Render at request time, not during Docker build.
export const dynamic = "force-dynamic";

const DEFAULTS = {
  heroTitle: "Baked fresh every morning",
  heroSubtitle:
    "Small-batch pastries, made with real butter.",
  featuredHeading: "Today's Favorites",
};

export default async function Home() {
  const [pastries, settings] = await Promise.all([
    getPastries().catch((error) => {
      console.error("getPastries failed:", error);
      return [];
    }),

    getSiteSettings().catch((error) => {
      console.error("getSiteSettings failed:", error);
      return null;
    }),
  ]);

  const featured = pastries
    .filter((pastry) => pastry.featured)
    .slice(0, 4);

  const display =
    featured.length > 0
      ? featured
      : pastries.slice(0, 4);

  const heroTitle =
    settings?.heroTitle || DEFAULTS.heroTitle;

  const heroSubtitle =
    settings?.heroSubtitle || DEFAULTS.heroSubtitle;

  const featuredHeading =
    settings?.featuredHeading ||
    DEFAULTS.featuredHeading;

  return (
    <>
      <section className="hero">
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>

        <Link href="/menu" className="btn">
          Browse the Menu
        </Link>
      </section>

      <h2 className="page-title">
        {featuredHeading}
      </h2>

      <div className="menu-grid">
        {display.map((pastry) => (
          <PastryCard
            key={pastry.id}
            pastry={pastry}
          />
        ))}
      </div>
    </>
  );
}
