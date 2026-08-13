import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { getAdminLoginEvents, listActiveAdminSessions } from "@/lib/data";
import { AdminSettings } from "@/components/admin-settings";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const session = await isValidSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  const [sessions, loginEvents] = await Promise.all([
    listActiveAdminSessions(),
    getAdminLoginEvents(3),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <AdminSettings
        currentSessionId={session?.id ?? null}
        sessions={sessions.map((s) => ({ ...s, isCurrent: s.id === session?.id }))}
        loginEvents={loginEvents}
      />
    </div>
  );
}
