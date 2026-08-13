import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, UPLOADS_BUCKET } from "@/lib/supabase";
import { checkStorageAlerts } from "@/lib/storage-alerts";

const maxSizeBytes = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeExt(name: string) {
  const match = name.toLowerCase().match(/\.[a-z0-9]{1,10}$/);
  return match ? match[0] : "";
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > maxSizeBytes) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = safeExt(file.name);
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(filename);

  await checkStorageAlerts();

  return NextResponse.json({ url: data.publicUrl });
}
