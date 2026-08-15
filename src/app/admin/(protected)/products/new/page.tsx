import Link from "next/link";
import { ProductForm } from "@/components/product-form";
import { getProductTypes } from "@/lib/data";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const productTypes = await getProductTypes();
  const selected = productTypes.find((t) => t.name === type);

  if (!selected) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-2">Add Product</h1>
        <p className="text-muted-foreground mb-6">
          Which type of product are you adding? Manage the list of types under{" "}
          <Link href="/admin/settings" className="underline underline-offset-4">
            Settings
          </Link>
          .
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {productTypes.map((t) => (
            <Link
              key={t.name}
              href={`/admin/products/new?type=${encodeURIComponent(t.name)}`}
              className="rounded-lg border border-foreground/25 bg-white/10 p-5 shadow-sm backdrop-blur-md transition-colors hover:border-foreground/50 dark:border-white/20 dark:bg-white/5"
            >
              <p className="font-medium">{t.name}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <ProductForm productType={selected.name} />
    </div>
  );
}
