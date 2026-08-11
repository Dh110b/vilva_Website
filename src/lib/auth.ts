import crypto from "crypto";

const COOKIE_NAME = "vilva_admin_session";

function getSecret() {
  return process.env.ADMIN_PASSWORD || "change-me";
}

export function createSessionToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [prefix, ts, sig] = decoded.split(":");
    const payload = `${prefix}:${ts}`;
    const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD || "change-me");
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
