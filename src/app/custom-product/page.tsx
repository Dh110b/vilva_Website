import type { Metadata } from "next";
import { CustomEnquiryForm } from "@/components/custom-enquiry-form";

export const metadata: Metadata = {
  title: "Custom Water Level Controller",
  description:
    "Need a water level controller tailored to your setup? Tell us your requirements and Vilva will design a custom automatic water level controller for your sump, overhead tank, and motor pump.",
  alternates: { canonical: "/custom-product" },
};

const benefits = [
  {
    title: "Tailored to your setup",
    description:
      "Sump, overhead tank, borewell, or multi-tank — we design around your exact plumbing and motor configuration.",
  },
  {
    title: "Any motor & starter type",
    description:
      "Single or three phase, DOL, star-delta, or VFD — tell us what you run and we'll match the controller to it.",
  },
  {
    title: "Custom alerts & features",
    description:
      "App/SMS notifications, dry-run protection, custom panel sizing, and mounting options built to your requirement.",
  },
  {
    title: "Engineering support",
    description:
      "Our team reviews every request personally and follows up with a design tailored to your site conditions.",
  },
];

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

      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-lg border p-5">
            <h2 className="font-semibold">{b.title}</h2>
            <p className="text-muted-foreground text-sm mt-1">{b.description}</p>
          </div>
        ))}
      </div>

      <CustomEnquiryForm />
    </div>
  );
}
