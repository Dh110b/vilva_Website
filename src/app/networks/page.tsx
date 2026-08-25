import type { Metadata } from "next";
import { getNetworks } from "@/lib/data";
import { NetworksDirectory } from "@/components/networks-directory";

export const metadata: Metadata = {
  title: "Networks",
  description:
    "Find Vilva's dealer and distributor network across regions for product sales and support.",
  alternates: { canonical: "/networks" },
};

export default async function NetworksPage() {
  const networks = await getNetworks();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Our Network</h1>
      <NetworksDirectory networks={networks} />
    </div>
  );
}
