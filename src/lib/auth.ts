import crypto from "crypto";
import { storeOtpHash, getOtpHash, clearOtp } from "@/lib/data";

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

function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", getSecret()).update(otp).digest("hex");
}

export async function generateAndStoreOtp(): Promise<string> {
  const otp = crypto.randomInt(100000, 1000000).toString();
  await storeOtpHash(hashOtp(otp));
  return otp;
}

export async function verifyOtp(candidate: string): Promise<boolean> {
  const stored = await getOtpHash();
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    await clearOtp();
    return false;
  }
  const candidateHash = hashOtp(candidate);
  const valid =
    candidateHash.length === stored.hash.length &&
    crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(stored.hash));
  if (valid) await clearOtp();
  return valid;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
