"use client";

import { useState } from "react";
import { NetworksEditor } from "@/components/networks-editor";
import type { NetworkEntry } from "@/lib/networks";

export function AdminNetworks({ initialNetworks }: { initialNetworks: NetworkEntry[] }) {
  const [networks, setNetworks] = useState(initialNetworks);

  return <NetworksEditor networks={networks} onNetworksChange={setNetworks} />;
}
