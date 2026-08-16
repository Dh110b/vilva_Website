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
      title={
        <>
          <span className="whitespace-nowrap">Intelligent Automation.</span>
          <br />
          <span className="whitespace-nowrap text-[0.7em]">The Future Of Water Level Management.</span>
        </>
      }
      description="Stop checking the tank. Stop flipping switches. This Automatic Water Level Controller handles your pump on its own — overflow-proof, dry-run-proof, effortless. Proudly indigenous, made in India — and we support custom products tailored to your needs."
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
