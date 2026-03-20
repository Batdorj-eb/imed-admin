import Link from "next/link";
import { Suspense } from "react";
import { getSession, hasPermission } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/products/ProductsTable";
import { ProductsToast } from "@/components/products/ProductsToast";
import type { Product } from "@/types";

export default async function ProductsPage() {
  const session = await getSession();
  const canEdit = session ? hasPermission(session.role, "editor") : false;

  let products: Product[] = [];
  try {
    const data = await apiGet<{ products: Product[] }>("/products");
    products = data.products;
  } catch {
    products = [];
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ProductsToast />
      </Suspense>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Бүтээгдэхүүн</h1>
          <p className="text-muted-foreground">
            Бүтээгдэхүүний каталог удирдах ({products.length} бүтээгдэхүүн)
          </p>
        </div>

        {canEdit && (
          <Button asChild>
            <Link href="/products/create">
              <Plus className="size-4" />
              Нэмэх
            </Link>
          </Button>
        )}
      </div>

      <ProductsTable products={products} canEdit={canEdit} />
    </div>
  );
}
