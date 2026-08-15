import Link from "next/link";
import { getEnquiryFieldConfig, getProductTypes } from "@/lib/data";
import { AdminEnquiryFieldBuilder } from "@/components/admin-enquiry-field-builder";

export default async function AdminEnquiryFormPage({
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
        <h1 className="text-2xl font-bold mb-2">Send Enquiry Form</h1>
        <p className="text-muted-foreground mb-6">
          Which product type do you want to customize the Send Enquiry form for?
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {productTypes.map((t) => (
            <Link
              key={t.name}
              href={`/admin/enquiry-form?type=${encodeURIComponent(t.name)}`}
              className="rounded-lg border border-foreground/25 bg-white/10 p-5 shadow-sm backdrop-blur-md transition-colors hover:border-foreground/50 dark:border-white/20 dark:bg-white/5"
            >
              <p className="font-medium">{t.name}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const config = await getEnquiryFieldConfig(selected.name);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Send Enquiry Form — {selected.name}</h1>
        <Link href="/admin/enquiry-form" className="text-sm underline underline-offset-4">
          Switch product type
        </Link>
      </div>
      {!selected.isExtraEnquiry ? (
        <p className="text-sm text-warning-foreground mb-6">
          Extra Enquiry is off for this product type, so this section won&apos;t appear on the
          site yet. Turn it on from the Product Types manager next to Add Product.
        </p>
      ) : (
        <div className="mb-4" />
      )}
      <AdminEnquiryFieldBuilder
        key={selected.name}
        productType={selected.name}
        initialTitle={config.title}
        initialConfig={config.fields}
      />
    </div>
  );
}
