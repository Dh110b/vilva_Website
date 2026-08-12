import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionToken, verifyOtp } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();
  if (!otp || !verifyOtp(otp)) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
