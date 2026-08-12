"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
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
import { DeleteProductButton } from "@/components/delete-product-button";
import type { Product } from "@/lib/data";
import { useOptionLists } from "@/hooks/use-option-lists";

export function AdminProductBrowser({ products }: { products: Product[] }) {
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
              <TableRow key={product.id}>
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
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/products/${product.id}`} />}
                    nativeButton={false}
                  >
                    Edit
                  </Button>
                  <DeleteProductButton id={product.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
