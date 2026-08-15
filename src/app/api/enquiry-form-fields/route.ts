import { NextRequest, NextResponse } from "next/server";
import { getEnquiryFieldConfig, saveEnquiryFieldConfig } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const productType = req.nextUrl.searchParams.get("type");
  if (!productType) {
    return NextResponse.json({ error: "Missing product type" }, { status: 400 });
  }
  return NextResponse.json(await getEnquiryFieldConfig(productType));
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const productType = req.nextUrl.searchParams.get("type");
  if (!productType) {
    return NextResponse.json({ error: "Missing product type" }, { status: 400 });
  }
  const body = await req.json();
  if (!body || typeof body.title !== "string" || !Array.isArray(body.fields)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const saved = await saveEnquiryFieldConfig(productType, body.title, body.fields);
  return NextResponse.json(saved);
}
