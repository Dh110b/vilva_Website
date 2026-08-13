"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { OptionCategory } from "@/lib/motor-options";
import type { OptionLists } from "@/hooks/use-option-lists";

export function OptionValuesEditor({
  categories,
  lists,
  onListsChange,
}: {
  categories: OptionCategory[];
  lists: OptionLists;
  onListsChange: (next: OptionLists) => void;
}) {
  const [newValue, setNewValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const merged = Array.from(new Set(categories.flatMap((c) => lists[c])));

  function categoryOf(value: string): OptionCategory {
    for (const c of categories) {
      if (lists[c].includes(value)) return c;
    }
    return categories[categories.length - 1];
  }

  async function persistOrder(newMerged: string[]) {
    const next = { ...lists };
    for (const c of categories) {
      const set = new Set(lists[c]);
      next[c] = newMerged.filter((v) => set.has(v));
    }
    setBusy(true);
    try {
      for (const c of categories) {
        const res = await fetch("/api/options", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: c, values: next[c] }),
        });
        if (!res.ok) throw new Error("Failed");
      }
      onListsChange(next);
    } catch {
      toast.error("Failed to reorder values");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= merged.length) return;
    const next = [...merged];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  async function addValue() {
    const value = newValue.trim();
    if (!value || merged.includes(value)) return;
    const targetCategory = categories[categories.length - 1];
    setBusy(true);
    try {
      const res = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: targetCategory, value }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      onListsChange({ ...lists, [targetCategory]: updated[targetCategory] });
      setNewValue("");
    } catch {
      toast.error("Failed to add value");
    } finally {
      setBusy(false);
    }
  }

  async function renameValue(oldValue: string, newValueText: string) {
    const trimmed = newValueText.trim();
    setEditingValue(null);
    if (!trimmed || trimmed === oldValue) return;
    if (merged.includes(trimmed)) {
      toast.error("That value already exists");
      return;
    }
    const cat = categoryOf(oldValue);
    const next = { ...lists, [cat]: lists[cat].map((v) => (v === oldValue ? trimmed : v)) };
    setBusy(true);
    try {
      const res = await fetch("/api/options", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat, values: next[cat] }),
      });
      if (!res.ok) throw new Error("Failed");
      onListsChange(next);
    } catch {
      toast.error("Failed to rename value");
    } finally {
      setBusy(false);
    }
  }

  async function removeValue(value: string) {
    if (!confirm(`Delete value "${value}"?`)) return;
    const cat = categoryOf(value);
    setBusy(true);
    try {
      const res = await fetch("/api/options", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat, value }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      onListsChange({ ...lists, [cat]: updated[cat] });
    } catch {
      toast.error("Failed to remove value");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {merged.length === 0 ? (
        <p className="text-sm text-muted-foreground">No values yet.</p>
      ) : (
        <ul className="space-y-1.5 max-h-72 overflow-y-auto">
          {merged.map((value, index) => (
            <li
              key={value}
              className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm"
            >
              <div className="flex flex-col shrink-0">
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  className="disabled:opacity-30"
                  aria-label={`Move ${value} up`}
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  disabled={busy || index === merged.length - 1}
                  onClick={() => move(index, 1)}
                  className="disabled:opacity-30"
                  aria-label={`Move ${value} down`}
                >
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
              {editingValue === value ? (
                <Input
                  autoFocus
                  className="h-7 flex-1"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => renameValue(value, editingText)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      renameValue(value, editingText);
                    } else if (e.key === "Escape") {
                      setEditingValue(null);
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="flex-1 truncate text-left hover:underline underline-offset-2"
                  onClick={() => {
                    setEditingValue(value);
                    setEditingText(value);
                  }}
                >
                  {value}
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => removeValue(value)}
                className="text-muted-foreground hover:text-destructive shrink-0"
                aria-label={`Delete ${value}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a new value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue();
            }
          }}
        />
        <Button type="button" size="sm" onClick={addValue} disabled={busy || !newValue.trim()}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
    </div>
  );
}
