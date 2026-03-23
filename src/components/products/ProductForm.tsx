"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, ArrowLeft, Upload, X, ImageIcon } from "lucide-react";

const PRODUCT_CATEGORIES = [
  { id: "diagnostic-imaging", name: "Дүрс оношилгооны тоног төхөөрөмж" },
  { id: "icu", name: "Эрчимт эмчилгээний тоног төхөөрөмж" },
  { id: "surgery", name: "Мэс заслын тоног төхөөрөмж" },
  { id: "physio", name: "Физик эмчилгээний тоног төхөөрөмж" },
  { id: "obgyn", name: "Нярай, эх барихын тоног төхөөрөмж" },
  { id: "other", name: "Бусад эмнэлгийн тоног төхөөрөмж, хэрэглэгдэхүүн" },
  { id: "sterilization", name: "Ариутгал, халдваргүйжүүлэх тоног төхөөрөмж" },
  { id: "laundry", name: "Угаалгын тоног төхөөрөмж" },
  { id: "clinical-lab", name: "Клиник лабораторийн тоног төхөөрөмж" },
  { id: "chemical-lab", name: "Химийн лабораторийн тоног төхөөрөмж" },
  { id: "disposable", name: "Нэг удаагийн хэрэгсэл" },
  { id: "beds-furniture", name: "Эмнэлгийн ор, тавилга" },
  { id: "gas-system", name: "Хийн системийн тоног төхөөрөмж, хэрэглэгдэхүүн" },
  { id: "training", name: "Сургалтын хэрэгсэл" },
];
import { createProductAction, updateProductAction } from "@/app/actions/products";
import { uploadImageAction } from "@/app/actions/upload";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const action = product ? updateProductAction : createProductAction;
  const [state, formAction, isPending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState(product?.image || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImageAction(formData);

      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        setImageUrl(result.url);
      }
    } catch {
      setUploadError("Зураг upload хийхэд алдаа гарлаа");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/products"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {product ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}
          </h1>
          <p className="text-muted-foreground">
            {product ? "Бүтээгдэхүүний мэдээлэл шинэчлэх" : "Каталогт шинэ бүтээгдэхүүн нэмэх"}
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {product && <input type="hidden" name="id" value={product.id} />}
        <input type="hidden" name="image" value={imageUrl} />
        <input type="hidden" name="is_featured" value={isFeatured ? "on" : ""} />
        <input type="hidden" name="is_new" value={isNew ? "on" : ""} />

        {state?.error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        {/* Row 1: Нэр, Брэнд + Зураг */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Нэр & Брэнд</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Брэнд</Label>
                <Input id="brand" name="brand" defaultValue={product?.brand} placeholder="жишээ: LYNMOU" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Ангилал</Label>
                <select
                  id="category"
                  name="category_id"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Ангилал сонгох</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Нэр *</Label>
                <Input id="name" name="name" defaultValue={product?.name} placeholder="Бүтээгдэхүүний нэр" required />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="is_featured" className="text-sm cursor-pointer" onClick={() => setIsFeatured((v) => !v)}>Онцлох</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_new"
                    checked={isNew}
                    onCheckedChange={setIsNew}
                  />
                  <Label htmlFor="is_new" className="text-sm cursor-pointer" onClick={() => setIsNew((v) => !v)}>Шинэ</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Бүтээгдэхүүний зураг</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${imageUrl}` : imageUrl}
                      alt="Product"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => { setImageUrl(""); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-white hover:bg-destructive/90"
                    >
                      <X className="size-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-10" />
                    <span className="text-xs">Зураг оруулаагүй</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={(e) => {
                    e.preventDefault();
                    fileRef.current?.click();
                  }}
                  className="w-full"
                >
                  {uploading ? (
                    <><Loader2 className="size-4 animate-spin" />Оруулж байна...</>
                  ) : (
                    <><Upload className="size-4" />Зураг сонгох</>
                  )}
                </Button>
                {uploadError && (
                  <p className="text-xs text-destructive">{uploadError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brochure">Брошур URL</Label>
                <Input id="brochure" name="brochure" defaultValue={product?.brochure} placeholder="Брошурын линк" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Тайлбар */}
        <Card>
          <CardHeader><CardTitle className="text-base">Тайлбар</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Тайлбар</Label>
              <Textarea id="description" name="description" defaultValue={product?.description} placeholder="Бүтээгдэхүүний тайлбар" rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Row 3: Онцлог шинж чанарууд */}
        <Card>
          <CardHeader><CardTitle className="text-base">Онцлог шинж чанарууд</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="features">Онцлог (мөр бүрт нэг)</Label>
              <Textarea
                id="features"
                name="features"
                defaultValue={product?.features?.map((f) => f.feature).join("\n")}
                placeholder={'32" 4K дэлгэцтэй\nХэрэглэхэд хялбар мэдрэгчтэй\nOne-touch холболттой'}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Row 4: Техникийн үзүүлэлт */}
        <Card>
          <CardHeader><CardTitle className="text-base">Техникийн үзүүлэлт</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="spec_keys">Нэр (мөр бүрт нэг)</Label>
                <Textarea
                  id="spec_keys"
                  name="spec_keys"
                  defaultValue={product?.specifications?.map((s) => s.spec_key).join("\n")}
                  placeholder={"display\nimagingModes\noutputPower"}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spec_values">Утга (мөр бүрт нэг)</Label>
                <Textarea
                  id="spec_values"
                  name="spec_values"
                  defaultValue={product?.specifications?.map((s) => s.spec_value).join("\n")}
                  placeholder={'32" 4K\nHLI, SVI, TCI\n52kW'}
                  rows={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild><Link href="/products">Болих</Link></Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="size-4 animate-spin" />{product ? "Хадгалж байна..." : "Нэмж байна..."}</>
            ) : (
              product ? "Хадгалах" : "Нэмэх"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
