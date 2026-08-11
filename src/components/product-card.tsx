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
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden py-0">
        <div className="relative aspect-video bg-muted">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="truncate">{product.name}</span>
          </CardTitle>
          {!!product.reviewCount && (
            <div className="flex items-center gap-1.5">
              <StarRating value={Math.round(product.avgRating ?? 0)} size="sm" />
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="pb-6">
          <Badge variant="secondary" className="text-base">
            ₹{product.price.toLocaleString("en-IN")}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
