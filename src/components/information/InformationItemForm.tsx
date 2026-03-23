"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import { createInformationItemAction, updateInformationItemAction } from "@/app/actions/information";
import { uploadImageAction } from "@/app/actions/upload";
import type { InformationItem } from "@/types";

interface InformationItemFormProps {
  item?: InformationItem;
}

export default function InformationItemForm({ item }: InformationItemFormProps) {
  const action = item ? updateInformationItemAction : createInformationItemAction;
  const [state, formAction, isPending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState(item?.image || "");
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
          <Link href="/information"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {item ? "Мэдээлэл засах" : "Мэдээлэл нэмэх"}
          </h1>
          <p className="text-muted-foreground">
            {item ? "Мэдээллийн мэдээлэл шинэчлэх" : "Он оны зураг болон товч мэдээлэл нэмэх"}
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {item && <input type="hidden" name="id" value={item.id} />}
        <input type="hidden" name="image" value={imageUrl} />

        {state?.error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Зураг</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video w-full max-w-[320px] rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${imageUrl}` : imageUrl}
                      alt="Preview"
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
                  onClick={() => fileRef.current?.click()}
                  className="w-full"
                >
                  {uploading ? (
                    <><Loader2 className="size-4 animate-spin" />Оруулж байна...</>
                  ) : (
                    <><Upload className="size-4" />Зураг сонгох</>
                  )}
                </Button>
                {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Гарчиг & Тайлбар</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_mn">Гарчиг *</Label>
                <Input id="title_mn" name="title_mn" defaultValue={item?.title_mn} placeholder="Он оны зураг 1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_mn">Тайлбар</Label>
                <Textarea id="description_mn" name="description_mn" defaultValue={item?.description_mn} placeholder="Зураг болон товч мэдээлэл." rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild><Link href="/information">Болих</Link></Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="size-4 animate-spin" />{item ? "Хадгалж байна..." : "Нэмж байна..."}</>
            ) : (
              item ? "Хадгалах" : "Нэмэх"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
