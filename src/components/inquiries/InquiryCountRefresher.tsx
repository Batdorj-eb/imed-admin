"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Хуудас нээгдэхэд layout-ийг refresh хийж unread тоог шинэчлэнэ */
export function InquiryCountRefresher() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);
  return null;
}
