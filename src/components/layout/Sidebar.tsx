"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import type { UserSession, Role } from "@/types";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  minRole: Role;
}

const navItems: NavItem[] = [
  { title: "Хянах самбар", url: "/dashboard", icon: LayoutDashboard, minRole: "viewer" },
  { title: "Бүтээгдэхүүн", url: "/products", icon: Package, minRole: "viewer" },
  { title: "Үнийн саналууд", url: "/inquiries", icon: MessageSquareQuote, minRole: "viewer" },
  { title: "Мэдээлэл", url: "/information", icon: FileText, minRole: "viewer" },
  { title: "Хэрэглэгч", url: "/users", icon: Users, minRole: "admin" },
];

const roleHierarchy: Record<Role, number> = { admin: 3, editor: 2, viewer: 1 };

interface SidebarProps {
  user: UserSession;
  inquiryCount?: number;
}

const POLL_INTERVAL_MS = 20_000;

export default function Sidebar({ user, inquiryCount: initialCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [inquiryCount, setInquiryCount] = useState(initialCount);

  useEffect(() => {
    setInquiryCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/inquiry-count", { credentials: "include" });
        if (res.ok) {
          const { count } = await res.json();
          setInquiryCount(count ?? 0);
        }
      } catch {
        // ignore
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const visibleItems = navItems.filter(
    (item) => roleHierarchy[user.role] >= roleHierarchy[item.minRole]
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-full border-r bg-card transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 h-16">
          <div className="flex shrink-0 items-center justify-center size-9 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            iM
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">iMED Admin</span>
              <span className="text-xs text-muted-foreground truncate">Удирдлагын систем</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname.startsWith(item.url);
            const Icon = item.icon;

            const showInquiryBadge = item.url === "/inquiries" && inquiryCount > 0;
            const linkContent = (
              <Link
                href={item.url}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <span className="relative inline-flex">
                  <Icon className="size-4 shrink-0" />
                  {showInquiryBadge && collapsed && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
                      {inquiryCount > 99 ? "99+" : inquiryCount}
                    </span>
                  )}
                </span>
                {!collapsed && <span>{item.title}</span>}
                {showInquiryBadge && !collapsed && (
                  <span
                    className={cn(
                      "ml-auto min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center",
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
                    )}
                  >
                    {inquiryCount > 99 ? "99+" : inquiryCount}
                  </span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.url}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.url}>{linkContent}</div>;
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 w-full text-left hover:bg-accent transition-colors",
                  collapsed && "justify-center px-0"
                )}
              >
                <CircleUser className="size-5 shrink-0 text-muted-foreground" />
                {!collapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate capitalize">{user.role}</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logoutAction()} className="text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Гарах
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full mt-1 text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            {!collapsed && <span className="text-xs">Хураах</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
