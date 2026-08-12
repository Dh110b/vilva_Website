import crypto from "crypto";
import fs from "fs";
import path from "path";

const COOKIE_NAME = "vilva_admin_session";
const otpFile = path.join(process.cwd(), "data", "otp.json");
const OTP_TTL_MS = 5 * 60 * 1000;

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

export function generateAndStoreOtp(): string {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const dataDir = path.dirname(otpFile);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    otpFile,
    JSON.stringify({ hash: hashOtp(otp), expiresAt: Date.now() + OTP_TTL_MS }),
    "utf-8"
  );
  return otp;
}

export function verifyOtp(candidate: string): boolean {
  if (!fs.existsSync(otpFile)) return false;
  try {
    const { hash, expiresAt } = JSON.parse(fs.readFileSync(otpFile, "utf-8"));
    if (Date.now() > expiresAt) {
      fs.unlinkSync(otpFile);
      return false;
    }
    const candidateHash = hashOtp(candidate);
    const valid =
      candidateHash.length === hash.length &&
      crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(hash));
    if (valid) fs.unlinkSync(otpFile);
    return valid;
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
