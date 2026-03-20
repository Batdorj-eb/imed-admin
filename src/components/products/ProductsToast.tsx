"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ProductsToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const created = searchParams.get("created");
    const updated = searchParams.get("updated");

    if (created === "1") {
      toast.success("Бүтээгдэхүүн амжилттай нэмэгдлээ");
      router.replace("/products");
    } else if (updated === "1") {
      toast.success("Бүтээгдэхүүн амжилттай шинэчлэгдлээ");
      router.replace("/products");
    }
  }, [searchParams, router]);

  return null;
}
