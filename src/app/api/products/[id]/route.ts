import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getProduct, getProductTypes, updateProduct } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { isValidProductType } from "@/lib/product-types";

async function requireAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return !!(await isValidSessionToken(token));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  if (body.productType !== undefined) {
    const productTypes = await getProductTypes();
    if (!isValidProductType(body.productType, productTypes)) {
      return NextResponse.json({ error: "Invalid product type" }, { status: 400 });
    }
  }
  const product = await updateProduct(id, {
    ...body,
    price: body.price !== undefined ? Number(body.price) : undefined,
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
