import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | undefined;

export function getSupabaseAdmin() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables");
  }
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}

export const UPLOADS_BUCKET = "uploads";

// Supabase free tier storage quota is 1GB; override via env if on a paid plan.
export const STORAGE_LIMIT_BYTES =
  Number(process.env.SUPABASE_STORAGE_LIMIT_MB || 1024) * 1024 * 1024;

export async function getStorageUsage() {
  const supabase = getSupabaseAdmin();
  let usedBytes = 0;
  let fileCount = 0;
  let offset = 0;
  const limit = 1000;

  for (;;) {
    const { data, error } = await supabase.storage.from(UPLOADS_BUCKET).list("", {
      limit,
      offset,
    });
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      const size = (item.metadata as { size?: number } | null)?.size;
      if (typeof size === "number") {
        usedBytes += size;
        fileCount += 1;
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return {
    usedBytes,
    fileCount,
    limitBytes: STORAGE_LIMIT_BYTES,
  };
}
