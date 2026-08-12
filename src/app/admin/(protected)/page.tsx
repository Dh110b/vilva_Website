import Link from "next/link";
import { getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AdminProductBrowser } from "@/components/admin-product-browser";

export default function AdminProductsPage() {
  const products = getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add your first one.</p>
      ) : (
        <AdminProductBrowser products={products} />
      )}
    </div>
  );
}
