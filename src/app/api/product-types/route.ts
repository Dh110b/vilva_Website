import { NextRequest, NextResponse } from "next/server";
import {
  addProductType,
  countProductsOfType,
  deleteProductType,
  getProductTypes,
  reorderProductTypes,
  updateProductType,
} from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

async function requireAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return !!(await isValidSessionToken(token));
}

export async function GET() {
  return NextResponse.json(await getProductTypes());
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, isExtraEnquiry } = body;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  const types = await addProductType(name, !!isExtraEnquiry);
  return NextResponse.json(types);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  if (Array.isArray(body.reorder)) {
    if (!body.reorder.every((n: unknown) => typeof n === "string")) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const types = await reorderProductTypes(body.reorder);
    return NextResponse.json(types);
  }

  const { oldName, name, isExtraEnquiry } = body;
  if (!oldName || typeof oldName !== "string" || !name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  const types = await updateProductType(oldName, name, !!isExtraEnquiry);
  return NextResponse.json(types);
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name } = body;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  const inUse = await countProductsOfType(name);
  if (inUse > 0) {
    return NextResponse.json(
      { error: `${inUse} product${inUse === 1 ? "" : "s"} still use this type` },
      { status: 400 }
    );
  }
  const types = await deleteProductType(name);
  return NextResponse.json(types);
}
