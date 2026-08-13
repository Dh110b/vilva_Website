import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { getAdminLoginEvents } from "@/lib/data";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monthsParam = req.nextUrl.searchParams.get("months");
  const months = monthsParam ? Number(monthsParam) : 3;
  const events = await getAdminLoginEvents(Number.isFinite(months) && months > 0 ? months : 3);
  return NextResponse.json(events);
}
