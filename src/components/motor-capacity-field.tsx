"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function parseCombined(value: string): { sump: string; bore: string } {
  const sumpMatch = value.match(/Sump:\s*([^|]*)/i);
  const boreMatch = value.match(/Bore:\s*([^|]*)/i);
  return {
    sump: sumpMatch ? sumpMatch[1].trim() : "",
    bore: boreMatch ? boreMatch[1].trim() : "",
  };
}

export function MotorCapacityField({
  idPrefix,
  waterSource,
  value,
  onChange,
  label = "Motor Capacity",
}: {
  idPrefix: string;
  waterSource: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const isBoth = waterSource === "Sump and Bore Both";
  const { sump, bore } = useMemo(() => parseCombined(value), [value]);

  if (isBoth) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-sump`}>Sump Motor Capacity</Label>
          <Input
            id={`${idPrefix}-sump`}
            placeholder="e.g. 1 HP"
            value={sump}
            onChange={(e) => onChange(`Sump: ${e.target.value} | Bore: ${bore}`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-bore`}>Bore Motor Capacity</Label>
          <Input
            id={`${idPrefix}-bore`}
            placeholder="e.g. 2 HP"
            value={bore}
            onChange={(e) => onChange(`Sump: ${sump} | Bore: ${e.target.value}`)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${idPrefix}-single`}>{label}</Label>
      <Input
        id={`${idPrefix}-single`}
        placeholder="e.g. 1 HP"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
