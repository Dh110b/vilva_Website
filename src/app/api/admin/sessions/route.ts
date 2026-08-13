import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { listActiveAdminSessions, revokeAdminSession } from "@/lib/data";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await isValidSessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await listActiveAdminSessions();
  return NextResponse.json(
    sessions.map((s) => ({ ...s, isCurrent: s.id === session.id }))
  );
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await isValidSessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await req.json();
  if (typeof sessionId !== "string") {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  await revokeAdminSession(sessionId);

  const res = NextResponse.json({ ok: true });
  if (sessionId === session.id) {
    res.cookies.delete(ADMIN_COOKIE_NAME);
  }
  return res;
}
