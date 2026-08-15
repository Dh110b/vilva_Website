import type { Metadata } from "next";
import Link from "next/link";
import { CustomEnquiryForm } from "@/components/custom-enquiry-form";
import { getProductTypes } from "@/lib/data";

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

export default async function CustomProductPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const productTypes = await getProductTypes();
  const selected = productTypes.find((t) => t.name === type);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Custom Product Request</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Need something our standard products don&apos;t cover? Tell us about your setup and
          requirements, and we&apos;ll design a product tailored to your needs.
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

      {!selected ? (
        <div>
          <p className="text-muted-foreground mb-4">Which type of product do you need?</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {productTypes.map((t) => (
              <Link
                key={t.name}
                href={`/custom-product?type=${encodeURIComponent(t.name)}`}
                className="rounded-lg border border-foreground/25 bg-white/10 p-5 shadow-sm backdrop-blur-md transition-colors hover:border-foreground/50 dark:border-white/20 dark:bg-white/5"
              >
                <p className="font-medium">{t.name}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <CustomEnquiryForm productType={selected.name} isExtraEnquiry={selected.isExtraEnquiry} />
      )}
    </div>
  );
}
