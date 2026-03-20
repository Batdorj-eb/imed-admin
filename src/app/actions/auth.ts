"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Имэйл болон нууц үг шаардлагатай" };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Нэвтрэх боломжгүй" };
    }

    await setSession({
      id: String(data.user.id),
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    });
  } catch {
    return { error: "Сервертэй холбогдож чадсангүй" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
