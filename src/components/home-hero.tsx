"use client";

import { useRouter } from "next/navigation";
import { AnimatedHero } from "@/components/ui/animated-hero-section-1";

export function HomeHero() {
  const router = useRouter();

  return (
    <AnimatedHero
      backgroundImageUrl=""
      logo={null}
      navLinks={[]}
      title="Water Problems? We've Got It Covered."
      description="Stop checking the tank. Stop flipping switches. This Automatic Water Level Controller handles your pump on its own — overflow-proof, dry-run-proof, effortless."
      ctaButton={{
        text: "Get a Quote",
        onClick: () => router.push("/contact"),
      }}
      secondaryCta={{
        text: "Customer Care",
        onClick: () => {
          window.location.href = "tel:+919620239813";
        },
      }}
    />
  );
}
