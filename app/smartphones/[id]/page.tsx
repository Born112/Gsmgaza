import { notFound } from "next/navigation";
import { getProductById, SMARTPHONES } from "@/lib/data";
import { SmartphoneDetailContent } from "@/components/catalog/SmartphoneDetailContent";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return SMARTPHONES.map(p => ({ id: String(p.id) }));
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

export default async function SmartphoneDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product || product.category !== "smartphone") notFound();
  return <SmartphoneDetailContent product={product} />;
}
