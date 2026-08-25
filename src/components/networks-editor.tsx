"use client";

import { useMemo, useState } from "react";
import { X, Plus, ChevronUp, ChevronDown, ArrowDownAZ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AreaCombobox } from "@/components/area-combobox";
import { toast } from "sonner";
import type { NetworkEntry } from "@/lib/networks";

export function NetworksEditor({
  networks,
  onNetworksChange,
}: {
  networks: NetworkEntry[];
  onNetworksChange: (next: NetworkEntry[]) => void;
}) {
  const [newArea, setNewArea] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editArea, setEditArea] = useState("");
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [newAreaFieldKey, setNewAreaFieldKey] = useState(0);

  const filteredNetworks = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return networks;
    return networks.filter(
      (n) =>
        n.area.toLowerCase().includes(q) ||
        n.name.toLowerCase().includes(q) ||
        n.address.toLowerCase().includes(q)
    );
  }, [networks, filterQuery]);

  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(networks.map((n) => n.area))).sort((a, b) => a.localeCompare(b));
  }, [networks]);

  const groupedByArea = useMemo(() => {
    const groups: { area: string; entries: NetworkEntry[] }[] = [];
    for (const entry of filteredNetworks) {
      const group = groups.find((g) => g.area === entry.area);
      if (group) group.entries.push(entry);
      else groups.push({ area: entry.area, entries: [entry] });
    }
    return groups;
  }, [filteredNetworks]);

  async function persistOrder(nextOrder: NetworkEntry[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/networks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: nextOrder.map((n) => n.id) }),
      });
      if (!res.ok) throw new Error("Failed");
      onNetworksChange(await res.json());
    } catch {
      toast.error("Failed to reorder networks");
    } finally {
      setBusy(false);
    }
  }

  function moveNetwork(id: string, direction: -1 | 1) {
    const index = networks.findIndex((n) => n.id === id);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= networks.length) return;
    const next = [...networks];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  function sortByArea() {
    const next = [...networks].sort(
      (a, b) => a.area.localeCompare(b.area) || a.name.localeCompare(b.name)
    );
    persistOrder(next);
  }

  async function addNetwork() {
    const area = newArea.trim();
    const name = newName.trim();
    if (!area || !name) return;
    setBusy(true);
    try {
      const res = await fetch("/api/networks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, name, address: newAddress.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      onNetworksChange(await res.json());
      setNewArea("");
      setNewName("");
      setNewAddress("");
      setNewAreaFieldKey((k) => k + 1);
    } catch {
      toast.error("Failed to add network");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(entry: NetworkEntry) {
    setEditingId(entry.id);
    setEditArea(entry.area);
    setEditName(entry.name);
    setEditAddress(entry.address);
  }

  async function saveEdit(id: string) {
    const area = editArea.trim();
    const name = editName.trim();
    setEditingId(null);
    if (!area || !name) return;
    setBusy(true);
    try {
      const res = await fetch("/api/networks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, area, name, address: editAddress.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      onNetworksChange(await res.json());
    } catch {
      toast.error("Failed to update network");
    } finally {
      setBusy(false);
    }
  }

  async function removeNetwork(id: string, label: string) {
    if (!confirm(`Delete network "${label}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/networks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onNetworksChange(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete network");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {networks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search by area, name, or address..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="h-8 min-w-[8rem] flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={sortByArea}
            className="shrink-0"
          >
            <ArrowDownAZ className="size-4" /> Sort by Area
          </Button>
        </div>
      )}

      {networks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No networks yet.</p>
      ) : filteredNetworks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No networks match &quot;{filterQuery}&quot;.</p>
      ) : (
        <div className="space-y-4">
          {groupedByArea.map((group) => (
            <div key={group.area}>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.area}
              </h3>
              <ul className="space-y-2">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="rounded-md border p-3 text-sm">
                    {editingId === entry.id ? (
                      <div className="space-y-2">
                        <AreaCombobox
                          areas={uniqueAreas}
                          value={editArea}
                          onChange={setEditArea}
                        />
                        <Input
                          placeholder="Dealer / Distributor name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <Textarea
                          placeholder="Address"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button type="button" size="sm" onClick={() => saveEdit(entry.id)} disabled={busy}>
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            disabled={busy}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col shrink-0 pt-0.5">
                          <button
                            type="button"
                            disabled={busy || !!filterQuery || networks[0]?.id === entry.id}
                            onClick={() => moveNetwork(entry.id, -1)}
                            className="disabled:opacity-30"
                            aria-label={`Move ${entry.name} up`}
                            title={filterQuery ? "Clear the search to reorder" : undefined}
                          >
                            <ChevronUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={busy || !!filterQuery || networks[networks.length - 1]?.id === entry.id}
                            onClick={() => moveNetwork(entry.id, 1)}
                            className="disabled:opacity-30"
                            aria-label={`Move ${entry.name} down`}
                            title={filterQuery ? "Clear the search to reorder" : undefined}
                          >
                            <ChevronDown className="size-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="flex-1 text-left hover:underline underline-offset-2"
                          onClick={() => startEdit(entry)}
                        >
                          <div className="font-medium">{entry.name}</div>
                          {entry.address && (
                            <div className="text-muted-foreground text-xs">{entry.address}</div>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeNetwork(entry.id, entry.name)}
                          className="text-muted-foreground hover:text-destructive shrink-0"
                          aria-label={`Delete ${entry.name}`}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 rounded-md border p-3">
        <AreaCombobox
          key={newAreaFieldKey}
          areas={uniqueAreas}
          value={newArea}
          onChange={setNewArea}
          placeholder="Select area"
        />
        <Input
          placeholder="Dealer / Distributor name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Textarea
          placeholder="Address"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <Button
          type="button"
          size="sm"
          onClick={addNetwork}
          disabled={busy || !newArea.trim() || !newName.trim()}
        >
          <Plus className="size-4" /> Add Network
        </Button>
      </div>
    </div>
  );
}
