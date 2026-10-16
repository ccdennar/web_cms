import Image from "next/image";
import { getPastry } from "@/lib/payload";

export default async function PastryPage({ params }: { params: { slug: string } }) {
  const pastry = await getPastry(params.slug).catch(() => undefined);

  if (!pastry) return <h1 className="page-title">Not found</h1>;

  const imgUrl = pastry.image?.url ?? "/placeholder.jpg";

  return (
    <div className="page-title" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Image src={imgUrl} alt={pastry.name} width={600} height={300} style={{ borderRadius: 12, margin: "1rem 0" }} />
      <h1>{pastry.name}</h1>
      <p style={{ color: "#7a6a6a", margin: "1rem 0" }}>{pastry.description}</p>
      <p className="price" style={{ fontSize: "1.5rem" }}>${pastry.price.toFixed(2)}</p>
    </div>
  );
}
