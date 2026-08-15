import Link from "next/link";
import { getEnquiryFieldConfig, getProductTypes } from "@/lib/data";
import { AdminEnquiryFormGate } from "@/components/admin-enquiry-form-gate";
import { AdminEnquiryTypePicker } from "@/components/admin-enquiry-type-picker";

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
        <AdminEnquiryTypePicker types={productTypes} />
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
      <div className="mb-4" />
      <AdminEnquiryFormGate
        key={selected.name}
        productType={selected.name}
        initialIsExtraEnquiry={selected.isExtraEnquiry}
        initialTitle={config.title}
        initialConfig={config.fields}
      />
    </div>
  );
}
