import { NextRequest, NextResponse } from "next/server";
import { createReview, getProduct, getReviews } from "@/lib/data";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }
  return NextResponse.json(getReviews(productId));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, name, rating, description, images } = body;

  const ratingNum = Number(rating);

  if (!productId || !name || !description || !Number.isInteger(ratingNum)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const review = createReview({
    productId,
    name,
    rating: ratingNum,
    description,
    images: Array.isArray(images) ? images.slice(0, 6) : [],
  });

  return NextResponse.json(review, { status: 201 });
}
