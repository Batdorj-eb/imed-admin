import { notFound, redirect } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getSession, hasPermission } from "@/lib/auth";
import InformationItemForm from "@/components/information/InformationItemForm";
import type { InformationItem } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInformationPage({ params }: Props) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    redirect("/information");
  }

  const { id } = await params;

  let items: InformationItem[] = [];
  try {
    const data = await apiGet<{ items: InformationItem[] }>("/information");
    items = data.items;
  } catch {
    notFound();
  }

  const item = items.find((i) => i.id === Number(id));
  if (!item) notFound();

  return <InformationItemForm item={item} />;
}
