import { NextRequest, NextResponse } from "next/server";
import { updateEnquiryStatus } from "@/lib/data";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/enquiry-status";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

function isValidStatus(status: unknown): status is EnquiryStatus {
  return typeof status === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(status);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();
  if (!isValidStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const enquiry = updateEnquiryStatus(id, status);
  if (!enquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(enquiry);
}
