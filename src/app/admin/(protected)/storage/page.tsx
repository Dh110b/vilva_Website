import { getStorageUsage } from "@/lib/supabase";
import { AdminStorageUsage } from "@/components/admin-storage-usage";

export default async function AdminStoragePage() {
  const storageUsage = await getStorageUsage().catch(() => ({
    usedBytes: 0,
    fileCount: 0,
    limitBytes: 0,
    files: [],
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Storage</h1>
      <AdminStorageUsage limitBytes={storageUsage.limitBytes} files={storageUsage.files} />
    </div>
  );
}
