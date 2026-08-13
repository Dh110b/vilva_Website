import { NextRequest, NextResponse } from "next/server";
import { addReviewReply } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, message } = body;

  if (!name || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isOwner = !!(await isValidSessionToken(token));

  const reply = await addReviewReply(id, { name, message, isOwner });
  if (!reply) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json(reply, { status: 201 });
}
