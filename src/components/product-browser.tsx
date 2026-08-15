"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/data";
import { useOptionLists } from "@/hooks/use-option-lists";
import { useProductTypes } from "@/hooks/use-product-types";

export type ProductWithRating = Product & { avgRating: number; reviewCount: number };

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "rating-desc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "rating-desc", label: "Highest Rated" },
];

const ratingOptions = [
  { value: "0", label: "Any rating" },
  { value: "4", label: "4 stars & up" },
  { value: "3", label: "3 stars & up" },
];


export function ProductBrowser({
  products,
  initialProductType,
}: {
  products: ProductWithRating[];
  initialProductType?: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [productType, setProductType] = useState(initialProductType || "any");
  const [motorPhaseType, setMotorPhaseType] = useState("any");
  const [starterType, setStarterType] = useState("any");
  const [motorType, setMotorType] = useState("any");
  const [waterSource, setWaterSource] = useState("any");
  const [unitType, setUnitType] = useState("any");
  const [numberOfMotors, setNumberOfMotors] = useState("");
  const [numberOfTanks, setNumberOfTanks] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { lists: optionLists } = useOptionLists();
  const { types: productTypes } = useProductTypes();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    const minRatingNum = Number(minRating);
    const minMotors = numberOfMotors ? Number(numberOfMotors) : undefined;
    const minTanks = numberOfTanks ? Number(numberOfTanks) : undefined;

    let result = products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
      if (min !== undefined && p.price < min) return false;
      if (max !== undefined && p.price > max) return false;
      if (minRatingNum > 0 && p.avgRating < minRatingNum) return false;
      if (productType !== "any" && p.productType !== productType) return false;
      if (motorPhaseType !== "any" && p.motorPhaseType !== motorPhaseType) return false;
      if (starterType !== "any" && p.starterType !== starterType) return false;
      if (motorType !== "any" && p.motorType !== motorType) return false;
      if (waterSource !== "any" && p.waterSource !== waterSource) return false;
      if (unitType !== "any" && p.unitType !== unitType && p.timerType !== unitType) return false;
      if (minMotors !== undefined && Number(p.numberOfMotors ?? 0) < minMotors) return false;
      if (minTanks !== undefined && Number(p.numberOfTanks ?? 0) < minTanks) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "rating-desc":
          return b.avgRating - a.avgRating;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [
    products,
    query,
    sort,
    minPrice,
    maxPrice,
    minRating,
    productType,
    motorPhaseType,
    starterType,
    motorType,
    waterSource,
    unitType,
    numberOfMotors,
    numberOfTanks,
  ]);

  const hasActiveFilters =
    minPrice ||
    maxPrice ||
    minRating !== "0" ||
    productType !== "any" ||
    motorPhaseType !== "any" ||
    starterType !== "any" ||
    motorType !== "any" ||
    waterSource !== "any" ||
    unitType !== "any" ||
    numberOfMotors ||
    numberOfTanks;

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("0");
    setProductType("any");
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sort} onValueChange={(value) => setSort((value as SortOption) ?? "newest")}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            <Label htmlFor="min-price">Min Price</Label>
            <Input
              id="min-price"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-32"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-price">Max Price</Label>
            <Input
              id="max-price"
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-32"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-rating">Rating</Label>
            <Select value={minRating} onValueChange={(value) => setMinRating(value ?? "0")}>
              <SelectTrigger id="min-rating" className="w-44">
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-type">Product Type</Label>
            <Select value={productType} onValueChange={(value) => setProductType(value ?? "any")}>
              <SelectTrigger id="product-type" className="w-52">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                {productTypes.map((t) => (
                  <SelectItem key={t.name} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motor-phase">Motor Phase Type</Label>
            <Select value={motorPhaseType} onValueChange={(value) => setMotorPhaseType(value ?? "any")}>
              <SelectTrigger id="motor-phase" className="w-48">
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
            <Label htmlFor="starter-type">Starter Type</Label>
            <Select value={starterType} onValueChange={(value) => setStarterType(value ?? "any")}>
              <SelectTrigger id="starter-type" className="w-44">
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
            <Label htmlFor="motor-type">Motor Type</Label>
            <Select value={motorType} onValueChange={(value) => setMotorType(value ?? "any")}>
              <SelectTrigger id="motor-type" className="w-48">
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
            <Label htmlFor="water-source">Sump / Bore</Label>
            <Select value={waterSource} onValueChange={(value) => setWaterSource(value ?? "any")}>
              <SelectTrigger id="water-source" className="w-40">
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
            <Label htmlFor="unit-type">Unit Type</Label>
            <Select value={unitType} onValueChange={(value) => setUnitType(value ?? "any")}>
              <SelectTrigger id="unit-type" className="w-40">
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
            <Label htmlFor="min-motors">Min. Motors Supported</Label>
            <Input
              id="min-motors"
              type="number"
              min="1"
              placeholder="Any"
              value={numberOfMotors}
              onChange={(e) => setNumberOfMotors(e.target.value)}
              className="w-36"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-tanks">Min. Overhead Tanks</Label>
            <Input
              id="min-tanks"
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
        {filtered.length} product{filtered.length === 1 ? "" : "s"} found
      </p>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
