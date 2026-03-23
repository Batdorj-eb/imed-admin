"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SquarePen, Trash2 } from "lucide-react";
import { deleteInformationItemAction } from "@/app/actions/information";
import type { InformationItem } from "@/types";
import { toast } from "sonner";

interface InformationTableProps {
  items: InformationItem[];
  canEdit: boolean;
}

export default function InformationTable({ items, canEdit }: InformationTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteInformationItemAction(deleteId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Мэдээлэл устгагдлаа");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Зураг</TableHead>
              <TableHead>Гарчиг</TableHead>
              {canEdit && <TableHead className="text-right">Үйлдэл</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 3 : 2} className="h-24 text-center text-muted-foreground">
                  Мэдээлэл бүртгэгдээгүй байна.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.image}` : item.image}
                          alt={item.title_mn}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">-</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{item.title_mn}</p>
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="size-8">
                          <Link href={`/information/${item.id}/edit`}>
                            <SquarePen className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(item.id)}
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
            <AlertDialogTitle>Мэдээлэл устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ мэдээллийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
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
