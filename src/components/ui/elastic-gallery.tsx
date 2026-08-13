"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface ElasticItemProps {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
  href: string;
}

function ElasticGallery({ items }: { items: ElasticItemProps[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="w-full">
      <div className="mx-auto flex h-[500px] w-full flex-col gap-2 md:h-[600px] md:flex-row md:gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)} // Touch support
            className={cn(
              "relative block cursor-pointer overflow-hidden rounded-2xl border border-foreground/25 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5",
              // Layout & Flex Transition
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              // Flex Logic:
              // If active, take up 4 parts of space. If inactive, take 1 part.
              // This creates the "accordion" effect relative to siblings.
              activeId === item.id ? "flex-[4]" : "flex-[1]",
              // Brightness logic for focus
              activeId === item.id
                ? "brightness-100"
                : "brightness-50 hover:brightness-75"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full">
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-1000",
                    // Subtle zoom on active
                    activeId === item.id ? "scale-100" : "scale-110"
                  )}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                  No image
                </div>
              )}
              {/* Gradient Overlay for Text Readability */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-overlay via-overlay/40 to-transparent transition-opacity duration-500",
                  activeId === item.id ? "opacity-100" : "opacity-0"
                )}
              />
            </div>

            {/* --- Content Container --- */}
            <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-4 md:p-8">
              {/* Active Content: Title & Button */}
              <div
                className={cn(
                  "flex flex-col gap-2 transition-all duration-500",
                  // Hide/Show based on active state with translation for smooth entry
                  activeId === item.id
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-12 opacity-0"
                )}
              >
                {/* Category Tag */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/50 bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md md:px-3 md:text-xs">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black uppercase leading-none text-white md:text-5xl">
                  {item.title}
                </h3>

                {/* Call to Action */}
                <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 md:mt-4 md:text-sm">
                  View Product{" "}
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              </div>

              {/* Inactive Content: Vertical Text (Desktop) / Short Label (Mobile) */}
              <div
                className={cn(
                  "absolute transition-all duration-500",
                  // Position logic
                  "bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
                  // Hide when active
                  activeId === item.id
                    ? "opacity-0 scale-50"
                    : "opacity-100 delay-500"
                )}
              >
                {/* Desktop: Vertical Text */}
                <span className="hidden whitespace-nowrap text-xl font-bold uppercase tracking-widest text-white [writing-mode:vertical-rl] md:block">
                  {item.title}
                </span>

                {/* Mobile: Horizontal ID/Label */}
                <span className="block text-xs font-bold text-white md:hidden">
                  {item.id}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { ElasticGallery };
