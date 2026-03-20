import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getCategories, getUsers } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Package, Grid3X3, Users, Star, Sparkles, ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const products = getProducts();
  const categories = getCategories();
  const users = getUsers();

  const featuredCount = products.filter((p) => p.is_featured).length;
  const newCount = products.filter((p) => p.is_new).length;

  const stats = [
    { title: "Нийт бүтээгдэхүүн", value: products.length, desc: "Каталогт бүртгэлтэй", icon: Package, color: "text-blue-600" },
    { title: "Ангилал", value: categories.length, desc: "Бүтээгдэхүүний ангилал", icon: Grid3X3, color: "text-emerald-600" },
    { title: "Онцлох", value: featuredCount, desc: "Онцлох бүтээгдэхүүн", icon: Star, color: "text-amber-600" },
    { title: "Шинэ", value: newCount, desc: "Шинэ бүтээгдэхүүн", icon: Sparkles, color: "text-purple-600" },
  ];

  const categoryBreakdown = categories
    .map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category_id === cat.id).length,
    }))
    .filter((cat) => cat.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Хянах самбар</h1>
        <p className="text-muted-foreground">
          Тавтай морил, {session?.name}. Каталогийн ерөнхий мэдээлэл.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`size-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ангилал тус бүрийн бүтээгдэхүүн</CardTitle>
            <CardDescription>Ангилал дахь бүтээгдэхүүний тоо</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Бүтээгдэхүүн бүртгэгдээгүй байна. Эхлээд бүтээгдэхүүн нэмнэ үү.
              </p>
            ) : (
              <div className="space-y-3">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <span className="text-sm">{cat.nameEn}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-primary/20 rounded-full w-24">
                        <div
                          className="h-2 bg-primary rounded-full transition-all"
                          style={{ width: `${Math.max((cat.count / Math.max(products.length, 1)) * 100, 4)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{cat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {session?.role === "admin" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Хэрэглэгчийн мэдээлэл</CardTitle>
              <CardDescription>Системийн хэрэглэгчид</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-sm">Нийт хэрэглэгч</span>
                  </div>
                  <span className="text-sm font-medium">{users.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <span className="text-sm">Идэвхтэй</span>
                  </div>
                  <span className="text-sm font-medium">{users.filter((u) => u.isActive).length}</span>
                </div>
                {(["admin", "editor", "viewer"] as const).map((role) => {
                  const count = users.filter((u) => u.role === role).length;
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm capitalize pl-6">{role}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
