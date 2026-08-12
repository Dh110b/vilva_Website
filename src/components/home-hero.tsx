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
      title="Never Worry About Water Again"
      description="The MicroComputer Automatic Water Level Controller that saves your time, water, electricity — and your motor pump."
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
