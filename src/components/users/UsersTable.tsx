"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SquarePen, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { deleteUserAction, toggleUserStatusAction } from "@/app/actions/users";
import type { User } from "@/types";
import { toast } from "sonner";

interface UsersTableProps {
  users: User[];
  currentUserId: string;
}

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  editor: "secondary",
  viewer: "outline",
};

export default function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteUserAction(deleteId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Хэрэглэгч устгагдлаа");
    }
    setDeleteId(null);
  };

  const handleToggleStatus = async (id: string) => {
    const result = await toggleUserStatusAction(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Хэрэглэгчийн төлөв шинэчлэгдлээ");
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">№</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead>Имэйл</TableHead>
              <TableHead className="text-center">Эрх</TableHead>
              <TableHead className="text-center">Төлөв</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Хэрэглэгч олдсонгүй.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{user.name}</span>
                      {user.id === currentUserId && (
                        <Badge variant="outline" className="text-xs">Та</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={roleBadgeVariant[user.role]} className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      disabled={user.id === currentUserId}
                      className="gap-1"
                    >
                      {user.isActive ? (
                        <><ShieldCheck className="size-4 text-emerald-600" /><span className="text-xs text-emerald-600">Идэвхтэй</span></>
                      ) : (
                        <><ShieldAlert className="size-4 text-destructive" /><span className="text-xs text-destructive">Идэвхгүй</span></>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild className="size-8">
                        <Link href={`/users/${user.id}/edit`}><SquarePen className="size-4" /></Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(user.id)}
                        disabled={user.id === currentUserId}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Хэрэглэгч устгах</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
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
    </>
  );
}
