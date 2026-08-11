"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { X } from "lucide-react";

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDemo, setUploadingDemo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      const payload = { name, description, price: Number(price), images, demoUrl };
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
        <Label htmlFor="images">Product Images</Label>
        <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
        {uploadingImages && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
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

      <div className="space-y-2">
        <Label htmlFor="demo">Demo Page File (optional)</Label>
        <Input id="demo" type="file" onChange={handleDemoUpload} />
        {uploadingDemo && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {demoUrl && (
          <p className="text-sm text-muted-foreground">
            Uploaded: <a href={demoUrl} target="_blank" className="underline">{demoUrl}</a>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Or paste a demo link directly below.
        </p>
        <Input
          placeholder="https://... or /uploads/..."
          value={demoUrl}
          onChange={(e) => setDemoUrl(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
