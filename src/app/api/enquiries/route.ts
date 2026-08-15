import { NextRequest, NextResponse } from "next/server";
import { createEnquiry, getEnquiries, getProduct } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { sendEnquiryEmail } from "@/lib/mail";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getEnquiries());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    productId,
    productType,
    name,
    email,
    phone,
    numberOfTanks,
    address,
    pincode,
    sumpOrBoreCapacity,
    motorPhaseType,
    motorType,
    starterType,
    numberOfMotors,
    waterSource,
    timerType,
    unitType,
    message,
    customFields,
  } = body;

  if (!productId || !name || !email || !phone || !address || !pincode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isCustom = productId === "custom";
  const product = isCustom ? undefined : await getProduct(productId);
  if (!isCustom && !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const enquiry = await createEnquiry({
    productId,
    productName: isCustom
      ? `Custom ${typeof productType === "string" && productType.trim() ? productType : "Product"}`
      : product!.name,
    name,
    email,
    phone,
    numberOfTanks,
    address,
    pincode,
    sumpOrBoreCapacity,
    motorPhaseType,
    motorType,
    starterType,
    numberOfMotors,
    waterSource,
    timerType,
    unitType,
    message,
    customFields:
      customFields && typeof customFields === "object" ? customFields : undefined,
  });

  await sendEnquiryEmail(enquiry);

  return NextResponse.json(enquiry, { status: 201 });
}
