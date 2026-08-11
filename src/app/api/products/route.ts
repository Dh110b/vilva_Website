import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, images, demoUrl } = body;

  if (!name || !description || price === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = createProduct({
    name,
    description,
    price: Number(price),
    images: Array.isArray(images) ? images : [],
    demoUrl: demoUrl || undefined,
  });

  return NextResponse.json(product, { status: 201 });
}
