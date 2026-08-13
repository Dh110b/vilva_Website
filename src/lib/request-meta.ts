import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

export function getUserAgent(req: NextRequest): string | null {
  return req.headers.get("user-agent");
}
