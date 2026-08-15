"use client";

import { useMemo, useState } from "react";
import { X, Plus, ChevronUp, ChevronDown, ArrowDownAZ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ProductTypeDef } from "@/lib/product-types";

export function ProductTypesEditor({
  types,
  onTypesChange,
}: {
  types: ProductTypeDef[];
  onTypesChange: (next: ProductTypeDef[]) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newIsExtraEnquiry, setNewIsExtraEnquiry] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const filteredTypes = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return types;
    return types.filter((t) => t.name.toLowerCase().includes(q));
  }, [types, filterQuery]);

  async function persistOrder(nextOrder: ProductTypeDef[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/product-types", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: nextOrder.map((t) => t.name) }),
      });
      if (!res.ok) throw new Error("Failed");
      onTypesChange(await res.json());
    } catch {
      toast.error("Failed to reorder product types");
    } finally {
      setBusy(false);
    }
  }

  function moveType(name: string, direction: -1 | 1) {
    const index = types.findIndex((t) => t.name === name);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= types.length) return;
    const next = [...types];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  function sortAlphabetically() {
    const next = [...types].sort((a, b) => a.name.localeCompare(b.name));
    persistOrder(next);
  }

  async function addType() {
    const name = newName.trim();
    if (!name || types.some((t) => t.name === name)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/product-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isExtraEnquiry: newIsExtraEnquiry }),
      });
      if (!res.ok) throw new Error("Failed");
      onTypesChange(await res.json());
      setNewName("");
      setNewIsExtraEnquiry(false);
    } catch {
      toast.error("Failed to add product type");
    } finally {
      setBusy(false);
    }
  }

  async function renameType(oldName: string, newNameText: string) {
    const trimmed = newNameText.trim();
    setEditingName(null);
    if (!trimmed || trimmed === oldName) return;
    if (types.some((t) => t.name === trimmed)) {
      toast.error("That product type already exists");
      return;
    }
    const isExtraEnquiry = types.find((t) => t.name === oldName)?.isExtraEnquiry ?? false;
    setBusy(true);
    try {
      const res = await fetch("/api/product-types", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, name: trimmed, isExtraEnquiry }),
      });
      if (!res.ok) throw new Error("Failed");
      onTypesChange(await res.json());
    } catch {
      toast.error("Failed to rename product type");
    } finally {
      setBusy(false);
    }
  }

  async function toggleExtraEnquiry(type: ProductTypeDef) {
    setBusy(true);
    try {
      const res = await fetch("/api/product-types", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: type.name,
          name: type.name,
          isExtraEnquiry: !type.isExtraEnquiry,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      onTypesChange(await res.json());
    } catch {
      toast.error("Failed to update product type");
    } finally {
      setBusy(false);
    }
  }

  async function removeType(name: string) {
    if (!confirm(`Delete product type "${name}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/product-types", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onTypesChange(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product type");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {types.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Filter product types..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="h-8 min-w-[8rem] flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={sortAlphabetically}
            className="shrink-0"
          >
            <ArrowDownAZ className="size-4" /> Sort A-Z
          </Button>
        </div>
      )}

      {types.length === 0 ? (
        <p className="text-sm text-muted-foreground">No product types yet.</p>
      ) : filteredTypes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No product types match &quot;{filterQuery}&quot;.</p>
      ) : (
        <ul className="space-y-1.5 max-h-80 overflow-y-auto">
          {filteredTypes.map((type) => (
            <li
              key={type.name}
              className="flex flex-wrap items-center gap-2 rounded-md border px-2 py-1.5 text-sm"
            >
              <div className="flex flex-col shrink-0">
                <button
                  type="button"
                  disabled={busy || !!filterQuery || types[0]?.name === type.name}
                  onClick={() => moveType(type.name, -1)}
                  className="disabled:opacity-30"
                  aria-label={`Move ${type.name} up`}
                  title={filterQuery ? "Clear the filter to reorder" : undefined}
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  disabled={busy || !!filterQuery || types[types.length - 1]?.name === type.name}
                  onClick={() => moveType(type.name, 1)}
                  className="disabled:opacity-30"
                  aria-label={`Move ${type.name} down`}
                  title={filterQuery ? "Clear the filter to reorder" : undefined}
                >
                  <ChevronDown className="size-3.5" />
                </button>
              </div>

              {editingName === type.name ? (
                <Input
                  autoFocus
                  className="h-7 flex-1 min-w-[8rem]"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => renameType(type.name, editingText)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      renameType(type.name, editingText);
                    } else if (e.key === "Escape") {
                      setEditingName(null);
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="min-w-[8rem] flex-1 truncate text-left hover:underline underline-offset-2"
                  title={type.name}
                  onClick={() => {
                    setEditingName(type.name);
                    setEditingText(type.name);
                  }}
                >
                  {type.name}
                </button>
              )}

              <label className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <input
                  type="checkbox"
                  checked={type.isExtraEnquiry}
                  disabled={busy}
                  onChange={() => toggleExtraEnquiry(type)}
                />
                Extra Enquiry
              </label>

              <button
                type="button"
                disabled={busy}
                onClick={() => removeType(type.name)}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label={`Delete ${type.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Add a new product type"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addType();
            }
          }}
          className="flex-1 min-w-[10rem]"
        />
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={newIsExtraEnquiry}
            onChange={(e) => setNewIsExtraEnquiry(e.target.checked)}
          />
          Extra Enquiry
        </label>
        <Button type="button" size="sm" onClick={addType} disabled={busy || !newName.trim()}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
    </div>
  );
}
