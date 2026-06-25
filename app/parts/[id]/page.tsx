import { notFound } from "next/navigation";
import { getProductById, PARTS } from "@/lib/data";
import { PartDetailContent } from "@/components/catalog/PartDetailContent";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PARTS.map(p => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — GSMBaza`,
    description: product.description,
  };
}

export default async function PartDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product || product.category !== "part") notFound();
  return <PartDetailContent product={product} />;
}
