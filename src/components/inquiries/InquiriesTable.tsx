"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, X, Building2, Phone, Mail, Package, FileText, Wrench, MessageCircle } from "lucide-react";
import type { ProductInquiry, InquiryType } from "@/types";

interface InquiriesTableProps {
  inquiries: ProductInquiry[];
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const TYPE_LABELS: Record<InquiryType, string> = {
  product: "Бүтээгдэхүүн",
  service: "Үйлчилгээ",
  contact: "Холбоо барих",
};

function normalizeInquiryType(i: ProductInquiry): InquiryType {
  const t = i.inquiry_type as string | undefined;
  if (t === "service" || t === "contact") return t;
  return "product";
}

export default function InquiriesTable({ inquiries }: InquiriesTableProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<ProductInquiry | null>(null);
  const [typeFilter, setTypeFilter] = useState<InquiryType | "all">("all");

  const filteredInquiries = useMemo(() => {
    if (typeFilter === "all") return inquiries;
    return inquiries.filter((i) => normalizeInquiryType(i) === typeFilter);
  }, [inquiries, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", "contact", "product", "service"] as const).map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter(t)}
          >
            {t === "all"
              ? "Бүгд"
              : t === "contact"
                ? "Холбоо барих"
                : t === "product"
                  ? "Бүтээгдэхүүн"
                  : "Үйлчилгээ"}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Төрөл</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead>Нэр / Байгууллага</TableHead>
              <TableHead>Утас</TableHead>
              <TableHead>Бүтээгдэхүүн / Төрөл</TableHead>
              <TableHead className="text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {inquiries.length === 0 ? "Ирсэн хүсэлт байхгүй байна." : "Сонгосон төрлийн бичлэг олдсонгүй."}
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inquiry) => (
                <TableRow
                  key={inquiry.id}
                  className={
                    inquiry.is_read === false
                      ? "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/30"
                      : ""
                  }
                >
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        normalizeInquiryType(inquiry) === "service"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                          : normalizeInquiryType(inquiry) === "contact"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                            : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                      }`}
                    >
                      {normalizeInquiryType(inquiry) === "service" ? (
                        <Wrench className="size-3" />
                      ) : normalizeInquiryType(inquiry) === "contact" ? (
                        <MessageCircle className="size-3" />
                      ) : (
                        <Package className="size-3" />
                      )}
                      {TYPE_LABELS[normalizeInquiryType(inquiry)]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(inquiry.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">{inquiry.organization_name}</TableCell>
                  <TableCell>{inquiry.phone}</TableCell>
                  <TableCell>
                    <span className="font-medium">{inquiry.product_name}</span>
                    {inquiry.brand && (
                      <span className="ml-1 text-xs text-muted-foreground">({inquiry.brand})</span>
                    )}
                    {inquiry.is_read === false && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-teal-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        Шинэ
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="gap-1"
                    >
                      <Eye className="size-4" />
                      Харах
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {normalizeInquiryType(selectedInquiry) === "contact" ? "Санал хүсэлт" : "Үнийн санал"} #
                {selectedInquiry.id}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedInquiry(null)}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Building2 className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">
                    {normalizeInquiryType(selectedInquiry) === "contact" ? "Нэр" : "Байгуулгын нэр"}
                  </p>
                  <p className="font-medium">{selectedInquiry.organization_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Утасны дугаар</p>
                  <p className="font-medium">{selectedInquiry.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Майл хаяг</p>
                  <p className="font-medium">{selectedInquiry.email || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">
                    {normalizeInquiryType(selectedInquiry) === "contact"
                      ? "Төрөл"
                      : selectedInquiry.inquiry_type === "service"
                        ? "Үнийн санал авах үйлчилгээ"
                        : "Үнийн санал авах бүтээгдэхүүн"}
                  </p>
                  <p className="font-medium">{selectedInquiry.product_name}</p>
                  {selectedInquiry.brand && normalizeInquiryType(selectedInquiry) !== "contact" && (
                    <p className="text-xs text-muted-foreground">Брэнд: {selectedInquiry.brand}</p>
                  )}
                </div>
              </div>

              {selectedInquiry.requirements && (
                <div className="flex items-start gap-3">
                  <FileText className="size-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">
                      {normalizeInquiryType(selectedInquiry) === "contact"
                        ? "Нэмэлт мэдээлэл"
                        : selectedInquiry.inquiry_type === "service"
                          ? "Дэлгэрэнгүй тайлбар"
                          : "Нэмэлт шаардлага"}
                    </p>
                    <p className="font-medium whitespace-pre-wrap">{selectedInquiry.requirements}</p>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t text-muted-foreground text-xs">
                Илгээсэн огноо: {formatDate(selectedInquiry.created_at)}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                Хаах
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
