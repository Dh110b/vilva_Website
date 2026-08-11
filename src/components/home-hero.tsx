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
      title="Quality Products, Built to Last"
      description="Browse our range of products and get in touch — we're here to help you find the right fit."
      ctaButton={{
        text: "View Products",
        onClick: () => router.push("/products"),
      }}
      secondaryCta={{
        text: "Contact Us",
        onClick: () => router.push("/contact"),
      }}
    />
  );
}
