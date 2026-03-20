import { notFound, redirect } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getSession, hasPermission } from "@/lib/auth";
import ProductForm from "@/components/products/ProductForm";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    redirect("/products");
  }

  const { id } = await params;

  let product: Product;
  try {
    const data = await apiGet<{ product: Product }>(`/products/${id}`);
    product = data.product;
  } catch {
    notFound();
  }

  return <ProductForm product={product!} />;
}
