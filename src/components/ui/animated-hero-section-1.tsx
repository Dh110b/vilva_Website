"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

interface AnimatedHeroProps {
  backgroundImageUrl: string;
  logo: React.ReactNode;
  navLinks: NavLink[];
  topRightAction?: React.ReactNode;
  title: string;
  description: string;
  ctaButton: {
    text: string;
    onClick: () => void;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const AnimatedHero = ({
  backgroundImageUrl,
  logo,
  navLinks,
  topRightAction,
  title,
  description,
  ctaButton,
  secondaryCta,
  className,
}: AnimatedHeroProps) => {
  const glassButtonClassName = backgroundImageUrl
    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground hover:bg-white/20 transition-colors"
    : "";

  return (
    <div
      className={cn(
        "relative flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden",
        !backgroundImageUrl && "bg-transparent",
        className
      )}
    >
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="absolute inset-0 bg-overlay" />
        </div>
      )}

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "absolute top-0 z-20 flex h-20 w-full items-center justify-between px-6 md:px-12",
          backgroundImageUrl ? "text-white" : "text-foreground"
        )}
      >
        <div className="flex items-center gap-2">{logo}</div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                backgroundImageUrl
                  ? "text-primary-foreground/80 hover:text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">{topRightAction}</div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative z-10 flex flex-col items-start justify-center text-left px-6 md:px-12 max-w-4xl w-full",
          backgroundImageUrl ? "text-white" : "text-foreground"
        )}
      >
        <motion.h1
          variants={itemVariants}
          className={cn(
            "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
            backgroundImageUrl ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {title}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className={cn(
            "mt-6 max-w-2xl text-lg leading-8",
            backgroundImageUrl ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {description}
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center gap-x-4"
        >
          <Button onClick={ctaButton.onClick} size="lg" className={glassButtonClassName}>
            {ctaButton.text}
          </Button>
          {secondaryCta && (
            <Button
              onClick={secondaryCta.onClick}
              size="lg"
              className={glassButtonClassName}
            >
              {secondaryCta.text}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
