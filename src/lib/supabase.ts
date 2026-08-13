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

export type StorageFile = {
  name: string;
  sizeBytes: number;
  updatedAt: string | null;
  url: string;
};

export async function getStorageUsage() {
  const supabase = getSupabaseAdmin();
  const files: StorageFile[] = [];
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
        files.push({
          name: item.name,
          sizeBytes: size,
          updatedAt: item.updated_at ?? null,
          url: supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(item.name).data.publicUrl,
        });
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  files.sort((a, b) => b.sizeBytes - a.sizeBytes);

  return {
    usedBytes: files.reduce((sum, f) => sum + f.sizeBytes, 0),
    fileCount: files.length,
    limitBytes: STORAGE_LIMIT_BYTES,
    files,
  };
}

export async function deleteStorageFiles(names: string[]) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(UPLOADS_BUCKET).remove(names);
  if (error) throw error;
}
