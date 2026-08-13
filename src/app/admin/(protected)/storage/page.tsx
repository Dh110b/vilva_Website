import { getStorageUsage } from "@/lib/supabase";
import { getAllUsedImageUrls, type ImageUsage } from "@/lib/data";
import { AdminStorageUsage } from "@/components/admin-storage-usage";

export default async function AdminStoragePage() {
  const [storageUsage, usedUrls] = await Promise.all([
    getStorageUsage().catch(() => ({
      usedBytes: 0,
      fileCount: 0,
      limitBytes: 0,
      files: [],
    })),
    getAllUsedImageUrls().catch(() => new Map<string, ImageUsage[]>()),
  ]);

  const files = storageUsage.files.map((file) => ({
    ...file,
    usage: usedUrls.get(file.url) ?? [],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Storage</h1>
      <AdminStorageUsage limitBytes={storageUsage.limitBytes} files={files} />
    </div>
  );
}
