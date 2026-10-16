
import { getPastries } from "@/lib/payload";
import PastryCard from "../components/PastryCard";

// Fetch menu data at runtime.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const pastries = await getPastries().catch(
    (error) => {
      console.error(
        "Failed to load menu:",
        error
      );

      return [];
    }
  );

  if (pastries.length === 0) {
    return (
      <div className="page-title">
        <h1>Menu</h1>

        <p
          style={{
            marginTop: "1rem",
            color: "#7a6a6a",
          }}
        >
          Our pastries aren&apos;t loaded yet.
          Please check that the Payload CMS
          backend is running.
        </p>
      </div>
    );
  }

  const categories = Array.from(
    new Set(
      pastries.map((pastry) => pastry.category)
    )
  );

  return (
    <>
      <h1 className="page-title">
        Our Menu
      </h1>

      {categories.map((category) => (
        <section key={category}>
          <h2
            className="page-title"
            style={{
              textTransform: "capitalize",
              padding: "1.5rem 1rem 0.5rem",
            }}
          >
            {category}
          </h2>

          <div className="menu-grid">
            {pastries
              .filter(
                (pastry) =>
                  pastry.category === category
              )
              .map((pastry) => (
                <PastryCard
                  key={pastry.id}
                  pastry={pastry}
                />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
