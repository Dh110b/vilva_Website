import { getNetworks } from "@/lib/data";
import { AdminNetworks } from "@/components/admin-networks";

export default async function AdminNetworksPage() {
  const networks = await getNetworks();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Network</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Manage the dealer / distributor network shown on the public Networks page.
      </p>
      <AdminNetworks initialNetworks={networks} />
    </div>
  );
}
