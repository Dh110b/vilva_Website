import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionToken, verifyOtp } from "@/lib/auth";
import { logAdminLoginEvent } from "@/lib/data";
import { getClientIp, getUserAgent } from "@/lib/request-meta";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();
  const ip = getClientIp(req);
  const userAgent = getUserAgent(req);
  const valid = !!otp && (await verifyOtp(otp));
  await logAdminLoginEvent({
    eventType: valid ? "otp_success" : "otp_failure",
    success: valid,
    ip,
    userAgent,
  }).catch(() => {});
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const { token } = await createSessionToken({ ip, userAgent });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
