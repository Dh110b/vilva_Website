"use client";

import type React from "react";
import { cn } from "@/lib/utils";

type UnderwaterBackgroundProps = React.ComponentProps<"div">;

// Deterministic pseudo-random bubble field (fixed values so SSR/CSR markup match).
const BUBBLES = [
  { left: 4, size: 6, duration: 14, delay: -2, drift: 18 },
  { left: 11, size: 10, duration: 19, delay: -9, drift: -24 },
  { left: 18, size: 4, duration: 11, delay: -4, drift: 12 },
  { left: 25, size: 14, duration: 23, delay: -14, drift: -16 },
  { left: 32, size: 7, duration: 16, delay: -1, drift: 20 },
  { left: 39, size: 5, duration: 12, delay: -7, drift: -10 },
  { left: 46, size: 12, duration: 21, delay: -11, drift: 26 },
  { left: 53, size: 6, duration: 15, delay: -5, drift: -18 },
  { left: 60, size: 9, duration: 18, delay: -16, drift: 14 },
  { left: 67, size: 4, duration: 10, delay: -3, drift: -12 },
  { left: 74, size: 13, duration: 22, delay: -8, drift: 22 },
  { left: 81, size: 6, duration: 13, delay: -17, drift: -20 },
  { left: 88, size: 8, duration: 17, delay: -6, drift: 16 },
  { left: 95, size: 5, duration: 12, delay: -12, drift: -14 },
  { left: 8, size: 8, duration: 20, delay: -19, drift: 10 },
  { left: 57, size: 10, duration: 24, delay: -21, drift: -22 },
];

export function UnderwaterBackground({ className, ...props }: UnderwaterBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none overflow-hidden", className)}
      {...props}
    >
      {/* Shallow-to-mid water gradient base, tinted from the logo navy/sky palette.
          Kept light enough that default foreground text stays legible over it. */}
      <div
        className="absolute inset-0 dark:opacity-0 transition-opacity"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.03 229) 0%, oklch(0.85 0.07 229) 35%, oklch(0.72 0.1 242) 68%, oklch(0.62 0.12 250) 100%)",
        }}
      />
      <div
        className="absolute inset-0 dark:opacity-100 opacity-0 transition-opacity"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.24 0.06 229) 0%, oklch(0.18 0.05 250) 45%, oklch(0.12 0.04 262) 100%)",
        }}
      />

      {/* Moving caustic light shafts */}
      <div className="absolute inset-0 mix-blend-overlay opacity-40 animate-caustic-drift">
        <div
          className="absolute -inset-1/4"
          style={{
            background:
              "repeating-conic-gradient(from 0deg at 30% 20%, transparent 0deg, rgba(255,255,255,0.35) 8deg, transparent 16deg 40deg), repeating-conic-gradient(from 40deg at 75% 60%, transparent 0deg, rgba(0,160,227,0.3) 6deg, transparent 14deg 46deg)",
          }}
        />
      </div>
      <div className="absolute inset-0 mix-blend-soft-light opacity-30 animate-caustic-drift-slow">
        <div
          className="absolute -inset-1/4"
          style={{
            background:
              "repeating-conic-gradient(from 90deg at 60% 30%, transparent 0deg, rgba(255,255,255,0.3) 5deg, transparent 12deg 34deg)",
          }}
        />
      </div>

      {/* Sunlit surface glow */}
      <div
        className="absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Warm brand-color glimmers (orange / magenta), like distant coral light */}
      <div
        className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "#F39313" }}
      />
      <div
        className="absolute top-1/3 -right-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "#E5097F" }}
      />

      {/* Rising bubbles */}
      <div className="absolute inset-0">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-white/40 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.08),inset_1px_1px_2px_rgba(255,255,255,0.6)] animate-bubble-rise"
            style={
              {
                left: `${b.left}%`,
                width: b.size,
                height: b.size,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
                "--drift": `${b.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Wavy water-surface line near the top */}
      <svg
        className="absolute top-16 left-0 w-[200%] opacity-30 animate-wave-scroll"
        height="24"
        viewBox="0 0 1600 24"
        preserveAspectRatio="none"
      >
        <path
          d="M0 12 Q 50 0 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12 T 700 12 T 800 12 T 900 12 T 1000 12 T 1100 12 T 1200 12 T 1300 12 T 1400 12 T 1500 12 T 1600 12"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
