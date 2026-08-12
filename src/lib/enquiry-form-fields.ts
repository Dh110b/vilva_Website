export const ENQUIRY_FIELD_KEYS = [
  "unitType",
  "numberOfTanks",
  "motorPhaseType",
  "starterType",
  "motorType",
  "waterSource",
  "sumpOrBoreCapacity",
  "numberOfMotors",
] as const;

export type EnquiryFieldKey = (typeof ENQUIRY_FIELD_KEYS)[number];

export type EnquiryFieldConfig = {
  key: EnquiryFieldKey;
  label: string;
  enabled: boolean;
};

const DEFAULT_LABELS: Record<EnquiryFieldKey, string> = {
  unitType: "Unit Type",
  numberOfTanks: "No. of Overhead Tanks",
  motorPhaseType: "Motor Phase Type",
  starterType: "Starter Type",
  motorType: "Motor Type",
  waterSource: "Water Source",
  sumpOrBoreCapacity: "Motor Capacity",
  numberOfMotors: "No. of Motors",
};

export function defaultEnquiryFieldConfig(): EnquiryFieldConfig[] {
  return ENQUIRY_FIELD_KEYS.map((key) => ({
    key,
    label: DEFAULT_LABELS[key],
    enabled: true,
  }));
}

export function normalizeEnquiryFieldConfig(
  stored: unknown
): EnquiryFieldConfig[] {
  const defaults = defaultEnquiryFieldConfig();
  if (!Array.isArray(stored)) return defaults;

  const byKey = new Map<string, EnquiryFieldConfig>();
  for (const entry of stored) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof entry.key === "string" &&
      ENQUIRY_FIELD_KEYS.includes(entry.key)
    ) {
      byKey.set(entry.key, {
        key: entry.key,
        label: typeof entry.label === "string" && entry.label.trim() ? entry.label : DEFAULT_LABELS[entry.key as EnquiryFieldKey],
        enabled: typeof entry.enabled === "boolean" ? entry.enabled : true,
      });
    }
  }

  // Preserve stored order; append any missing keys (e.g. newly added fields) at the end.
  const ordered = Array.from(byKey.values());
  for (const def of defaults) {
    if (!byKey.has(def.key)) ordered.push(def);
  }
  return ordered;
}
