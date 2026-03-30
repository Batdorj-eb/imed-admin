"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SquarePen, Trash2, Search, Eye } from "lucide-react";
import { deleteProductAction } from "@/app/actions/products";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductsTableProps {
  products: Product[];
  canEdit: boolean;
}

export default function ProductsTable({ products, canEdit }: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteProductAction(deleteId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Бүтээгдэхүүн устгагдлаа");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filtered.length} / {products.length}
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">№</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Брэнд</TableHead>
              <TableHead className="text-center">Төлөв</TableHead>
              {canEdit && <TableHead className="text-right">Үйлдэл</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 5 : 4} className="h-24 text-center text-muted-foreground">
                  {search ? "Хайлтад тохирох бүтээгдэхүүн олдсонгүй." : "Бүтээгдэхүүн бүртгэгдээгүй байна."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{product.name}</p>
                  </TableCell>
                  <TableCell className="text-sm">{product.brand}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {product.is_featured && <Badge variant="secondary" className="text-xs">Онцлох</Badge>}
                      {product.is_new && <Badge className="text-xs">Шинэ</Badge>}
                    </div>
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="size-8">
                          <Link href={`/products/${product.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="size-8">
                          <Link href={`/products/${product.id}/edit`}>
                            <SquarePen className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Бүтээгдэхүүн устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
