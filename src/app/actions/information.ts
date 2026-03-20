"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { apiPost, apiPut, apiDelete } from "@/lib/api";

export async function createInformationItemAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    return { error: "Эрх хүрэлцэхгүй байна" };
  }

  const title = formData.get("title_mn") as string;

  if (!title) {
    return { error: "Гарчиг заавал шаардлагатай" };
  }

  const body = {
    image: (formData.get("image") as string) || "",
    title_mn: title,
    title_en: "",
    description_mn: (formData.get("description_mn") as string) || "",
    description_en: "",
    sort_order: 0,
  };

  try {
    await apiPost("/information", body);
  } catch (err: any) {
    return { error: err.message || "Алдаа гарлаа" };
  }

  revalidatePath("/information");
  redirect("/information");
}

export async function updateInformationItemAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    return { error: "Эрх хүрэлцэхгүй байна" };
  }

  const id = formData.get("id") as string;
  if (!id) return { error: "ID шаардлагатай" };

  const body = {
    image: (formData.get("image") as string) || "",
    title_mn: (formData.get("title_mn") as string) || "",
    title_en: "",
    description_mn: (formData.get("description_mn") as string) || "",
    description_en: "",
    sort_order: 0,
  };

  try {
    await apiPut(`/information/${id}`, body);
  } catch (err: any) {
    return { error: err.message || "Алдаа гарлаа" };
  }

  revalidatePath("/information");
  redirect("/information");
}

export async function deleteInformationItemAction(id: string | number) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    return { error: "Эрх хүрэлцэхгүй байна" };
  }

  try {
    await apiDelete(`/information/${id}`);
  } catch (err: any) {
    return { error: err.message || "Алдаа гарлаа" };
  }

  revalidatePath("/information");
}
