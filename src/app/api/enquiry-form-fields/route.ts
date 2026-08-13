import { NextRequest, NextResponse } from "next/server";
import { getEnquiryFieldConfig, saveEnquiryFieldConfig } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await getEnquiryFieldConfig());
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const saved = await saveEnquiryFieldConfig(body);
  return NextResponse.json(saved);
}
