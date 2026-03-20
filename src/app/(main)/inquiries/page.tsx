import { apiGet } from "@/lib/api";
import InquiriesTable from "@/components/inquiries/InquiriesTable";
import { InquiryCountRefresher } from "@/components/inquiries/InquiryCountRefresher";
import type { ProductInquiry } from "@/types";

export default async function InquiriesPage() {
  let inquiries: ProductInquiry[] = [];
  try {
    const data = await apiGet<{ inquiries: ProductInquiry[] }>("/inquiries");
    inquiries = data.inquiries;
  } catch {
    inquiries = [];
  }

  return (
    <div className="space-y-6">
      <InquiryCountRefresher />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Үнийн саналууд</h1>
        <p className="text-muted-foreground">
          Хэрэглэгчдээс ирсэн үнийн санал хүсэлтүүд ({inquiries.length} санал)
        </p>
      </div>

      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
