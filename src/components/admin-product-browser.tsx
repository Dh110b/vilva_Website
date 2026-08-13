"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useOptionLists } from "@/hooks/use-option-lists";

export function AdminProductBrowser({ products: initial }: { products: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [motorPhaseType, setMotorPhaseType] = useState("any");
  const [starterType, setStarterType] = useState("any");
  const [motorType, setMotorType] = useState("any");
  const [waterSource, setWaterSource] = useState("any");
  const [unitType, setUnitType] = useState("any");
  const [numberOfMotors, setNumberOfMotors] = useState("");
  const [numberOfTanks, setNumberOfTanks] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { lists: optionLists } = useOptionLists();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const minMotors = numberOfMotors ? Number(numberOfMotors) : undefined;
    const minTanks = numberOfTanks ? Number(numberOfTanks) : undefined;

    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (motorPhaseType !== "any" && p.motorPhaseType !== motorPhaseType) return false;
      if (starterType !== "any" && p.starterType !== starterType) return false;
      if (motorType !== "any" && p.motorType !== motorType) return false;
      if (waterSource !== "any" && p.waterSource !== waterSource) return false;
      if (unitType !== "any" && p.unitType !== unitType && p.timerType !== unitType) return false;
      if (minMotors !== undefined && Number(p.numberOfMotors ?? 0) < minMotors) return false;
      if (minTanks !== undefined && Number(p.numberOfTanks ?? 0) < minTanks) return false;
      return true;
    });
  }, [
    products,
    query,
    motorPhaseType,
    starterType,
    motorType,
    waterSource,
    unitType,
    numberOfMotors,
    numberOfTanks,
  ]);

  const hasActiveFilters =
    motorPhaseType !== "any" ||
    starterType !== "any" ||
    motorType !== "any" ||
    waterSource !== "any" ||
    unitType !== "any" ||
    numberOfMotors ||
    numberOfTanks;

  async function removeProduct(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  function clearFilters() {
    setMotorPhaseType("any");
    setStarterType("any");
    setMotorType("any");
    setWaterSource("any");
    setUnitType("any");
    setNumberOfMotors("");
    setNumberOfTanks("");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant={hasActiveFilters ? "default" : "outline"}
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="size-4" /> Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-4 mb-6 rounded-lg border border-border p-4">
          <div className="space-y-2">
            <Label htmlFor="admin-motor-phase">Motor Phase Type</Label>
            <Select value={motorPhaseType} onValueChange={(value) => setMotorPhaseType(value ?? "any")}>
              <SelectTrigger id="admin-motor-phase" className="w-48">
                <SelectValue placeholder="Any phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any phase</SelectItem>
                {optionLists.motorPhaseType.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-starter-type">Starter Type</Label>
            <Select value={starterType} onValueChange={(value) => setStarterType(value ?? "any")}>
              <SelectTrigger id="admin-starter-type" className="w-44">
                <SelectValue placeholder="Any starter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any starter</SelectItem>
                {optionLists.starterType.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-motor-type">Motor Type</Label>
            <Select value={motorType} onValueChange={(value) => setMotorType(value ?? "any")}>
              <SelectTrigger id="admin-motor-type" className="w-48">
                <SelectValue placeholder="Any motor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any motor type</SelectItem>
                {optionLists.motorType.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-water-source">Sump / Bore</Label>
            <Select value={waterSource} onValueChange={(value) => setWaterSource(value ?? "any")}>
              <SelectTrigger id="admin-water-source" className="w-40">
                <SelectValue placeholder="Any source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any source</SelectItem>
                {optionLists.waterSource.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-unit-type">Unit Type</Label>
            <Select value={unitType} onValueChange={(value) => setUnitType(value ?? "any")}>
              <SelectTrigger id="admin-unit-type" className="w-40">
                <SelectValue placeholder="Any unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any unit type</SelectItem>
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
            <Label htmlFor="admin-min-motors">Min. Motors Supported</Label>
            <Input
              id="admin-min-motors"
              type="number"
              min="1"
              placeholder="Any"
              value={numberOfMotors}
              onChange={(e) => setNumberOfMotors(e.target.value)}
              className="w-36"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-min-tanks">Min. Overhead Tanks</Label>
            <Input
              id="admin-min-tanks"
              type="number"
              min="1"
              placeholder="Any"
              value={numberOfTanks}
              onChange={(e) => setNumberOfTanks(e.target.value)}
              className="w-36"
            />
          </div>

          {hasActiveFilters && (
            <Button type="button" variant="ghost" onClick={clearFilters}>
              <X className="size-4" /> Clear filters
            </Button>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No products match your search.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Motor Phase</TableHead>
              <TableHead>Starter</TableHead>
              <TableHead>Motor Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Unit Type</TableHead>
              <TableHead>Motors</TableHead>
              <TableHead>Tanks</TableHead>
              <TableHead>Demo</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <Dialog key={product.id}>
                <DialogTrigger
                  render={<TableRow className="cursor-pointer hover:bg-muted/50" />}
                  nativeButton={false}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>₹{product.price.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{product.motorPhaseType || "-"}</TableCell>
                  <TableCell>{product.starterType || "-"}</TableCell>
                  <TableCell>{product.motorType || "-"}</TableCell>
                  <TableCell>{product.waterSource || "-"}</TableCell>
                  <TableCell>{product.unitType || product.timerType || "-"}</TableCell>
                  <TableCell>{product.numberOfMotors || "-"}</TableCell>
                  <TableCell>{product.numberOfTanks || "-"}</TableCell>
                  <TableCell>{product.demoUrl ? "Yes" : "-"}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    View
                  </TableCell>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                  </DialogHeader>

                  {product.images.length > 0 && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Price</dt>
                      <dd className="font-medium">₹{product.price.toLocaleString("en-IN")}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Demo</dt>
                      <dd className="font-medium">{product.demoUrl ? "Yes" : "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Motor Phase</dt>
                      <dd className="font-medium">{product.motorPhaseType || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Starter Type</dt>
                      <dd className="font-medium">{product.starterType || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Motor Type</dt>
                      <dd className="font-medium">{product.motorType || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Water Source</dt>
                      <dd className="font-medium">{product.waterSource || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Unit Type</dt>
                      <dd className="font-medium">
                        {product.unitType || product.timerType || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">No. of Motors</dt>
                      <dd className="font-medium">{product.numberOfMotors || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">No. of Overhead Tanks</dt>
                      <dd className="font-medium">{product.numberOfTanks || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Sump / Bore Capacity</dt>
                      <dd className="font-medium">{product.sumpOrBoreCapacity || "Not provided"}</dd>
                    </div>
                  </dl>

                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>

                  <DialogFooter className="sm:justify-between">
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={deletingId === product.id}
                      onClick={() => {
                        if (confirm("Delete this product? This cannot be undone.")) {
                          removeProduct(product.id);
                        }
                      }}
                    >
                      {deletingId === product.id ? "Deleting..." : "Delete"}
                    </Button>
                    <div className="flex gap-2">
                      <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
                      <Button
                        render={<Link href={`/admin/products/${product.id}`} />}
                        nativeButton={false}
                      >
                        Edit
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
