import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <nav className="flex gap-4">
          <Link href="/admin" className="font-medium hover:underline">
            Products
          </Link>
          <Link href="/admin/enquiries" className="font-medium hover:underline">
            Enquiries
          </Link>
          <Link href="/admin/enquiry-form" className="font-medium hover:underline">
            Send Enquiry Form
          </Link>
        </nav>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
