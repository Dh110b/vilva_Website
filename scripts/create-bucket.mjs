import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets.some((b) => b.name === "uploads")) {
    console.log("Bucket 'uploads' already exists.");
    return;
  }

  const { error } = await supabase.storage.createBucket("uploads", {
    public: true,
    fileSizeLimit: "10MB",
  });
  if (error) throw error;
  console.log("Created public bucket 'uploads'.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
