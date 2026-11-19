import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({ user: await getAuthUser() });
}
