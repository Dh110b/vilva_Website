"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { NetworkEntry } from "@/lib/networks";

export function NetworksDirectory({ networks }: { networks: NetworkEntry[] }) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? networks.filter(
          (n) =>
            n.area.toLowerCase().includes(q) ||
            n.name.toLowerCase().includes(q) ||
            n.address.toLowerCase().includes(q)
        )
      : networks;

    const result: { area: string; entries: NetworkEntry[] }[] = [];
    for (const entry of filtered) {
      const group = result.find((g) => g.area === entry.area);
      if (group) group.entries.push(entry);
      else result.push({ area: entry.area, entries: [entry] });
    }
    return result;
  }, [networks, query]);

  return (
    <div>
      {networks.length > 0 && (
        <div className="relative mb-8">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by area, dealer, or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {networks.length === 0 ? (
        <p className="text-muted-foreground">No network entries yet.</p>
      ) : groups.length === 0 ? (
        <p className="text-muted-foreground">No network entries match &quot;{query}&quot;.</p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.area}>
              <h2 className="mb-3 text-lg font-semibold text-primary">{group.area}</h2>
              <div className="space-y-4">
                {group.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-foreground/25 bg-white/10 p-6 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5"
                  >
                    <div className="font-medium">{entry.name}</div>
                    {entry.address && (
                      <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{entry.address}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
