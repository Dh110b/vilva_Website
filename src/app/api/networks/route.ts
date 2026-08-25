import { NextRequest, NextResponse } from "next/server";
import {
  addNetwork,
  deleteNetwork,
  getNetworks,
  reorderNetworks,
  updateNetwork,
} from "@/lib/data";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

async function requireAuth(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return !!(await isValidSessionToken(token));
}

export async function GET() {
  return NextResponse.json(await getNetworks());
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { area, name, address } = body;
  if (!area || typeof area !== "string" || !name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid network" }, { status: 400 });
  }
  const networks = await addNetwork({
    area,
    name,
    address: typeof address === "string" ? address : "",
  });
  return NextResponse.json(networks);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  if (Array.isArray(body.reorder)) {
    if (!body.reorder.every((id: unknown) => typeof id === "string")) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }
    const networks = await reorderNetworks(body.reorder);
    return NextResponse.json(networks);
  }

  const { id, area, name, address } = body;
  if (!id || typeof id !== "string" || !area || typeof area !== "string" || !name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid network" }, { status: 400 });
  }
  const networks = await updateNetwork(id, {
    area,
    name,
    address: typeof address === "string" ? address : "",
  });
  return NextResponse.json(networks);
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const networks = await deleteNetwork(id);
  return NextResponse.json(networks);
}
