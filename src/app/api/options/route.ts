import { NextRequest, NextResponse } from "next/server";
import { addOption, deleteOption, getOptionLists, setOptionList } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { OPTION_CATEGORIES, type OptionCategory } from "@/lib/motor-options";

function requireAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

function isValidCategory(category: unknown): category is OptionCategory {
  return typeof category === "string" && category in OPTION_CATEGORIES;
}

export async function GET() {
  return NextResponse.json(getOptionLists());
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { category, value } = body;
  if (!isValidCategory(category) || !value || typeof value !== "string") {
    return NextResponse.json({ error: "Invalid category or value" }, { status: 400 });
  }
  const lists = addOption(category, value);
  return NextResponse.json(lists);
}

export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { category, values } = body;
  if (!isValidCategory(category) || !Array.isArray(values)) {
    return NextResponse.json({ error: "Invalid category or values" }, { status: 400 });
  }
  const lists = setOptionList(category, values);
  return NextResponse.json(lists);
}

export async function DELETE(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { category, value } = body;
  if (!isValidCategory(category) || !value || typeof value !== "string") {
    return NextResponse.json({ error: "Invalid category or value" }, { status: 400 });
  }
  const lists = deleteOption(category, value);
  return NextResponse.json(lists);
}
