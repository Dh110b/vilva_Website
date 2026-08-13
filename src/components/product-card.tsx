import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import type { Product } from "@/lib/data";

export function ProductCard({
  product,
}: {
  product: Product & { avgRating?: number; reviewCount?: number };
}) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden py-0 border-secondary/40 bg-secondary/40 text-foreground shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl dark:border-secondary/40 dark:bg-secondary/30 dark:text-foreground">
        <div className="relative aspect-video border-b border-foreground/25 bg-white/10 backdrop-blur-md dark:border-white/20 dark:bg-white/5">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-foreground">
            <span className="truncate">{product.name}</span>
          </CardTitle>
          {!!product.reviewCount && (
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(product.avgRating ?? 0)} size="sm" />
              <span className="text-xs text-foreground/70">({product.reviewCount})</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="pb-6 bg-transparent">
          <Badge variant="secondary" className="text-base">
            ₹{product.price.toLocaleString("en-IN")}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
