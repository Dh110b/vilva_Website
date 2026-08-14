"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useOptionLists } from "@/hooks/use-option-lists";
import { ManageOptionValuesDialog } from "@/components/manage-option-values-dialog";
import { MotorCapacityField } from "@/components/motor-capacity-field";
import { X, Settings } from "lucide-react";

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [demoUrl, setDemoUrl] = useState(product?.demoUrl ?? "");
  const [sumpOrBoreCapacity, setSumpOrBoreCapacity] = useState(product?.sumpOrBoreCapacity ?? "");
  const [motorPhaseType, setMotorPhaseType] = useState(product?.motorPhaseType ?? "");
  const [motorType, setMotorType] = useState(product?.motorType ?? "");
  const [starterType, setStarterType] = useState(product?.starterType ?? "");
  const [numberOfMotors, setNumberOfMotors] = useState(product?.numberOfMotors ?? "");
  const [waterSource, setWaterSource] = useState(product?.waterSource ?? "");
  const [numberOfTanks, setNumberOfTanks] = useState(product?.numberOfTanks ?? "");
  const [timerType, setTimerType] = useState(product?.timerType ?? "");
  const [unitType, setUnitType] = useState(product?.unitType ?? "");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDemo, setUploadingDemo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { lists: optionLists, setLists: setOptionLists } = useOptionLists();

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadFile));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }

  async function handleDemoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDemo(true);
    try {
      const url = await uploadFile(file);
      setDemoUrl(url);
    } catch {
      toast.error("Demo file upload failed");
    } finally {
      setUploadingDemo(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        images,
        demoUrl,
        sumpOrBoreCapacity,
        motorPhaseType,
        motorType,
        starterType,
        numberOfMotors,
        waterSource,
        numberOfTanks,
        timerType,
        unitType,
      };
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg border border-foreground/25 bg-white/10 p-6 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5 space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="demo">Demo Page File (optional)</Label>
          <Input id="demo" type="file" onChange={handleDemoUpload} />
          {uploadingDemo && <p className="text-sm text-muted-foreground">Uploading...</p>}
          {demoUrl && (
            <p className="text-sm text-muted-foreground truncate">
              Uploaded: <a href={demoUrl} target="_blank" className="underline">{demoUrl}</a>
            </p>
          )}
          <Input
            placeholder="Or paste a demo link: https://... or /uploads/..."
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="images">Product Images</Label>
          <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
          {uploadingImages && <p className="text-sm text-muted-foreground">Uploading...</p>}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2 sm:grid-cols-4 lg:grid-cols-6">
              {images.map((img) => (
                <div key={img} className="relative aspect-square bg-muted rounded overflow-hidden group">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((i) => i !== img))}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Motor &amp; Pump Compatibility</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Used as filters on the Products page so customers can find a compatible controller.
            Click the <Settings className="inline size-3" /> icon next to a field to add or remove
            its dropdown options.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="unitType">Unit Type</Label>
            <ManageOptionValuesDialog
              label="Unit Type"
              categories={["timerType", "unitType"]}
              lists={optionLists}
              onListsChange={setOptionLists}
            />
          </div>
          <Select
            value={unitType || timerType}
            onValueChange={(value) => {
              setUnitType(value ?? "");
              setTimerType(value ?? "");
            }}
          >
            <SelectTrigger id="unitType" className="w-full">
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set([...optionLists.timerType, ...optionLists.unitType])).map(
                (opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfTanks">No. of Overhead Tanks Supported</Label>
          <Input
            id="numberOfTanks"
            type="number"
            min="1"
            placeholder="e.g. 2"
            value={numberOfTanks}
            onChange={(e) => setNumberOfTanks(e.target.value)}
          />
        </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="motorPhaseType">Motor Phase Type</Label>
              <ManageOptionValuesDialog
                label="Motor Phase Type"
                categories={["motorPhaseType"]}
                lists={optionLists}
                onListsChange={setOptionLists}
              />
            </div>
            <Select
              value={motorPhaseType}
              onValueChange={(value) => setMotorPhaseType(value ?? "")}
            >
              <SelectTrigger id="motorPhaseType" className="w-full">
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                {optionLists.motorPhaseType.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="starterType">Starter Type</Label>
              <ManageOptionValuesDialog
                label="Starter Type"
                categories={["starterType"]}
                lists={optionLists}
                onListsChange={setOptionLists}
              />
            </div>
            <Select value={starterType} onValueChange={(value) => setStarterType(value ?? "")}>
              <SelectTrigger id="starterType" className="w-full">
                <SelectValue placeholder="Select starter" />
              </SelectTrigger>
              <SelectContent>
                {optionLists.starterType.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="motorType">Motor Type</Label>
              <ManageOptionValuesDialog
                label="Motor Type"
                categories={["motorType"]}
                lists={optionLists}
                onListsChange={setOptionLists}
              />
            </div>
            <Select value={motorType} onValueChange={(value) => setMotorType(value ?? "")}>
              <SelectTrigger id="motorType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {optionLists.motorType.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="waterSource">Water Source</Label>
              <ManageOptionValuesDialog
                label="Water Source"
                categories={["waterSource"]}
                lists={optionLists}
                onListsChange={setOptionLists}
              />
            </div>
            <Select value={waterSource} onValueChange={(value) => setWaterSource(value ?? "")}>
              <SelectTrigger id="waterSource" className="w-full">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {optionLists.waterSource.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        <MotorCapacityField
          idPrefix="sumpOrBoreCapacity"
          waterSource={waterSource}
          value={sumpOrBoreCapacity}
          onChange={setSumpOrBoreCapacity}
        />

        <div className="space-y-2">
          <Label htmlFor="numberOfMotors">No. of Motors Supported</Label>
          <Input
            id="numberOfMotors"
            type="number"
            min="1"
            placeholder="e.g. 2"
            value={numberOfMotors}
            onChange={(e) => setNumberOfMotors(e.target.value)}
          />
        </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={submitting}
          onClick={() => router.push("/admin")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
