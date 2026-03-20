"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <span className="text-primary-foreground font-bold text-xl">iM</span>
          </div>
          <CardTitle className="text-2xl">iMED Admin</CardTitle>
          <CardDescription>Бүтээгдэхүүний удирдлагын систем</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="size-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Имэйл</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@imedtech.mn"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Нууц үгээ оруулна уу"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Нэвтэрч байна...
                </>
              ) : (
                "Нэвтрэх"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Анхны нэвтрэх: admin@imedtech.mn / admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
