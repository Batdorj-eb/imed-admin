import { NextResponse } from "next/server";
import { apiGet } from "@/lib/api";

export async function GET() {
  try {
    const data = await apiGet<{ count: number }>("/inquiries/count");
    return NextResponse.json({ count: data.count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
