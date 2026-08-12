import { getEnquiryFieldConfig } from "@/lib/data";
import { AdminEnquiryFieldBuilder } from "@/components/admin-enquiry-field-builder";

export default async function AdminEnquiryFormPage() {
  const config = await getEnquiryFieldConfig();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Send Enquiry Form</h1>
      <AdminEnquiryFieldBuilder initialConfig={config} />
    </div>
  );
}
