"use server";

import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function uploadImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const session = await getSession();
  const token = session?.token;

  if (!token) {
    return { error: "Нэвтрэх шаардлагатай" };
  }

  const file = formData.get("image") as File;
  if (!file || file.size === 0) {
    return { error: "Зураг сонгоогүй байна" };
  }

  try {
    const uploadForm = new FormData();
    uploadForm.append("image", file);

    const res = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: uploadForm,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error || "Upload амжилтгүй" };
    }

    const data = await res.json();
    return { url: data.url };
  } catch {
    return { error: "Зураг upload хийхэд алдаа гарлаа" };
  }
}
