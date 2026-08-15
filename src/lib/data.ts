import { sql } from "@/lib/db";
import { OPTION_CATEGORIES, type OptionCategory } from "@/lib/motor-options";
import { DEFAULT_PRODUCT_TYPES, type ProductTypeDef } from "@/lib/product-types";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/enquiry-status";
import {
  legacyDefaultEnquiryFieldConfig,
  normalizeEnquiryFieldConfig,
  DEFAULT_ENQUIRY_SECTION_TITLE,
  type EnquiryFieldConfig,
  type EnquiryFormConfig,
} from "@/lib/enquiry-form-fields";

export { ENQUIRY_STATUSES, type EnquiryStatus };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  demoUrl?: string;
  productType: string;
  sumpOrBoreCapacity?: string;
  motorPhaseType?: string;
  motorType?: string;
  starterType?: string;
  numberOfMotors?: string;
  waterSource?: string;
  numberOfTanks?: string;
  timerType?: string;
  unitType?: string;
  createdAt: string;
};

export type ReviewReply = {
  id: string;
  name: string;
  message: string;
  isOwner: boolean;
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  description: string;
  images: string[];
  replies: ReviewReply[];
  createdAt: string;
};

export type Enquiry = {
  id: string;
  productId: string;
  productName: string;
  name: string;
  email: string;
  phone?: string;
  numberOfTanks?: string;
  address: string;
  pincode: string;
  sumpOrBoreCapacity?: string;
  motorPhaseType?: string;
  motorType?: string;
  starterType?: string;
  numberOfMotors?: string;
  waterSource?: string;
  timerType?: string;
  unitType?: string;
  message?: string;
  customFields?: Record<string, string>;
  status: EnquiryStatus;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    images: row.images ?? [],
    demoUrl: row.demo_url ?? undefined,
    productType: row.product_type ?? "Smart Auto Starter",
    sumpOrBoreCapacity: row.sump_or_bore_capacity ?? undefined,
    motorPhaseType: row.motor_phase_type ?? undefined,
    motorType: row.motor_type ?? undefined,
    starterType: row.starter_type ?? undefined,
    numberOfMotors: row.number_of_motors ?? undefined,
    waterSource: row.water_source ?? undefined,
    numberOfTanks: row.number_of_tanks ?? undefined,
    timerType: row.timer_type ?? undefined,
    unitType: row.unit_type ?? undefined,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await sql`select * from products order by created_at desc`;
  return rows.map(rowToProduct);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const rows = await sql`select * from products where id = ${id} limit 1`;
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  const rows = await sql`
    insert into products (
      name, description, price, images, demo_url, product_type, sump_or_bore_capacity,
      motor_phase_type, motor_type, starter_type, number_of_motors,
      water_source, number_of_tanks, timer_type, unit_type
    ) values (
      ${input.name}, ${input.description}, ${input.price}, ${sql.json(input.images ?? [])},
      ${input.demoUrl ?? null}, ${input.productType}, ${input.sumpOrBoreCapacity ?? null},
      ${input.motorPhaseType ?? null}, ${input.motorType ?? null}, ${input.starterType ?? null},
      ${input.numberOfMotors ?? null}, ${input.waterSource ?? null}, ${input.numberOfTanks ?? null},
      ${input.timerType ?? null}, ${input.unitType ?? null}
    )
    returning *
  `;
  return rowToProduct(rows[0]);
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "createdAt">>
): Promise<Product | undefined> {
  const existing = await getProduct(id);
  if (!existing) return undefined;
  const merged = { ...existing, ...input };
  const rows = await sql`
    update products set
      name = ${merged.name},
      description = ${merged.description},
      price = ${merged.price},
      images = ${sql.json(merged.images ?? [])},
      demo_url = ${merged.demoUrl ?? null},
      product_type = ${merged.productType},
      sump_or_bore_capacity = ${merged.sumpOrBoreCapacity ?? null},
      motor_phase_type = ${merged.motorPhaseType ?? null},
      motor_type = ${merged.motorType ?? null},
      starter_type = ${merged.starterType ?? null},
      number_of_motors = ${merged.numberOfMotors ?? null},
      water_source = ${merged.waterSource ?? null},
      number_of_tanks = ${merged.numberOfTanks ?? null},
      timer_type = ${merged.timerType ?? null},
      unit_type = ${merged.unitType ?? null}
    where id = ${id}
    returning *
  `;
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const rows = await sql`delete from products where id = ${id} returning id`;
  return rows.length > 0;
}

export type ImageUsage = { label: string; href: string };

export async function getAllUsedImageUrls(): Promise<Map<string, ImageUsage[]>> {
  const [productRows, reviewRows] = await Promise.all([
    sql`select id, name, images from products`,
    sql`select id, product_id, name, images from reviews`,
  ]);
  const usage = new Map<string, ImageUsage[]>();

  function add(url: string, entry: ImageUsage) {
    const existing = usage.get(url);
    if (existing) existing.push(entry);
    else usage.set(url, [entry]);
  }

  for (const row of productRows) {
    for (const url of (row.images as string[] | null) ?? []) {
      add(url, { label: `Product: ${row.name}`, href: `/admin/products/${row.id}` });
    }
  }
  for (const row of reviewRows) {
    for (const url of (row.images as string[] | null) ?? []) {
      add(url, {
        label: `Review by ${row.name}`,
        href: `/admin/products/${row.product_id}`,
      });
    }
  }

  return usage;
}

// ---------------------------------------------------------------------------
// Enquiries
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToEnquiry(row: any): Enquiry {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    numberOfTanks: row.number_of_tanks ?? undefined,
    address: row.address,
    pincode: row.pincode,
    sumpOrBoreCapacity: row.sump_or_bore_capacity ?? undefined,
    motorPhaseType: row.motor_phase_type ?? undefined,
    motorType: row.motor_type ?? undefined,
    starterType: row.starter_type ?? undefined,
    numberOfMotors: row.number_of_motors ?? undefined,
    waterSource: row.water_source ?? undefined,
    timerType: row.timer_type ?? undefined,
    unitType: row.unit_type ?? undefined,
    message: row.message ?? undefined,
    customFields: row.custom_fields ?? undefined,
    status: (row.status ?? "New") as EnquiryStatus,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const rows = await sql`select * from enquiries order by created_at desc`;
  return rows.map(rowToEnquiry);
}

export async function createEnquiry(
  input: Omit<Enquiry, "id" | "createdAt" | "status">
): Promise<Enquiry> {
  const rows = await sql`
    insert into enquiries (
      product_id, product_name, name, email, phone, number_of_tanks, address, pincode,
      sump_or_bore_capacity, motor_phase_type, motor_type, starter_type, number_of_motors,
      water_source, timer_type, unit_type, message, custom_fields, status
    ) values (
      ${input.productId}, ${input.productName}, ${input.name}, ${input.email}, ${input.phone ?? null},
      ${input.numberOfTanks ?? null}, ${input.address}, ${input.pincode},
      ${input.sumpOrBoreCapacity ?? null}, ${input.motorPhaseType ?? null}, ${input.motorType ?? null},
      ${input.starterType ?? null}, ${input.numberOfMotors ?? null}, ${input.waterSource ?? null},
      ${input.timerType ?? null}, ${input.unitType ?? null}, ${input.message ?? null},
      ${sql.json(input.customFields ?? {})}, 'New'
    )
    returning *
  `;
  return rowToEnquiry(rows[0]);
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<Enquiry | undefined> {
  const rows = await sql`
    update enquiries set status = ${status} where id = ${id} returning *
  `;
  return rows[0] ? rowToEnquiry(rows[0]) : undefined;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const rows = await sql`delete from enquiries where id = ${id} returning id`;
  return rows.length > 0;
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReply(row: any): ReviewReply {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    isOwner: row.is_owner,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getReviews(productId: string): Promise<Review[]> {
  const reviewRows = await sql`
    select * from reviews where product_id = ${productId} order by created_at desc
  `;
  const replyRows = await sql`
    select * from review_replies
    where review_id in ${sql(reviewRows.map((r) => r.id))}
    order by created_at asc
  `.catch(() => []);

  return reviewRows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    name: row.name,
    rating: row.rating,
    description: row.description,
    images: row.images ?? [],
    replies: replyRows.filter((r) => r.review_id === row.id).map(rowToReply),
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

export async function getProductRatings(): Promise<
  Record<string, { average: number; count: number }>
> {
  const rows = await sql`
    select product_id, avg(rating)::float as average, count(*)::int as count
    from reviews
    group by product_id
  `;
  const result: Record<string, { average: number; count: number }> = {};
  for (const row of rows) {
    result[row.product_id] = { average: row.average, count: row.count };
  }
  return result;
}

export async function createReview(
  input: Omit<Review, "id" | "createdAt" | "replies">
): Promise<Review> {
  const rows = await sql`
    insert into reviews (product_id, name, rating, description, images)
    values (${input.productId}, ${input.name}, ${input.rating}, ${input.description}, ${sql.json(input.images ?? [])})
    returning *
  `;
  const row = rows[0];
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    rating: row.rating,
    description: row.description,
    images: row.images ?? [],
    replies: [],
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function addReviewReply(
  reviewId: string,
  input: Omit<ReviewReply, "id" | "createdAt">
): Promise<ReviewReply | undefined> {
  const reviewExists = await sql`select id from reviews where id = ${reviewId} limit 1`;
  if (reviewExists.length === 0) return undefined;

  const rows = await sql`
    insert into review_replies (review_id, name, message, is_owner)
    values (${reviewId}, ${input.name}, ${input.message}, ${input.isOwner})
    returning *
  `;
  return rowToReply(rows[0]);
}

// ---------------------------------------------------------------------------
// Key-value config: option lists, enquiry form field config, admin OTP
// ---------------------------------------------------------------------------

async function getKv<T>(key: string): Promise<T | undefined> {
  const rows = await sql`select value from app_kv where key = ${key} limit 1`;
  return rows[0]?.value as T | undefined;
}

async function setKv(key: string, value: unknown): Promise<void> {
  await sql`
    insert into app_kv (key, value, updated_at)
    values (${key}, ${sql.json(value as Parameters<typeof sql.json>[0])}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}

async function deleteKv(key: string): Promise<void> {
  await sql`delete from app_kv where key = ${key}`;
}

export type OptionLists = Record<OptionCategory, string[]>;

function defaultOptionLists(): OptionLists {
  const result = {} as OptionLists;
  for (const key of Object.keys(OPTION_CATEGORIES) as OptionCategory[]) {
    result[key] = [...OPTION_CATEGORIES[key].defaults];
  }
  return result;
}

const OPTIONS_KV_KEY = "option_lists";

export async function getOptionLists(): Promise<OptionLists> {
  const stored = await getKv<Partial<OptionLists>>(OPTIONS_KV_KEY);
  const defaults = defaultOptionLists();
  const merged = { ...defaults, ...stored } as OptionLists;
  for (const key of Object.keys(OPTION_CATEGORIES) as OptionCategory[]) {
    if (!Array.isArray(merged[key]) || merged[key].length === 0) {
      merged[key] = defaults[key];
    }
  }
  if (!stored) await setKv(OPTIONS_KV_KEY, merged);
  return merged;
}

export async function addOption(
  category: OptionCategory,
  value: string
): Promise<OptionLists> {
  const trimmed = value.trim();
  const lists = await getOptionLists();
  if (trimmed && !lists[category].includes(trimmed)) {
    lists[category] = [...lists[category], trimmed];
    await setKv(OPTIONS_KV_KEY, lists);
  }
  return lists;
}

export async function deleteOption(
  category: OptionCategory,
  value: string
): Promise<OptionLists> {
  const lists = await getOptionLists();
  lists[category] = lists[category].filter((v) => v !== value);
  await setKv(OPTIONS_KV_KEY, lists);
  return lists;
}

export async function setOptionList(
  category: OptionCategory,
  values: string[]
): Promise<OptionLists> {
  const lists = await getOptionLists();
  lists[category] = Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
  await setKv(OPTIONS_KV_KEY, lists);
  return lists;
}

const PRODUCT_TYPES_KV_KEY = "product_types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProductType(entry: any): ProductTypeDef {
  return {
    name: entry.name,
    // Back-compat: this field used to be called `isMotor`.
    isExtraEnquiry: entry.isExtraEnquiry ?? entry.isMotor ?? false,
  };
}

export async function getProductTypes(): Promise<ProductTypeDef[]> {
  const stored = await getKv<ProductTypeDef[]>(PRODUCT_TYPES_KV_KEY);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    await setKv(PRODUCT_TYPES_KV_KEY, DEFAULT_PRODUCT_TYPES);
    return DEFAULT_PRODUCT_TYPES;
  }
  return stored.map(normalizeProductType);
}

export async function addProductType(
  name: string,
  isExtraEnquiry: boolean
): Promise<ProductTypeDef[]> {
  const trimmed = name.trim();
  const types = await getProductTypes();
  if (!trimmed || types.some((t) => t.name === trimmed)) return types;
  const next = [...types, { name: trimmed, isExtraEnquiry }];
  await setKv(PRODUCT_TYPES_KV_KEY, next);
  return next;
}

export async function updateProductType(
  oldName: string,
  newName: string,
  isExtraEnquiry: boolean
): Promise<ProductTypeDef[]> {
  const trimmed = newName.trim();
  const types = await getProductTypes();
  if (!trimmed) return types;
  if (trimmed !== oldName && types.some((t) => t.name === trimmed)) return types;

  const next = types.map((t) => (t.name === oldName ? { name: trimmed, isExtraEnquiry } : t));
  await setKv(PRODUCT_TYPES_KV_KEY, next);

  if (trimmed !== oldName) {
    await sql`update products set product_type = ${trimmed} where product_type = ${oldName}`;
  }
  return next;
}

export async function reorderProductTypes(order: string[]): Promise<ProductTypeDef[]> {
  const types = await getProductTypes();
  const byName = new Map(types.map((t) => [t.name, t]));
  const reordered: ProductTypeDef[] = [];
  for (const name of order) {
    const t = byName.get(name);
    if (t) {
      reordered.push(t);
      byName.delete(name);
    }
  }
  // Anything not included in `order` (shouldn't normally happen) stays appended at the end.
  reordered.push(...byName.values());
  await setKv(PRODUCT_TYPES_KV_KEY, reordered);
  return reordered;
}

export async function countProductsOfType(name: string): Promise<number> {
  const rows = await sql`select count(*)::int as count from products where product_type = ${name}`;
  return rows[0]?.count ?? 0;
}

export async function deleteProductType(name: string): Promise<ProductTypeDef[]> {
  const types = await getProductTypes();
  const next = types.filter((t) => t.name !== name);
  await setKv(PRODUCT_TYPES_KV_KEY, next);
  return next;
}

const ENQUIRY_FIELDS_KV_KEY = "enquiry_form_fields";

type EnquiryFormConfigByType = Record<string, EnquiryFormConfig>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStoredEnquiryEntry(entry: any): EnquiryFormConfig {
  // Legacy format: a bare field array with no title.
  if (Array.isArray(entry)) {
    return {
      title: DEFAULT_ENQUIRY_SECTION_TITLE,
      fields: normalizeEnquiryFieldConfig(entry, legacyDefaultEnquiryFieldConfig()),
    };
  }
  return {
    title:
      typeof entry?.title === "string" && entry.title.trim()
        ? entry.title
        : DEFAULT_ENQUIRY_SECTION_TITLE,
    fields: normalizeEnquiryFieldConfig(entry?.fields),
  };
}

async function getEnquiryFieldConfigMap(): Promise<EnquiryFormConfigByType> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stored = await getKv<any>(ENQUIRY_FIELDS_KV_KEY);
  if (!stored) return {};
  // Very old legacy format: single array shared globally by every product type.
  if (Array.isArray(stored)) return { __default__: normalizeStoredEnquiryEntry(stored) };
  const map: EnquiryFormConfigByType = {};
  for (const [key, value] of Object.entries(stored)) {
    map[key] = normalizeStoredEnquiryEntry(value);
  }
  return map;
}

export async function getEnquiryFieldConfig(productType: string): Promise<EnquiryFormConfig> {
  const map = await getEnquiryFieldConfigMap();
  const stored = map[productType] ?? map.__default__;
  if (stored) return stored;
  // A product type with Extra Enquiry on but no explicitly saved config yet
  // starts pre-filled with the standard motor/pump field set (as it always
  // has) so existing product types don't lose their enquiry fields — the
  // admin can still add, remove, or clear them via the field builder.
  const types = await getProductTypes();
  const isExtraEnquiry = types.find((t) => t.name === productType)?.isExtraEnquiry ?? false;
  return {
    title: DEFAULT_ENQUIRY_SECTION_TITLE,
    fields: isExtraEnquiry ? legacyDefaultEnquiryFieldConfig() : [],
  };
}

export async function saveEnquiryFieldConfig(
  productType: string,
  title: string,
  fields: EnquiryFieldConfig[]
): Promise<EnquiryFormConfig> {
  const normalized: EnquiryFormConfig = {
    title: title.trim() || DEFAULT_ENQUIRY_SECTION_TITLE,
    fields: normalizeEnquiryFieldConfig(fields),
  };
  const map = await getEnquiryFieldConfigMap();
  map[productType] = normalized;
  await setKv(ENQUIRY_FIELDS_KV_KEY, map);
  return normalized;
}

const STORAGE_ALERT_KV_KEY = "storage_alert_state";

export async function getStorageAlertThreshold(): Promise<number> {
  const state = await getKv<{ lastNotifiedThreshold: number }>(STORAGE_ALERT_KV_KEY);
  return state?.lastNotifiedThreshold ?? 0;
}

export async function setStorageAlertThreshold(threshold: number): Promise<void> {
  await setKv(STORAGE_ALERT_KV_KEY, { lastNotifiedThreshold: threshold });
}

const OTP_KV_KEY = "admin_otp";
const OTP_TTL_MS = 5 * 60 * 1000;

export async function storeOtpHash(hash: string): Promise<void> {
  await setKv(OTP_KV_KEY, { hash, expiresAt: Date.now() + OTP_TTL_MS });
}

export async function getOtpHash(): Promise<{ hash: string; expiresAt: number } | undefined> {
  return getKv<{ hash: string; expiresAt: number }>(OTP_KV_KEY);
}

export async function clearOtp(): Promise<void> {
  await deleteKv(OTP_KV_KEY);
}

// ---------------------------------------------------------------------------
// Admin settings, login audit log, sessions
// ---------------------------------------------------------------------------

export async function getAdminPasswordHash(): Promise<string | undefined> {
  const rows = await sql`select password_hash from admin_settings where id = true limit 1`;
  return rows[0]?.password_hash as string | undefined;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  await sql`
    insert into admin_settings (id, password_hash, password_updated_at)
    values (true, ${hash}, now())
    on conflict (id) do update set password_hash = excluded.password_hash, password_updated_at = now()
  `;
}

export type AdminLoginEvent = {
  id: string;
  eventType: string;
  success: boolean;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
};

export async function logAdminLoginEvent(event: {
  eventType: string;
  success: boolean;
  ip: string | null;
  userAgent: string | null;
}): Promise<void> {
  await sql`
    insert into admin_login_events (event_type, success, ip, user_agent)
    values (${event.eventType}, ${event.success}, ${event.ip}, ${event.userAgent})
  `;
  await sql`delete from admin_login_events where created_at < now() - interval '3 months'`;
}

export async function getAdminLoginEvents(sinceMonths = 3): Promise<AdminLoginEvent[]> {
  const rows = await sql`
    select * from admin_login_events
    where created_at >= now() - (${sinceMonths}::text || ' months')::interval
    order by created_at desc
  `;
  return rows.map((row) => ({
    id: row.id,
    eventType: row.event_type,
    success: row.success,
    ip: row.ip ?? null,
    userAgent: row.user_agent ?? null,
    createdAt: new Date(row.created_at).toISOString(),
  }));
}

export type AdminSession = {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  ip: string | null;
  userAgent: string | null;
};

export async function createAdminSession(input: {
  tokenHash: string;
  expiresAt: Date;
  ip: string | null;
  userAgent: string | null;
}): Promise<string> {
  const rows = await sql`
    insert into admin_sessions (token_hash, expires_at, ip, user_agent)
    values (${input.tokenHash}, ${input.expiresAt.toISOString()}, ${input.ip}, ${input.userAgent})
    returning id
  `;
  return rows[0].id as string;
}

export async function getAdminSessionByTokenHash(
  tokenHash: string
): Promise<AdminSession | undefined> {
  const rows = await sql`
    select * from admin_sessions
    where token_hash = ${tokenHash} and revoked_at is null and expires_at > now()
    limit 1
  `;
  return rows[0] ? rowToAdminSession(rows[0]) : undefined;
}

export async function touchAdminSession(id: string): Promise<void> {
  await sql`
    update admin_sessions set last_seen_at = now()
    where id = ${id} and last_seen_at < now() - interval '60 seconds'
  `;
}

export async function listActiveAdminSessions(): Promise<AdminSession[]> {
  const rows = await sql`
    select * from admin_sessions
    where revoked_at is null and expires_at > now()
    order by last_seen_at desc
  `;
  return rows.map(rowToAdminSession);
}

export async function revokeAdminSession(id: string): Promise<void> {
  await sql`update admin_sessions set revoked_at = now() where id = ${id}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAdminSession(row: any): AdminSession {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).toISOString(),
    lastSeenAt: new Date(row.last_seen_at).toISOString(),
    expiresAt: new Date(row.expires_at).toISOString(),
    ip: row.ip ?? null,
    userAgent: row.user_agent ?? null,
  };
}
