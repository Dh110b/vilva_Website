import { BrandMark } from "@/lib/brand-mark";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export function OgBanner() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f2942 0%, #1b4e9b 55%, #00a0e3 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 160,
          height: 160,
          borderRadius: 32,
          background: "#ffffff",
          marginBottom: 40,
        }}
      >
        <BrandMark width={110} />
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        VILVA
      </div>
      <div
        style={{
          fontSize: 34,
          color: "#cfe8ff",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        Automatic Water Level Controllers
      </div>
    </div>
  );
}
