"use client";

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { Enquiry } from "@/lib/data";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/enquiry-status";
import { cn } from "@/lib/utils";
import { useEnquiryFieldConfig } from "@/hooks/use-enquiry-field-config";

type SortOption = "newest" | "oldest" | "name-asc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name: A-Z" },
];

const statusStyles: Record<EnquiryStatus, string> = {
  New: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  Pending: "bg-warning/20 text-warning-foreground border-warning/40",
  Done: "bg-success/20 text-success-foreground border-success/40",
  Cancelled: "bg-destructive/20 text-destructive-foreground border-destructive/40",
};

export function AdminEnquiriesBrowser({ enquiries: initial }: { enquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "all">("all");
  const [productFilter, setProductFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { config: fieldConfig } = useEnquiryFieldConfig();
  const customFieldLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const field of fieldConfig) {
      if (field.custom) map.set(field.key, field.label);
    }
    return map;
  }, [fieldConfig]);

  const products = useMemo(
    () => Array.from(new Set(enquiries.map((e) => e.productName))).sort(),
    [enquiries]
  );

  const filtered = useMemo(() => {
    let result = enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (productFilter !== "all" && e.productName !== productFilter) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [enquiries, statusFilter, productFilter, sort]);

  function exportToExcel() {
    const customFieldKeys = Array.from(
      new Set(filtered.flatMap((e) => Object.keys(e.customFields ?? {})))
    );

    const headers = [
      "Date",
      "Time",
      "Product",
      "Name",
      "Email",
      "Phone",
      "Address",
      "Pincode",
      "Status",
      "Motor Capacity",
      "No. of Motors",
      "Motor Phase Type",
      "Motor Type",
      "Starter Type",
      "Water Source",
      "Unit Type",
      "No. of Overhead Tanks",
      ...customFieldKeys.map((key) => customFieldLabels.get(key) ?? key),
      "Additional Requirements",
    ];

    function escapeCell(value: unknown): string {
      const text = value === undefined || value === null ? "" : String(value);
      if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
      return text;
    }

    const rows = filtered.map((enquiry) => {
      const createdAt = new Date(enquiry.createdAt);
      return [
        createdAt.toLocaleDateString("en-US"),
        createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        enquiry.productName,
        enquiry.name,
        enquiry.email,
        enquiry.phone || "",
        enquiry.address,
        enquiry.pincode,
        enquiry.status,
        enquiry.sumpOrBoreCapacity || "",
        enquiry.numberOfMotors || "",
        enquiry.motorPhaseType || "",
        enquiry.motorType || "",
        enquiry.starterType || "",
        enquiry.waterSource || "",
        enquiry.unitType || enquiry.timerType || "",
        enquiry.numberOfTanks || "",
        ...customFieldKeys.map((key) => enquiry.customFields?.[key] ?? ""),
        enquiry.message || "",
      ];
    });

    const csv =
      "﻿" +
      [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function changeStatus(id: string, status: EnquiryStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeEnquiry(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All ({enquiries.length})
          </Button>
          {ENQUIRY_STATUSES.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
            >
              {status} ({enquiries.filter((e) => e.status === status).length})
            </Button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Select value={productFilter} onValueChange={(v) => setProductFilter(v ?? "all")}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Select value={sort} onValueChange={(v) => setSort((v as SortOption) ?? "newest")}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={exportToExcel}>
            <Download className="size-4" /> Export to Excel
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No enquiries match these filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((enquiry) => {
                const createdAt = new Date(enquiry.createdAt);
                const dateLabel = createdAt.toLocaleDateString("en-US");
                const timeLabel = createdAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Dialog key={enquiry.id}>
                    <DialogTrigger
                      render={<TableRow className="cursor-pointer hover:bg-muted/50" />}
                      nativeButton={false}
                    >
                      <TableCell className="whitespace-nowrap">{dateLabel}</TableCell>
                      <TableCell className="whitespace-nowrap">{timeLabel}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {enquiry.productName}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{enquiry.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{enquiry.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{enquiry.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("whitespace-nowrap", statusStyles[enquiry.status])}
                        >
                          {enquiry.status}
                        </Badge>
                      </TableCell>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg" initialFocus={false}>
                      <DialogHeader>
                        <DialogTitle>Enquiry from {enquiry.name}</DialogTitle>
                      </DialogHeader>

                      <div
                        className="space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-sm font-medium">Status</p>
                        <Select
                          value={enquiry.status}
                          onValueChange={(value) =>
                            value && changeStatus(enquiry.id, value as EnquiryStatus)
                          }
                        >
                          <SelectTrigger
                            className="w-48"
                            disabled={updatingId === enquiry.id}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ENQUIRY_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Date</dt>
                          <dd className="font-medium">{dateLabel}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Time</dt>
                          <dd className="font-medium">{timeLabel}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Product</dt>
                          <dd className="font-medium">{enquiry.productName}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Phone</dt>
                          <dd className="font-medium">{enquiry.phone || "Not provided"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Email</dt>
                          <dd className="font-medium break-all">{enquiry.email}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Pincode</dt>
                          <dd className="font-medium">{enquiry.pincode}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-muted-foreground">Address</dt>
                          <dd className="font-medium">{enquiry.address}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">No. of Overhead Tanks</dt>
                          <dd className="font-medium">{enquiry.numberOfTanks || "Not provided"}</dd>
                        </div>
                      </dl>

                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Motor &amp; Pump Details</p>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Motor Capacity</dt>
                            <dd className="font-medium">{enquiry.sumpOrBoreCapacity || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">No. of Motors</dt>
                            <dd className="font-medium">{enquiry.numberOfMotors || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Motor Phase Type</dt>
                            <dd className="font-medium">{enquiry.motorPhaseType || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Motor Type</dt>
                            <dd className="font-medium">{enquiry.motorType || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Starter Type</dt>
                            <dd className="font-medium">{enquiry.starterType || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Water Source</dt>
                            <dd className="font-medium">{enquiry.waterSource || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Unit Type</dt>
                            <dd className="font-medium">
                              {enquiry.unitType || enquiry.timerType || "Not provided"}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {enquiry.customFields && Object.keys(enquiry.customFields).length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">Custom Fields</p>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            {Object.entries(enquiry.customFields).map(([key, value]) => (
                              <div key={key}>
                                <dt className="text-muted-foreground">
                                  {customFieldLabels.get(key) ?? key}
                                </dt>
                                <dd className="font-medium">{value || "Not provided"}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-1">Additional Requirements</p>
                        <p className="text-sm text-muted-foreground">
                          {enquiry.message || "Not provided"}
                        </p>
                      </div>

                      <DialogFooter className="sm:justify-between">
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={deletingId === enquiry.id}
                          onClick={() => {
                            if (confirm("Delete this enquiry? This cannot be undone.")) {
                              removeEnquiry(enquiry.id);
                            }
                          }}
                        >
                          {deletingId === enquiry.id ? "Deleting..." : "Delete"}
                        </Button>
                        <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
