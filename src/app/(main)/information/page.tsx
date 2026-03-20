import Link from "next/link";
import { getSession, hasPermission } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InformationTable from "@/components/information/InformationTable";
import type { InformationItem } from "@/types";

export default async function InformationPage() {
  const session = await getSession();
  const canEdit = session ? hasPermission(session.role, "editor") : false;

  let items: InformationItem[] = [];
  try {
    const data = await apiGet<{ items: InformationItem[] }>("/information");
    items = data.items;
  } catch {
    items = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Мэдээлэл</h1>
          <p className="text-muted-foreground">
            Он оны зураг болон товч мэдээлэл удирдах ({items.length} мэдээлэл)
          </p>
        </div>

        {canEdit && (
          <Button asChild>
            <Link href="/information/create">
              <Plus className="size-4" />
              Нэмэх
            </Link>
          </Button>
        )}
      </div>

      <InformationTable items={items} canEdit={canEdit} />
    </div>
  );
}
