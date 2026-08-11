import Link from "next/link";
import { getProducts } from "@/lib/data";
import { HomeHero } from "@/components/home-hero";
import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function Home() {
  const featuredProducts = getProducts().slice(0, 8);

  return (
    <div className="flex w-full flex-col">
      <HomeHero />

      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="ghost" render={<Link href="/products" />} nativeButton={false}>
              View all <ArrowRightIcon className="size-4 ms-1" />
            </Button>
          </div>

          <ElasticGallery
            items={featuredProducts.map((product) => ({
              id: product.id,
              title: product.name,
              category: `₹${product.price.toLocaleString("en-IN")}`,
              src: product.images[0] ?? "",
              alt: product.name,
              href: `/products/${product.id}`,
            }))}
          />
        </section>
      )}
    </div>
  );
}
