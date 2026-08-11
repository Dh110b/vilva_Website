import { getEnquiries } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminEnquiriesPage() {
  const enquiries = getEnquiries();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="text-muted-foreground">No enquiries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tanks</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Pincode</TableHead>
                <TableHead>Motor Details</TableHead>
                <TableHead>Additional Requirements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{enquiry.productName}</TableCell>
                  <TableCell className="whitespace-nowrap">{enquiry.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{enquiry.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{enquiry.phone || "-"}</TableCell>
                  <TableCell>{enquiry.numberOfTanks || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">{enquiry.address}</TableCell>
                  <TableCell className="whitespace-nowrap">{enquiry.pincode}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="sm" />}>
                        View
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Motor &amp; Pump Details</DialogTitle>
                        </DialogHeader>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Sump / Motor Capacity</dt>
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
                            <dt className="text-muted-foreground">Sump / Bore / Both</dt>
                            <dd className="font-medium">{enquiry.waterSource || "Not provided"}</dd>
                          </div>
                        </dl>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{enquiry.message || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
