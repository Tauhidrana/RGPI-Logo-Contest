import "server-only";
import { redirect } from "next/navigation";
import { getAuthUser, type AuthUser } from "./auth";
import type { Role } from "./types";

export async function guardPage(role: Role): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user || user.role !== role || !user.is_active) redirect("/admin/login");
  return user;
}
