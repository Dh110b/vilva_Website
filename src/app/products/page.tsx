import type { Metadata } from "next";
import { getProducts, getProductRatings } from "@/lib/data";
import { ProductBrowser } from "@/components/product-browser";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Vilva's range of MicroComputer Automatic Water Level Controllers for sump and overhead tanks — single & three phase compatible, submersible & monoblock pump compatible.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  const ratings = await getProductRatings();
  const productsWithRating = products.map((product) => ({
    ...product,
    avgRating: ratings[product.id]?.average ?? 0,
    reviewCount: ratings[product.id]?.count ?? 0,
  }));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="text-muted-foreground mt-1">
          Browse our products and send an enquiry to purchase.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products available yet. Check back soon.</p>
      ) : (
        <ProductBrowser products={productsWithRating} />
      )}
    </div>
  );
}
