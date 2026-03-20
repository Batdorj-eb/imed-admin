"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { createUserAction, updateUserAction } from "@/app/actions/users";
import type { User, Role } from "@/types";

interface UserFormProps {
  user?: User;
}

const roles: { value: Role; label: string; description: string }[] = [
  { value: "admin", label: "Админ", description: "Бүх эрхтэй, хэрэглэгч удирдах боломжтой" },
  { value: "editor", label: "Засварлагч", description: "Бүтээгдэхүүн нэмэх, засах, устгах боломжтой" },
  { value: "viewer", label: "Үзэгч", description: "Зөвхөн харах эрхтэй" },
];

export default function UserForm({ user }: UserFormProps) {
  const action = user ? updateUserAction : createUserAction;
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user ? "Хэрэглэгч засах" : "Хэрэглэгч нэмэх"}
          </h1>
          <p className="text-muted-foreground">
            {user ? "Хэрэглэгчийн мэдээлэл шинэчлэх" : "Системд шинэ хэрэглэгч нэмэх"}
          </p>
        </div>
      </div>

      <form action={formAction} className="max-w-2xl space-y-6">
        {user && <input type="hidden" name="id" value={user.id} />}

        {state?.error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Бүртгэлийн мэдээлэл</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Нэр *</Label>
              <Input id="name" name="name" defaultValue={user?.name} placeholder="Бат-Эрдэнэ" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Имэйл *</Label>
              <Input id="email" name="email" type="email" defaultValue={user?.email} placeholder="user@imedtech.mn" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Нууц үг {user ? "(хоосон үлдээвэл өөрчлөхгүй)" : "*"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={user ? "Шинэ нууц үг" : "Нууц үг оруулна уу"}
                required={!user}
                minLength={6}
              />
            </div>
            {user && (
              <div className="flex items-center gap-2 pt-2">
                <Switch id="isActive" name="isActive" defaultChecked={user.isActive} />
                <Label htmlFor="isActive" className="text-sm">Идэвхтэй бүртгэл</Label>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Эрх & Зөвшөөрөл</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    defaultChecked={user ? user.role === role.value : role.value === "viewer"}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild><Link href="/users">Болих</Link></Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="size-4 animate-spin" />{user ? "Хадгалж байна..." : "Нэмж байна..."}</>
            ) : (
              user ? "Хадгалах" : "Нэмэх"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
