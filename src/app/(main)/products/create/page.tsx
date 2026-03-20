import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import ProductForm from "@/components/products/ProductForm";

export default async function CreateProductPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    redirect("/products");
  }

  return <ProductForm />;
}
