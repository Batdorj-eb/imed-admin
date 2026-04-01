"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { apiPost, apiPut, apiDelete } from "@/lib/api";

type ProductFeature = {
  feature: string;
  feature_en: string;
};

type ProductSpecification = {
  spec_key: string;
  spec_value: string;
};

type ProductPayload = {
  brand: string;
  category_id: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  image: string;
  brochure: string;
  is_featured: boolean;
  is_new: boolean;
  has_warranty: boolean;
  features: ProductFeature[];
  specifications: ProductSpecification[];
};

export async function createProductAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    return { error: "Эрх хүрэлцэхгүй байна" };
  }

  const name = formData.get("name") as string;

  if (!name) {
    return { error: "Бүтээгдэхүүний нэр заавал шаардлагатай" };
  }

  const featuresMn = ((formData.get("features") as string) || "").split("\n").filter(Boolean);
  const features: ProductFeature[] = featuresMn.map((f: string) => ({
    feature: f,
    feature_en: f,
  }));

  const specKeys = ((formData.get("spec_keys") as string) || "").split("\n").filter(Boolean);
  const specValues = ((formData.get("spec_values") as string) || "").split("\n").filter(Boolean);
  const specifications: ProductSpecification[] = specKeys.map((key: string, i: number) => ({
    spec_key: key,
    spec_value: specValues[i] || "",
  }));

  const body: ProductPayload = {
    brand: (formData.get("brand") as string) || "",
    category_id: (formData.get("category_id") as string) || "",
    name,
    name_en: name,
    description: (formData.get("description") as string) || "",
    description_en: (formData.get("description") as string) || "",
    image: (formData.get("image") as string) || "",
    brochure: (formData.get("brochure") as string) || "",
    is_featured: formData.get("is_featured") === "on",
    is_new: formData.get("is_new") === "on",
    has_warranty: formData.get("has_warranty") === "1",
    features,
    specifications,
  };

  try {
    await apiPost("/products", body);
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Алдаа гарлаа" };
  }

  revalidatePath("/products");
  redirect("/products?created=1");
}

export async function updateProductAction(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    return { error: "Эрх хүрэлцэхгүй байна" };
  }

  const id = formData.get("id") as string;
  if (!id) return { error: "Бүтээгдэхүүний ID шаардлагатай" };

  const featuresMn = ((formData.get("features") as string) || "").split("\n").filter(Boolean);
  const features: ProductFeature[] = featuresMn.map((f: string) => ({
    feature: f,
    feature_en: f,
  }));

  const specKeys = ((formData.get("spec_keys") as string) || "").split("\n").filter(Boolean);
  const specValues = ((formData.get("spec_values") as string) || "").split("\n").filter(Boolean);
  const specifications: ProductSpecification[] = specKeys.map((key: string, i: number) => ({
    spec_key: key,
    spec_value: specValues[i] || "",
  }));

  const name = (formData.get("name") as string) || "";
  const body: ProductPayload = {
    brand: (formData.get("brand") as string) || "",
    category_id: (formData.get("category_id") as string) || "",
    name,
    name_en: name,
    description: (formData.get("description") as string) || "",
    description_en: (formData.get("description") as string) || "",
    image: (formData.get("image") as string) || "",
    brochure: (formData.get("brochure") as string) || "",
    is_featured: formData.get("is_featured") === "on",
    is_new: formData.get("is_new") === "on",
    has_warranty: formData.get("has_warranty") === "1",
    features,
    specifications,
  };

  try {
    await apiPut(`/products/${id}`, body);
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Алдаа гарлаа" };
  }

  revalidatePath("/products");
  redirect("/products?updated=1");
}

export async function deleteProductAction(id: string | number) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    return { error: "Эрх хүрэлцэхгүй байна" };
  }

  try {
    await apiDelete(`/products/${id}`);
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Алдаа гарлаа" };
  }

  revalidatePath("/products");
}