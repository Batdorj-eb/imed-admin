import { getCategories, getProducts } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function CategoriesPage() {
  const categories = getCategories();
  const products = getProducts();

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.category_id === cat.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ангилал</h1>
        <p className="text-muted-foreground">
          Бүтээгдэхүүний ангилалууд ({categories.length} ангилал)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Бүх ангилал</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">№</TableHead>
                <TableHead>Нэр (EN)</TableHead>
                <TableHead>Нэр (MN)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Бүтээгдэхүүн</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesWithCount.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-muted-foreground">{cat.order}</TableCell>
                  <TableCell className="font-medium text-sm">{cat.nameEn}</TableCell>
                  <TableCell className="text-sm">{cat.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cat.slug}</code>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={cat.productCount > 0 ? "default" : "secondary"}>
                      {cat.productCount}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
