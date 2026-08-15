export type ProductTypeDef = {
  name: string;
  isExtraEnquiry: boolean;
};

// Seed data used the first time the product-type list is loaded, and as a
// fallback before the client has fetched the live list from the server.
export const DEFAULT_PRODUCT_TYPES: ProductTypeDef[] = [
  { name: "Smart Auto Starter", isExtraEnquiry: true },
  { name: "Auto Starter Unit", isExtraEnquiry: true },
  { name: "Three Phase Preventer", isExtraEnquiry: false },
  { name: "Solar Water Heater Controller", isExtraEnquiry: false },
  { name: "Heat Pump Water Heater Controller", isExtraEnquiry: false },
];

export function hasExtraEnquiry(type: string | null | undefined, types: ProductTypeDef[]): boolean {
  return types.some((t) => t.name === type && t.isExtraEnquiry);
}

export function isValidProductType(type: unknown, types: ProductTypeDef[]): type is string {
  return typeof type === "string" && types.some((t) => t.name === type);
}
