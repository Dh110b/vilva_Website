import { NextRequest, NextResponse } from "next/server";
import { createProduct, getProducts } from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    description,
    price,
    images,
    demoUrl,
    sumpOrBoreCapacity,
    motorPhaseType,
    motorType,
    starterType,
    numberOfMotors,
    waterSource,
    numberOfTanks,
    timerType,
    unitType,
  } = body;

  if (!name || !description || price === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const product = await createProduct({
    name,
    description,
    price: Number(price),
    images: Array.isArray(images) ? images : [],
    demoUrl: demoUrl || undefined,
    sumpOrBoreCapacity: sumpOrBoreCapacity || undefined,
    motorPhaseType: motorPhaseType || undefined,
    motorType: motorType || undefined,
    starterType: starterType || undefined,
    numberOfMotors: numberOfMotors || undefined,
    waterSource: waterSource || undefined,
    numberOfTanks: numberOfTanks || undefined,
    timerType: timerType || undefined,
    unitType: unitType || undefined,
  });

  return NextResponse.json(product, { status: 201 });
}
