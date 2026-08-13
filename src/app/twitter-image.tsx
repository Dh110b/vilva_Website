import { ImageResponse } from "next/og";
import { OgBanner, OG_IMAGE_SIZE } from "@/lib/og-banner";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<OgBanner />, { ...size });
}
