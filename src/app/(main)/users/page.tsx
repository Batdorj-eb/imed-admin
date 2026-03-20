import Link from "next/link";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/db";
import { getSession, hasPermission } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UsersTable from "@/components/users/UsersTable";

export default async function UsersPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "admin")) {
    redirect("/dashboard");
  }

  const users = getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Хэрэглэгч</h1>
          <p className="text-muted-foreground">
            Хэрэглэгчийн бүртгэл, эрх удирдах ({users.length} хэрэглэгч)
          </p>
        </div>
        <Button asChild>
          <Link href="/users/create">
            <Plus className="size-4" />
            Нэмэх
          </Link>
        </Button>
      </div>

      <UsersTable users={users} currentUserId={session.id} />
    </div>
  );
}
