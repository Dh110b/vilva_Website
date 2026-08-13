"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useOptionLists } from "@/hooks/use-option-lists";
import { useEnquiryFieldConfig } from "@/hooks/use-enquiry-field-config";
import { EnquiryFormFields } from "@/components/enquiry-form-fields";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  numberOfTanks: "",
  address: "",
  pincode: "",
  sumpOrBoreCapacity: "",
  motorPhaseType: "",
  motorType: "",
  starterType: "",
  numberOfMotors: "",
  waterSource: "",
  timerType: "",
  unitType: "",
  message: "",
  customFields: {} as Record<string, string>,
};

export function CustomEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { lists: optionLists } = useOptionLists();
  const { config: fieldConfig } = useEnquiryFieldConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "custom", ...form }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      toast.success("Enquiry sent! We'll get back to you soon.");
      setForm(initialForm);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Thanks — request received!</h2>
        <p className="text-muted-foreground mb-4">
          We&apos;ll review your requirements and get back to you shortly.
        </p>
        <Button onClick={() => setSubmitted(false)}>Submit another request</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg border border-foreground/25 bg-white/10 p-6 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            required
            rows={2}
            placeholder="Where should this be installed?"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            required
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="e.g. 560056"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-4 mt-4">
        <div>
          <p className="text-sm font-medium">Motor &amp; Pump Details (optional)</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tell us what you have so we can design a custom controller for it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EnquiryFormFields
            config={fieldConfig}
            form={form}
            setForm={setForm}
            optionLists={optionLists}
          />
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <Label htmlFor="message">Describe Your Custom Requirement</Label>
        <Textarea
          id="message"
          required
          rows={4}
          placeholder="What should this custom water level controller do differently? Special features, panel size, mounting, app/SMS alerts, etc."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <Button type="submit" disabled={submitting} className="mt-4">
        {submitting ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
