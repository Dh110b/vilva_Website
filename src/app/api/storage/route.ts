import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { deleteStorageFiles } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (typeof name !== "string" || !name) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  await deleteStorageFiles([name]);
  return NextResponse.json({ ok: true });
}
