import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="sticky top-0 z-40 flex justify-center w-full py-3 px-4">
        <div className="flex items-center justify-between gap-4 px-5 py-2 border border-white/30 bg-white/10 backdrop-blur-md rounded-full shadow-lg w-full max-w-6xl dark:border-white/10 dark:bg-white/5">
          <Link href="/admin" className="font-semibold text-lg shrink-0 mr-2">
            Vilva Admin
          </Link>
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Link href="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/admin/enquiries" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Enquiries
            </Link>
            <Link href="/admin/enquiry-form" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Send Enquiry Form
            </Link>
            <Link href="/admin/storage" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Storage
            </Link>
            <Link href="/admin/settings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Settings
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <nav className="flex md:hidden flex-wrap gap-4 mb-6">
          <Link href="/admin" className="text-sm font-medium hover:underline">
            Products
          </Link>
          <Link href="/admin/enquiries" className="text-sm font-medium hover:underline">
            Enquiries
          </Link>
          <Link href="/admin/enquiry-form" className="text-sm font-medium hover:underline">
            Send Enquiry Form
          </Link>
          <Link href="/admin/storage" className="text-sm font-medium hover:underline">
            Storage
          </Link>
          <Link href="/admin/settings" className="text-sm font-medium hover:underline">
            Settings
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
