"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import type { StorageFile } from "@/lib/supabase";
import type { ImageUsage } from "@/lib/data";

type StorageFileWithUsage = StorageFile & { usage: ImageUsage[] };

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

export function AdminStorageUsage({
  limitBytes,
  files: initialFiles,
}: {
  limitBytes: number;
  files: StorageFileWithUsage[];
}) {
  const [files, setFiles] = useState(initialFiles);
  const [deletingName, setDeletingName] = useState<string | null>(null);

  const usedBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);
  const fileCount = files.length;
  const percent = limitBytes > 0 ? Math.min(100, (usedBytes / limitBytes) * 100) : 0;

  const barColor =
    percent >= 100
      ? "bg-destructive"
      : percent >= 95
        ? "bg-red-600"
        : percent >= 90
          ? "bg-orange-600"
          : percent >= 80
            ? "bg-orange-400"
            : percent >= 50
              ? "bg-yellow-400"
              : "bg-primary";

  async function removeFile(name: string) {
    if (!confirm(`Delete "${name}" from storage? This cannot be undone.`)) return;
    setDeletingName(name);
    try {
      const res = await fetch("/api/storage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed");
      setFiles((prev) => prev.filter((f) => f.name !== name));
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setDeletingName(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-foreground/25 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5">
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between mb-2 text-sm">
            <span>
              {formatBytes(usedBytes)} of {formatBytes(limitBytes)} used
            </span>
            <span className="text-muted-foreground">{fileCount} files</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-colors ${barColor}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{percent.toFixed(1)}% used</p>
        </CardContent>
      </Card>

      <Card className="border-foreground/25 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/5">
        <CardHeader>
          <CardTitle>What&apos;s taking up space</CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files in storage.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>In use</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.name}>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {file.name}
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatBytes(file.sizeBytes)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {file.updatedAt
                          ? new Date(file.updatedAt).toLocaleDateString("en-US", {
                              dateStyle: "medium",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {file.updatedAt
                          ? new Date(file.updatedAt).toLocaleTimeString("en-US", {
                              timeStyle: "short",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="min-w-[10rem]">
                        {file.usage.length === 0 ? (
                          <Badge variant="outline">No</Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge>Yes</Badge>
                            <ul className="space-y-0.5">
                              {file.usage.map((u, i) => (
                                <li key={i} className="text-xs">
                                  <Link href={u.href} className="hover:underline">
                                    {u.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingName === file.name}
                          onClick={() => removeFile(file.name)}
                        >
                          {deletingName === file.name ? "Deleting..." : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
