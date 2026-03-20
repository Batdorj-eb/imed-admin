import { cookies } from "next/headers";
import type { UserSession, Role } from "@/types";

const SESSION_COOKIE = "imed_admin_session";

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;

  try {
    return JSON.parse(session.value) as UserSession;
  } catch {
    return null;
  }
}

export async function setSession(user: UserSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

const roleHierarchy: Record<Role, number> = {
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
