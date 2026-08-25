"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AreaCombobox({
  areas,
  value,
  onChange,
  placeholder = "Select area",
}: {
  areas: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const isKnownArea = areas.includes(value);
  // Existing value doesn't match any known area (e.g. editing an entry with
  // a one-off area) — fall back to free-text mode so it isn't lost.
  const effectiveCustomMode = customMode || (!!value && !isKnownArea);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredAreas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return areas;
    return areas.filter((a) => a.toLowerCase().includes(q));
  }, [areas, query]);

  if (effectiveCustomMode) {
    return (
      <div className="space-y-1">
        <Input
          autoFocus
          placeholder="Enter new area name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {areas.length > 0 && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-primary hover:underline"
            onClick={() => {
              setCustomMode(false);
              onChange("");
            }}
          >
            Choose from existing areas instead
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
      >
        <span className={cn(!value && "text-muted-foreground")}>{value || placeholder}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <div className="p-1.5">
            <Input
              autoFocus
              placeholder="Search area..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto p-1 pt-0">
            {filteredAreas.length === 0 && (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">No matching areas.</li>
            )}
            {filteredAreas.map((area) => (
              <li key={area}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(area);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Check className={cn("size-4 shrink-0", area === value ? "opacity-100" : "opacity-0")} />
                  {area}
                </button>
              </li>
            ))}
            <li className="mt-1 border-t border-border pt-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  setCustomMode(true);
                  onChange("");
                }}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Others...
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
