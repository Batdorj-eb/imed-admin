import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/db";
import { getSession, hasPermission } from "@/lib/auth";
import UserForm from "@/components/users/UserForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const user = getUser(id);
  if (!user) notFound();

  return <UserForm user={user} />;
}
