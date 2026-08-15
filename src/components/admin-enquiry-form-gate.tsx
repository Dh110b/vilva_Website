"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AdminEnquiryFieldBuilder } from "@/components/admin-enquiry-field-builder";
import type { EnquiryFieldConfig } from "@/lib/enquiry-form-fields";

export function AdminEnquiryFormGate({
  productType,
  initialIsExtraEnquiry,
  initialTitle,
  initialConfig,
}: {
  productType: string;
  initialIsExtraEnquiry: boolean;
  initialTitle: string;
  initialConfig: EnquiryFieldConfig[];
}) {
  const router = useRouter();
  const [isExtraEnquiry, setIsExtraEnquiry] = useState(initialIsExtraEnquiry);
  const [enabling, setEnabling] = useState(false);

  async function enableExtraEnquiry() {
    setEnabling(true);
    try {
      const res = await fetch("/api/product-types", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: productType,
          name: productType,
          isExtraEnquiry: true,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setIsExtraEnquiry(true);
      toast.success("Extra Enquiry turned on");
    } catch {
      toast.error("Failed to turn on Extra Enquiry");
    } finally {
      setEnabling(false);
    }
  }

  if (isExtraEnquiry) {
    return (
      <AdminEnquiryFieldBuilder
        productType={productType}
        initialTitle={initialTitle}
        initialConfig={initialConfig}
      />
    );
  }

  return (
    <div className="max-w-2xl rounded-lg border p-6 space-y-3">
      <p className="text-sm font-medium">Add Extra Enquiry to {productType}?</p>
      <p className="text-sm text-muted-foreground">
        Extra Enquiry isn&apos;t active for this product type, so its Send Enquiry form only has
        the standard fields right now. Turn it on to build a custom set of extra fields (motor
        &amp; pump details, or anything else) for this type&apos;s enquiry popup and Custom
        Product form.
      </p>
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={enabling} onClick={enableExtraEnquiry}>
          {enabling ? "Turning on..." : "Yes, add Extra Enquiry"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => router.push("/admin/enquiry-form")}
        >
          No, leave it off
        </Button>
      </div>
    </div>
  );
}
