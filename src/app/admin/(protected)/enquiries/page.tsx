import { getEnquiries } from "@/lib/data";
import { AdminEnquiriesBrowser } from "@/components/admin-enquiries-browser";

export default function AdminEnquiriesPage() {
  const enquiries = getEnquiries();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="text-muted-foreground">No enquiries yet.</p>
      ) : (
        <AdminEnquiriesBrowser enquiries={enquiries} />
      )}
    </div>
  );
}
