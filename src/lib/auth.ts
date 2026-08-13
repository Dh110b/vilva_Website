import crypto from "crypto";
import {
  storeOtpHash,
  getOtpHash,
  clearOtp,
  getAdminPasswordHash,
  setAdminPasswordHash,
  createAdminSession,
  getAdminSessionByTokenHash,
  touchAdminSession,
  type AdminSession,
} from "@/lib/data";
import { hashPassword, verifyPassword } from "@/lib/password";

const COOKIE_NAME = "vilva_admin_session";
const SESSION_TTL_MS = 60 * 60 * 24 * 7 * 1000;

function getSecret() {
  return process.env.ADMIN_PASSWORD || "change-me";
}

function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSessionToken(meta: {
  ip: string | null;
  userAgent: string | null;
}): Promise<{ token: string; sessionId: string }> {
  const token = crypto.randomBytes(32).toString("base64url");
  const sessionId = await createAdminSession({
    tokenHash: hashSessionToken(token),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return { token, sessionId };
}

export async function isValidSessionToken(
  token: string | undefined
): Promise<AdminSession | undefined> {
  if (!token) return undefined;
  const session = await getAdminSessionByTokenHash(hashSessionToken(token));
  if (session) await touchAdminSession(session.id);
  return session;
}

export async function checkPassword(password: string): Promise<boolean> {
  const hash = await getAdminPasswordHash();
  if (!hash) return false;
  return verifyPassword(password, hash);
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!(await checkPassword(currentPassword))) {
    return { ok: false, error: "Current password is incorrect" };
  }
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters" };
  }
  await setAdminPasswordHash(hashPassword(newPassword));
  return { ok: true };
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
