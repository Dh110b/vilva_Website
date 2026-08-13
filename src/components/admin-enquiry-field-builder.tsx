"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import { ChevronDown, ChevronUp, GripVertical, ListPlus, Plus, Trash2, X } from "lucide-react";
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
import { useOptionLists } from "@/hooks/use-option-lists";
import { OptionValuesEditor } from "@/components/option-values-editor";
import { EnquiryFormFields, type EnquiryFormValues } from "@/components/enquiry-form-fields";
import {
  generateCustomFieldKey,
  type CustomFieldType,
  type EnquiryFieldConfig,
} from "@/lib/enquiry-form-fields";
import type { OptionCategory } from "@/lib/motor-options";
import type { OptionLists } from "@/hooks/use-option-lists";

type PreviewFormValues = EnquiryFormValues & {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  message: string;
};

const PREVIEW_FORM: PreviewFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  pincode: "",
  unitType: "",
  timerType: "",
  numberOfTanks: "",
  motorPhaseType: "",
  starterType: "",
  motorType: "",
  waterSource: "",
  sumpOrBoreCapacity: "",
  numberOfMotors: "",
  message: "",
  customFields: {},
};

const FIELD_CATEGORIES: Partial<Record<string, OptionCategory[]>> = {
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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [popupPreviewForm, setPopupPreviewForm] = useState<PreviewFormValues>(PREVIEW_FORM);
  const [customPreviewForm, setCustomPreviewForm] = useState<PreviewFormValues>(PREVIEW_FORM);
  const { lists: optionLists, setLists: setOptionLists } = useOptionLists();

  const [showAddField, setShowAddField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>("text");
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([]);
  const [newOptionValue, setNewOptionValue] = useState("");

  function toggleEnabled(key: string) {
    setConfig((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  }

  function updateLabel(key: string, label: string) {
    setConfig((prev) => prev.map((f) => (f.key === key ? { ...f, label } : f)));
  }

  function updateCustomFieldOptions(key: string, options: string[]) {
    setConfig((prev) => prev.map((f) => (f.key === key ? { ...f, options } : f)));
  }

  function removeField(key: string) {
    const field = config.find((f) => f.key === key);
    if (!confirm(`Delete the "${field?.label ?? "field"}" field? This cannot be undone.`)) return;
    setConfig((prev) => prev.filter((f) => f.key !== key));
    if (expanded === key) setExpanded(null);
  }

  function addCustomField() {
    const label = newFieldLabel.trim();
    if (!label) {
      toast.error("Enter a field label first");
      return;
    }
    if (newFieldType === "dropdown" && newFieldOptions.length === 0) {
      toast.error("Add at least one value for the dropdown");
      return;
    }
    const field: EnquiryFieldConfig = {
      key: generateCustomFieldKey(),
      label,
      enabled: true,
      custom: true,
      type: newFieldType,
      options: newFieldType === "dropdown" ? newFieldOptions : undefined,
    };
    setConfig((prev) => [...prev, field]);
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldOptions([]);
    setNewOptionValue("");
    setShowAddField(false);
  }

  function cancelAddField() {
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldOptions([]);
    setNewOptionValue("");
    setShowAddField(false);
  }

  function addNewOptionValue() {
    const value = newOptionValue.trim();
    if (!value || newFieldOptions.includes(value)) return;
    setNewFieldOptions((prev) => [...prev, value]);
    setNewOptionValue("");
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
    <div className="space-y-10">
      <div className="max-w-2xl space-y-4">
        <p className="text-sm text-muted-foreground">
          Controls the &quot;Motor &amp; Pump Details&quot; fields shown on the product Send
          Enquiry popup and the Custom Product page. Press and drag the handle to reorder fields,
          rename or hide them, and for dropdown fields, add/remove/reorder the values customers
          can pick — name, email, phone, address, and pincode always stay on the form.
        </p>

        <Reorder.Group axis="y" values={config} onReorder={setConfig} className="space-y-2">
          {config.map((field) => {
            const categories = FIELD_CATEGORIES[field.key];
            const isExpanded = expanded === field.key;

            return (
              <FieldRow
                key={field.key}
                field={field}
                categories={categories}
                isExpanded={isExpanded}
                onToggleExpanded={() => setExpanded(isExpanded ? null : field.key)}
                onToggleEnabled={() => toggleEnabled(field.key)}
                onLabelChange={(label) => updateLabel(field.key, label)}
                onOptionsChange={(options) => updateCustomFieldOptions(field.key, options)}
                onRemove={() => removeField(field.key)}
                optionLists={optionLists}
                setOptionLists={setOptionLists}
              />
            );
          })}
        </Reorder.Group>

        {showAddField ? (
          <div className="rounded-lg border border-dashed p-4 space-y-3">
            <p className="text-sm font-medium">Add a new field</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="new-field-label" className="text-xs text-muted-foreground">
                  Field label
                </Label>
                <Input
                  id="new-field-label"
                  autoFocus
                  placeholder="e.g. Preferred Installation Date"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Field type</Label>
                <Select
                  value={newFieldType}
                  onValueChange={(v) => setNewFieldType((v as CustomFieldType) ?? "text")}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text value</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {newFieldType === "dropdown" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Dropdown values</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a value and press Enter"
                    value={newOptionValue}
                    onChange={(e) => setNewOptionValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNewOptionValue();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addNewOptionValue}>
                    <Plus className="size-4" /> Add
                  </Button>
                </div>
                {newFieldOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newFieldOptions.map((opt) => (
                      <span
                        key={opt}
                        className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs"
                      >
                        {opt}
                        <button
                          type="button"
                          aria-label={`Remove ${opt}`}
                          onClick={() =>
                            setNewFieldOptions((prev) => prev.filter((o) => o !== opt))
                          }
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={addCustomField}>
                <Plus className="size-4" /> Add Field
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={cancelAddField}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddField(true)}
          >
            <Plus className="size-4" /> Add Field
          </Button>
        )}

        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">
          Live preview — updates as you edit
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold mb-2">Products page — Send Enquiry popup</p>
          <div className="rounded-lg border border-foreground/25 bg-white/10 p-4 backdrop-blur-md dark:border-white/20 dark:bg-white/5 space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input disabled value={popupPreviewForm.name} placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input disabled value={popupPreviewForm.email} placeholder="jane@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input disabled value={popupPreviewForm.phone} placeholder="9876543210" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea disabled rows={2} placeholder="Where should this be installed?" />
            </div>
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input disabled placeholder="e.g. 560056" />
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Motor &amp; Pump Details (optional)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Don&apos;t know these details? Contact us and we&apos;ll help you figure it out.
                </p>
              </div>
              <EnquiryFormFields
                config={config}
                form={popupPreviewForm}
                setForm={setPopupPreviewForm}
                optionLists={optionLists}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Requirements (optional)</Label>
              <Textarea
                disabled
                rows={3}
                placeholder="Tank capacity, existing wiring, preferred installation date, etc."
              />
            </div>

            <Button type="button" disabled className="w-full">
              Send Enquiry
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Custom Product page</p>
          <div className="rounded-lg border border-foreground/25 bg-white/10 p-4 backdrop-blur-md dark:border-white/20 dark:bg-white/5 space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input disabled value={customPreviewForm.name} placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input disabled value={customPreviewForm.email} placeholder="jane@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input disabled value={customPreviewForm.phone} placeholder="9876543210" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea disabled rows={2} placeholder="Where should this be installed?" />
            </div>
            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input disabled placeholder="e.g. 560056" />
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Motor &amp; Pump Details (optional)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tell us what you have so we can design a custom controller for it.
                </p>
              </div>
              <EnquiryFormFields
                config={config}
                form={customPreviewForm}
                setForm={setCustomPreviewForm}
                optionLists={optionLists}
              />
            </div>

            <div className="space-y-2">
              <Label>Describe Your Custom Requirement</Label>
              <Textarea
                disabled
                rows={4}
                placeholder="What should this custom water level controller do differently? Special features, panel size, mounting, app/SMS alerts, etc."
              />
            </div>

            <Button type="button" disabled className="w-full">
              Send Enquiry
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({
  field,
  categories,
  isExpanded,
  onToggleExpanded,
  onToggleEnabled,
  onLabelChange,
  onOptionsChange,
  onRemove,
  optionLists,
  setOptionLists,
}: {
  field: EnquiryFieldConfig;
  categories: OptionCategory[] | undefined;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleEnabled: () => void;
  onLabelChange: (label: string) => void;
  onOptionsChange: (options: string[]) => void;
  onRemove: () => void;
  optionLists: OptionLists;
  setOptionLists: (lists: OptionLists) => void;
}) {
  const dragControls = useDragControls();
  const [newValue, setNewValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const hasValuesEditor = categories || field.type === "dropdown";
  const options = field.options ?? [];

  function moveOption(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= options.length) return;
    const next = [...options];
    [next[index], next[target]] = [next[target], next[index]];
    onOptionsChange(next);
  }

  function renameOption(index: number, text: string) {
    const trimmed = text.trim();
    setEditingIndex(null);
    if (!trimmed || trimmed === options[index]) return;
    if (options.includes(trimmed)) {
      toast.error("That value already exists");
      return;
    }
    const next = [...options];
    next[index] = trimmed;
    onOptionsChange(next);
  }

  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={dragControls}
      className="rounded-lg border bg-card"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onPointerDown={(e) => dragControls.start(e)}
          aria-label="Drag to reorder"
          className="cursor-grab touch-none shrink-0 text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        <div className="flex-1 space-y-1.5">
          <Label htmlFor={`label-${field.key}`} className="text-xs text-muted-foreground">
            Field label (title){field.custom ? " · custom" : ""}
          </Label>
          <Input
            id={`label-${field.key}`}
            value={field.label}
            onChange={(e) => onLabelChange(e.target.value)}
          />
        </div>

        {hasValuesEditor && (
          <Button
            type="button"
            variant={isExpanded ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={onToggleExpanded}
          >
            <ListPlus className="size-4" /> Values
          </Button>
        )}

        <Button
          type="button"
          variant={field.enabled ? "default" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={onToggleEnabled}
        >
          {field.enabled ? "Shown" : "Hidden"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-destructive"
          onClick={onRemove}
          aria-label="Delete field"
        >
          <Trash2 className="size-4" />
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

      {!categories && field.type === "dropdown" && isExpanded && (
        <div className="border-t p-3 pl-14 space-y-2">
          <p className="text-xs text-muted-foreground mb-2">
            Values customers can choose from for &quot;{field.label}&quot;. Click a value to edit
            it.
          </p>

          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">No values yet.</p>
          ) : (
            <ul className="space-y-1.5 max-h-72 overflow-y-auto">
              {options.map((opt, index) => (
                <li
                  key={opt}
                  className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm"
                >
                  <div className="flex flex-col shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveOption(index, -1)}
                      className="disabled:opacity-30"
                      aria-label={`Move ${opt} up`}
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === options.length - 1}
                      onClick={() => moveOption(index, 1)}
                      className="disabled:opacity-30"
                      aria-label={`Move ${opt} down`}
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>

                  {editingIndex === index ? (
                    <Input
                      autoFocus
                      className="h-7 flex-1"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => renameOption(index, editingText)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          renameOption(index, editingText);
                        } else if (e.key === "Escape") {
                          setEditingIndex(null);
                        }
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex-1 truncate text-left hover:underline underline-offset-2"
                      onClick={() => {
                        setEditingIndex(index);
                        setEditingText(opt);
                      }}
                    >
                      {opt}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm(`Delete value "${opt}"?`)) return;
                      onOptionsChange(options.filter((_, i) => i !== index));
                    }}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label={`Delete ${opt}`}
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
                  const trimmed = newValue.trim();
                  if (trimmed && !options.includes(trimmed)) {
                    onOptionsChange([...options, trimmed]);
                  }
                  setNewValue("");
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              disabled={!newValue.trim()}
              onClick={() => {
                const trimmed = newValue.trim();
                if (trimmed && !options.includes(trimmed)) {
                  onOptionsChange([...options, trimmed]);
                }
                setNewValue("");
              }}
            >
              <Plus className="size-4" /> Add
            </Button>
          </div>
        </div>
      )}
    </Reorder.Item>
  );
}
