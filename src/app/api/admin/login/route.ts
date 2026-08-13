import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkPassword, generateAndStoreOtp } from "@/lib/auth";
import { sendAdminOtpEmail } from "@/lib/mail";
import { logAdminLoginEvent } from "@/lib/data";
import { getClientIp, getUserAgent } from "@/lib/request-meta";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const ip = getClientIp(req);
  const userAgent = getUserAgent(req);
  const valid = await checkPassword(password);
  await logAdminLoginEvent({
    eventType: valid ? "password_success" : "password_failure",
    success: valid,
    ip,
    userAgent,
  }).catch(() => {});
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const otp = await generateAndStoreOtp();
  await sendAdminOtpEmail(otp);
  return NextResponse.json({ ok: true, otpRequired: true });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
