import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/auth";
import { Navbar1 } from "@/components/ui/navbar-1";

export async function SiteHeader() {
  const cookieStore = await cookies();
  const isAuthed = isValidSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  return <Navbar1 isAuthed={isAuthed} />;
}
