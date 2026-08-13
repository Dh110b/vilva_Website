"use client";

import * as React from "react";
import { ChevronRight, ChevronLeft, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewList, ReviewSummary } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import type { Review } from "@/lib/data";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  demoUrl?: string;
}

export interface ProductDetailPageProps {
  product: Product;
  reviews: Review[];
  isAuthed?: boolean;
  breadcrumbs: BreadcrumbItem[];
  enquiryAction: React.ReactNode;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  reviews,
  isAuthed = false,
  breadcrumbs,
  enquiryAction,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showDemo, setShowDemo] = React.useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = React.useState(false);
  const hasImages = product.images.length > 0;
  const hasMultipleImages = product.images.length > 1;
  const descriptionLimit = 300;
  const isDescriptionLong = product.description.length > descriptionLimit;

  const goToPrevImage = () =>
    setCurrentImageIndex((i) => (i - 1 + product.images.length) % product.images.length);
  const goToNextImage = () =>
    setCurrentImageIndex((i) => (i + 1) % product.images.length);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground mb-6">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
            {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
          </React.Fragment>
        ))}
      </nav>

      {/* Main content grid */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery Section */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-foreground/25 bg-white/10 backdrop-blur-md shadow-lg dark:border-white/20 dark:bg-white/5"
            >
              {hasImages ? (
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} image ${currentImageIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={goToPrevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 border shadow-sm hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 border shadow-sm hover:bg-background transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {hasMultipleImages && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={img + index}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 bg-white/10 backdrop-blur-md dark:bg-white/5 transition-colors",
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  <Image src={img} alt="" fill sizes="20vw" className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-2">
            <ReviewSummary reviews={reviews} />
          </div>
          <div className="mt-2">
            <span className="text-4xl font-bold">₹{product.price.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex flex-wrap gap-3 my-6">
            {enquiryAction}
            {product.demoUrl && (
              <Button variant="outline" size="lg" onClick={() => setShowDemo((v) => !v)}>
                <PlayCircle className="h-5 w-5" /> {showDemo ? "Hide Demo" : "View Demo"}
              </Button>
            )}
          </div>

          {product.demoUrl && (
            <Badge variant="secondary" className="w-fit mb-6">
              Demo available
            </Badge>
          )}

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {isDescriptionLong && !descriptionExpanded
              ? `${product.description.slice(0, descriptionLimit).trimEnd()}…`
              : product.description}
          </p>
          {isDescriptionLong && (
            <button
              onClick={() => setDescriptionExpanded((v) => !v)}
              className="mt-1 w-fit text-sm font-medium text-primary hover:underline"
            >
              {descriptionExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </main>

      {/* Inline Demo Preview */}
      {product.demoUrl && showDemo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Demo</h2>
            <Link
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Open in new tab
            </Link>
          </div>
          <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-muted">
            <iframe
              src={product.demoUrl}
              title={`${product.name} demo`}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </motion.div>
      )}

      {/* Reviews */}
      <div className="mt-12 max-w-3xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Reviews</h2>
            <ReviewSummary reviews={reviews} />
          </div>
          <ReviewForm productId={product.id} />
        </div>
        <ReviewList reviews={reviews} isAuthed={isAuthed} />
      </div>
    </div>
  );
};
