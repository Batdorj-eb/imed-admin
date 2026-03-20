import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import InformationItemForm from "@/components/information/InformationItemForm";

export default async function CreateInformationPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "editor")) {
    redirect("/information");
  }

  return <InformationItemForm />;
}
