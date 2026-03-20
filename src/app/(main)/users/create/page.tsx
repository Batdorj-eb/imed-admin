import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import UserForm from "@/components/users/UserForm";

export default async function CreateUserPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    redirect("/dashboard");
  }

  return <UserForm />;
}
