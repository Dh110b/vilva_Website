"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductTypeDef } from "@/lib/product-types";

type SortOption = "default" | "name-asc" | "name-desc" | "active-first" | "inactive-first";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default order" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
  { value: "active-first", label: "Extra Enquiry: On first" },
  { value: "inactive-first", label: "Extra Enquiry: Off first" },
];

export function AdminEnquiryTypePicker({ types }: { types: ProductTypeDef[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = q ? types.filter((t) => t.name.toLowerCase().includes(q)) : types;
    result = [...result];
    switch (sort) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "active-first":
        result.sort((a, b) => Number(b.isExtraEnquiry) - Number(a.isExtraEnquiry));
        break;
      case "inactive-first":
        result.sort((a, b) => Number(a.isExtraEnquiry) - Number(b.isExtraEnquiry));
        break;
      default:
        break;
    }
    return result;
  }, [types, query, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          placeholder="Search product types..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[10rem]"
        />
        <Select value={sort} onValueChange={(value) => setSort((value as SortOption) ?? "default")}>
          <SelectTrigger className="w-full sm:w-56">
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
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground">No product types match &quot;{query}&quot;.</p>
      ) : (
        <ul className="divide-y rounded-lg border border-foreground/25 bg-white/10 backdrop-blur-md dark:border-white/20 dark:bg-white/5">
          {visible.map((t) => (
            <li key={t.name}>
              <Link
                href={`/admin/enquiry-form?type=${encodeURIComponent(t.name)}`}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-foreground/5"
              >
                <span className="font-medium">{t.name}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <Badge variant={t.isExtraEnquiry ? "default" : "outline"}>
                    {t.isExtraEnquiry ? "Extra Enquiry on" : "Extra Enquiry off"}
                  </Badge>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
