import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  let inquiryCount = 0;
  try {
    const data = await apiGet<{ count: number }>("/inquiries/count");
    inquiryCount = data.count ?? 0;
  } catch {
    inquiryCount = 0;
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={session} inquiryCount={inquiryCount} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
