"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useOptionLists } from "@/hooks/use-option-lists";
import { OptionValuesEditor } from "@/components/option-values-editor";
import type { EnquiryFieldConfig, EnquiryFieldKey } from "@/lib/enquiry-form-fields";
import type { OptionCategory } from "@/lib/motor-options";

const FIELD_CATEGORIES: Partial<Record<EnquiryFieldKey, OptionCategory[]>> = {
  unitType: ["timerType", "unitType"],
  motorPhaseType: ["motorPhaseType"],
  starterType: ["starterType"],
  motorType: ["motorType"],
  waterSource: ["waterSource"],
};

export function AdminEnquiryFieldBuilder({
  initialConfig,
}: {
  initialConfig: EnquiryFieldConfig[];
}) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<EnquiryFieldKey | null>(null);
  const { lists: optionLists, setLists: setOptionLists } = useOptionLists();

  function move(index: number, direction: -1 | 1) {
    const next = [...config];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setConfig(next);
  }

  function toggleEnabled(index: number) {
    const next = [...config];
    next[index] = { ...next[index], enabled: !next[index].enabled };
    setConfig(next);
  }

  function updateLabel(index: number, label: string) {
    const next = [...config];
    next[index] = { ...next[index], label };
    setConfig(next);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/enquiry-form-fields", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed");
      const saved = await res.json();
      setConfig(saved);
      toast.success("Send Enquiry form updated");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Controls the &quot;Motor &amp; Pump Details&quot; fields shown on the product Send Enquiry
        popup and the Custom Product page. Reorder, rename, or hide fields, and for dropdown
        fields, add/remove/reorder the values customers can pick — name, email, phone, address,
        and pincode always stay on the form.
      </p>

      <div className="space-y-2">
        {config.map((field, index) => {
          const categories = FIELD_CATEGORIES[field.key];
          const isExpanded = expanded === field.key;

          return (
            <div key={field.key} className="rounded-lg border bg-card">
              <div className="flex items-center gap-3 p-3">
                <GripVertical className="size-4 text-muted-foreground shrink-0" />

                <div className="flex flex-col shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Move up"
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === config.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Move down"
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-1.5">
                  <Label htmlFor={`label-${field.key}`} className="text-xs text-muted-foreground">
                    Field label (title)
                  </Label>
                  <Input
                    id={`label-${field.key}`}
                    value={field.label}
                    onChange={(e) => updateLabel(index, e.target.value)}
                  />
                </div>

                {categories && (
                  <Button
                    type="button"
                    variant={isExpanded ? "default" : "outline"}
                    size="sm"
                    className="shrink-0"
                    onClick={() => setExpanded(isExpanded ? null : field.key)}
                  >
                    <ListPlus className="size-4" /> Values
                  </Button>
                )}

                <Button
                  type="button"
                  variant={field.enabled ? "default" : "outline"}
                  size="sm"
                  className="shrink-0"
                  onClick={() => toggleEnabled(index)}
                >
                  {field.enabled ? "Shown" : "Hidden"}
                </Button>
              </div>

              {categories && isExpanded && (
                <div className="border-t p-3 pl-14">
                  <p className="text-xs text-muted-foreground mb-2">
                    Values customers can choose from for &quot;{field.label}&quot;.
                  </p>
                  <OptionValuesEditor
                    categories={categories}
                    lists={optionLists}
                    onListsChange={setOptionLists}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button type="button" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
