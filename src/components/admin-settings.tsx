"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminLoginEvent, AdminSession } from "@/lib/data";
import { parseUserAgent } from "@/lib/parse-user-agent";

type SessionRow = AdminSession & { isCurrent: boolean };

export function AdminSettings({
  currentSessionId,
  sessions: initialSessions,
  loginEvents,
}: {
  currentSessionId: string | null;
  sessions: SessionRow[];
  loginEvents: AdminLoginEvent[];
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  async function revokeSession(sessionId: string) {
    if (!confirm("Log out this device?")) return;
    setRevokingId(sessionId);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error("Failed");
      if (sessionId === currentSessionId) {
        router.push("/admin/login");
        router.refresh();
        return;
      }
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Device logged out");
    } catch {
      toast.error("Failed to log out device");
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/30 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? "Changing..." : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/30 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <CardHeader>
          <CardTitle>Active devices</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Last active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="whitespace-nowrap">
                        {parseUserAgent(s.userAgent)}
                        {s.isCurrent && (
                          <Badge variant="secondary" className="ml-2">
                            This device
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{s.ip ?? "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(s.lastSeenAt).toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={revokingId === s.id}
                          onClick={() => revokeSession(s.id)}
                        >
                          {revokingId === s.id ? "Logging out..." : "Log out"}
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

      <Card className="border-white/30 bg-white/10 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <CardHeader>
          <CardTitle>Login history (last 3 months)</CardTitle>
        </CardHeader>
        <CardContent>
          {loginEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No login events recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleString("en-US")}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {event.eventType.startsWith("password") ? "Password" : "OTP"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.success ? "secondary" : "destructive"}>
                          {event.success ? "Success" : "Failure"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{event.ip ?? "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {parseUserAgent(event.userAgent)}
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
