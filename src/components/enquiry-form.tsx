"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
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
};

export function EnquiryForm({ productId, productName }: { productId: string; productName: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        body: JSON.stringify({ productId, ...form }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      toast.success("Enquiry sent! We'll get back to you soon.");
      setForm(initialForm);
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" />}>Send Enquiry</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-foreground/25 bg-white/80 backdrop-blur-md dark:border-white/20 dark:bg-white/80">
        <DialogHeader>
          <DialogTitle>Enquire about {productName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
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

          <div className="space-y-3 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Motor &amp; Pump Details (optional)</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Don&apos;t know these details?{" "}
                <Link href="/contact" className="underline underline-offset-4" target="_blank">
                  Contact us
                </Link>{" "}
                and we&apos;ll help you figure it out.
              </p>
            </div>

            <EnquiryFormFields
              config={fieldConfig}
              form={form}
              setForm={setForm}
              optionLists={optionLists}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Requirements (optional)</Label>
            <Textarea
              id="message"
              rows={3}
              placeholder="Tank capacity, existing wiring, preferred installation date, etc."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Enquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
