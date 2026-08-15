import Link from "next/link";
import { getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { AdminProductBrowser } from "@/components/admin-product-browser";
import { ManageProductTypesDialog } from "@/components/manage-product-types-dialog";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <ManageProductTypesDialog />
          <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
            Add Product
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add your first one.</p>
      ) : (
        <AdminProductBrowser products={products} />
      )}
    </div>
  );
}
