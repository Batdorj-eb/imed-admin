"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getSession, hasPermission } from "@/lib/auth";
import * as db from "@/lib/db";
import type { User, Role } from "@/types";

export async function createUserAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    return { error: "Зөвхөн админ хэрэглэгч удирдах боломжтой" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  if (!name || !email || !password) {
    return { error: "Бүх талбарыг бөглөнө үү" };
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return { error: "Энэ имэйлтэй хэрэглэгч бүртгэлтэй байна" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: role || "viewer",
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  db.createUser(user);
  revalidatePath("/users");
  redirect("/users");
}

export async function updateUserAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    return { error: "Зөвхөн админ хэрэглэгч удирдах боломжтой" };
  }

  const id = formData.get("id") as string;
  if (!id) return { error: "Хэрэглэгчийн ID шаардлагатай" };

  const updates: Partial<User> = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as Role,
    isActive: formData.get("isActive") === "on",
  };

  const password = formData.get("password") as string;
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }

  const result = db.updateUser(id, updates);
  if (!result) return { error: "Хэрэглэгч олдсонгүй" };

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUserAction(id: string) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    return { error: "Зөвхөн админ хэрэглэгч удирдах боломжтой" };
  }

  if (id === session.id) {
    return { error: "Өөрийн бүртгэлийг устгах боломжгүй" };
  }

  db.deleteUser(id);
  revalidatePath("/users");
}

export async function toggleUserStatusAction(id: string) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    return { error: "Зөвхөн админ хэрэглэгч удирдах боломжтой" };
  }

  const user = db.getUser(id);
  if (!user) return { error: "Хэрэглэгч олдсонгүй" };

  db.updateUser(id, { isActive: !user.isActive });
  revalidatePath("/users");
}
