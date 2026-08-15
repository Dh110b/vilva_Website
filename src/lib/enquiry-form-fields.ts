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

export type CustomFieldType = "text" | "number" | "dropdown";

export type EnquiryFieldConfig = {
  key: string;
  label: string;
  enabled: boolean;
  custom?: boolean;
  type?: CustomFieldType;
  options?: string[];
};

export type EnquiryFormConfig = {
  title: string;
  fields: EnquiryFieldConfig[];
};

export const DEFAULT_ENQUIRY_SECTION_TITLE = "Extra Enquiry Details (optional)";

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

// Legacy defaults, kept only to normalize old saved configs from before
// product types had their own independent, admin-built field lists.
export function legacyDefaultEnquiryFieldConfig(): EnquiryFieldConfig[] {
  return ENQUIRY_FIELD_KEYS.map((key) => ({
    key,
    label: DEFAULT_LABELS[key],
    enabled: true,
  }));
}

export function generateCustomFieldKey(): string {
  return `custom_${Math.random().toString(36).slice(2, 10)}`;
}

function isValidCustomField(entry: unknown): entry is EnquiryFieldConfig {
  if (!entry || typeof entry !== "object") return false;
  const e = entry as Record<string, unknown>;
  if (typeof e.key !== "string" || !e.key.trim()) return false;
  if (typeof e.label !== "string" || !e.label.trim()) return false;
  if (e.type !== "text" && e.type !== "number" && e.type !== "dropdown") return false;
  if (e.type === "dropdown") {
    if (!Array.isArray(e.options)) return false;
    if (!e.options.every((o) => typeof o === "string")) return false;
  }
  return true;
}

export function normalizeEnquiryFieldConfig(
  stored: unknown,
  fallback: EnquiryFieldConfig[] = []
): EnquiryFieldConfig[] {
  if (!Array.isArray(stored)) return fallback;

  const byKey = new Map<string, EnquiryFieldConfig>();
  for (const entry of stored) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof (entry as { key?: unknown }).key === "string" &&
      ENQUIRY_FIELD_KEYS.includes((entry as { key: string }).key as EnquiryFieldKey)
    ) {
      const e = entry as { key: EnquiryFieldKey; label?: unknown; enabled?: unknown };
      byKey.set(e.key, {
        key: e.key,
        label: typeof e.label === "string" && e.label.trim() ? e.label : DEFAULT_LABELS[e.key],
        enabled: typeof e.enabled === "boolean" ? e.enabled : true,
      });
    } else if (isValidCustomField(entry) && (entry as EnquiryFieldConfig).custom) {
      const e = entry as EnquiryFieldConfig;
      byKey.set(e.key, {
        key: e.key,
        label: e.label,
        enabled: typeof e.enabled === "boolean" ? e.enabled : true,
        custom: true,
        type: e.type,
        options: e.type === "dropdown" ? (e.options ?? []) : undefined,
      });
    }
  }

  // Preserve exactly what's stored, in its saved order — including any built-in
  // fields the admin has deleted. (Only a missing/never-saved config falls back to
  // the provided fallback, handled by the !Array.isArray check above.)
  return Array.from(byKey.values());
}
