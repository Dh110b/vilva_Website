import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

export function AdminStorageUsage({
  usedBytes,
  limitBytes,
  fileCount,
}: {
  usedBytes: number;
  limitBytes: number;
  fileCount: number;
}) {
  const percent = limitBytes > 0 ? Math.min(100, (usedBytes / limitBytes) * 100) : 0;
  const nearLimit = percent >= 90;

  return (
    <Card className="border-white/30 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
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
            className={`h-full rounded-full ${nearLimit ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{percent.toFixed(1)}% used</p>
      </CardContent>
    </Card>
  );
}
