import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkPassword, generateAndStoreOtp } from "@/lib/auth";
import { sendAdminOtpEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!checkPassword(password)) {
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
