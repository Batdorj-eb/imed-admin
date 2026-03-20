import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { getSession, hasPermission } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, SquarePen } from "lucide-react";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let product: Product;
  try {
    const data = await apiGet<{ product: Product }>(`/products/${id}`);
    product = data.product;
  } catch {
    notFound();
  }

  const session = await getSession();
  const canEdit = session ? hasPermission(session.role, "editor") : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{product!.name}</h1>
          </div>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/products/${product!.id}/edit`}>
              <SquarePen className="size-4" />Засах
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Дэлгэрэнгүй</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Брэнд" value={product!.brand} />
            <Row label="Нэр" value={product!.name} />
            <div className="flex gap-2 pt-2">
              {product!.is_featured && <Badge variant="secondary">Онцлох</Badge>}
              {product!.is_new && <Badge>Шинэ</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Медиа</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Зураг" value={product!.image || "Байхгүй"} />
            <Row label="Брошур" value={product!.brochure || "Байхгүй"} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Тайлбар & Онцлог</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{product!.description || "Тайлбар байхгүй"}</p>
          {product!.features && product!.features.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Онцлог:</p>
              <ul className="list-disc list-inside space-y-1">
                {product!.features.map((f, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{f.feature}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {product!.specifications && product!.specifications.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Техникийн үзүүлэлт</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {product!.specifications.map((s, i) => (
                <div key={i} className="flex justify-between items-start py-1.5 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{s.spec_key}</span>
                  <span className="text-sm font-medium text-right">{s.spec_value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value || "-"}</span>
    </div>
  );
}
