"use client";

import type React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type GradientBackgroundProps = React.ComponentProps<"div"> & {
  // Animation customization
  gradients?: string[];
  animationDuration?: number;
  animationDelay?: number;

  // Layout customization
  enableCenterContent?: boolean;

  // Visual customization
  overlay?: boolean;
  overlayOpacity?: number;
};

const Default_Gradients = [
  "linear-gradient(135deg, #eef3fc 0%, #dcebfa 100%)",
  "linear-gradient(135deg, #fbeaf3 0%, #fdf1e6 100%)",
  "linear-gradient(135deg, #e6eefc 0%, #eaf7fb 100%)",
  "linear-gradient(135deg, #fdf1e6 0%, #fbeaf3 100%)",
  "linear-gradient(135deg, #eef3fc 0%, #dcebfa 100%)",
];

export function GradientBackground({
  children,
  className = "",
  gradients = Default_Gradients,
  animationDuration = 8,
  animationDelay = 0.5,
  overlay = false,
  overlayOpacity = 0.3,
}: GradientBackgroundProps) {
  return (
    <div className={cn("w-full relative min-h-screen overflow-hidden", className)}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{ background: gradients[0] }}
        animate={{ background: gradients }}
        transition={{
          delay: animationDelay,
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Optional overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
      )}

      {/* Content wrapper */}
      {children && (
        <div className={cn("relative z-10 flex min-h-screen items-center justify-center")}>
          {children}
        </div>
      )}
    </div>
  );
}
