import { CustomEnquiryForm } from "@/components/custom-enquiry-form";

export const metadata = {
  title: "Custom Product - Vilva",
};

export default function CustomProductPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Custom Water Level Controller</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Need something our standard products don&apos;t cover? Tell us about your setup and
          requirements, and we&apos;ll design a water level controller tailored to your needs.
        </p>
      </div>

      <CustomEnquiryForm />
    </div>
  );
}
