"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MotorCapacityField } from "@/components/motor-capacity-field";
import type { EnquiryFieldConfig } from "@/lib/enquiry-form-fields";
import type { OptionLists } from "@/hooks/use-option-lists";

export type EnquiryFormValues = {
  unitType: string;
  timerType: string;
  numberOfTanks: string;
  motorPhaseType: string;
  starterType: string;
  motorType: string;
  waterSource: string;
  sumpOrBoreCapacity: string;
  numberOfMotors: string;
  customFields: Record<string, string>;
};

export function EnquiryFormFields<T extends EnquiryFormValues>({
  config,
  form,
  setForm,
  optionLists,
}: {
  config: EnquiryFieldConfig[];
  form: T;
  setForm: (updater: (prev: T) => T) => void;
  optionLists: OptionLists;
}) {
  return (
    <>
      {config
        .filter((field) => field.enabled)
        .map((field) => {
          switch (field.key) {
            case "unitType":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="unitType">{field.label}</Label>
                  <Select
                    value={form.unitType || form.timerType}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, unitType: value ?? "", timerType: value ?? "" }))
                    }
                  >
                    <SelectTrigger id="unitType" className="w-full">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        new Set([...optionLists.timerType, ...optionLists.unitType])
                      ).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            case "numberOfTanks":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="numberOfTanks">{field.label}</Label>
                  <Input
                    id="numberOfTanks"
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    value={form.numberOfTanks}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, numberOfTanks: e.target.value }))
                    }
                  />
                </div>
              );
            case "motorPhaseType":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="motorPhaseType">{field.label}</Label>
                  <Select
                    value={form.motorPhaseType}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, motorPhaseType: value ?? "" }))
                    }
                  >
                    <SelectTrigger id="motorPhaseType" className="w-full">
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionLists.motorPhaseType.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            case "starterType":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="starterType">{field.label}</Label>
                  <Select
                    value={form.starterType}
                    onValueChange={(value) => setForm((f) => ({ ...f, starterType: value ?? "" }))}
                  >
                    <SelectTrigger id="starterType" className="w-full">
                      <SelectValue placeholder="Select starter" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionLists.starterType.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                      <SelectItem value="Not sure">Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            case "motorType":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="motorType">{field.label}</Label>
                  <Select
                    value={form.motorType}
                    onValueChange={(value) => setForm((f) => ({ ...f, motorType: value ?? "" }))}
                  >
                    <SelectTrigger id="motorType" className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionLists.motorType.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            case "waterSource":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="waterSource">{field.label}</Label>
                  <Select
                    value={form.waterSource}
                    onValueChange={(value) => setForm((f) => ({ ...f, waterSource: value ?? "" }))}
                  >
                    <SelectTrigger id="waterSource" className="w-full">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionLists.waterSource.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            case "sumpOrBoreCapacity":
              return (
                <MotorCapacityField
                  key={field.key}
                  idPrefix="sumpOrBoreCapacity"
                  label={field.label}
                  waterSource={form.waterSource}
                  value={form.sumpOrBoreCapacity}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, sumpOrBoreCapacity: value }))
                  }
                />
              );
            case "numberOfMotors":
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor="numberOfMotors">{field.label}</Label>
                  <Input
                    id="numberOfMotors"
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    value={form.numberOfMotors}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, numberOfMotors: e.target.value }))
                    }
                  />
                </div>
              );
            default: {
              if (!field.custom) return null;
              const value = form.customFields[field.key] ?? "";
              if (field.type === "dropdown") {
                return (
                  <div className="space-y-2" key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Select
                      value={value}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          customFields: { ...f.customFields, [field.key]: v ?? "" },
                        }))
                      }
                    >
                      <SelectTrigger id={field.key} className="w-full">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              return (
                <div className="space-y-2" key={field.key}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    value={value}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        customFields: { ...f.customFields, [field.key]: e.target.value },
                      }))
                    }
                  />
                </div>
              );
            }
          }
        })}
    </>
  );
}
