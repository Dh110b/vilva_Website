import type { Enquiry } from "@/lib/data";

export async function sendEnquiryEmail(enquiry: Enquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || "onboarding@resend.dev",
        to,
        subject: `New enquiry: ${enquiry.productName}`,
        html: `
          <p><strong>Product:</strong> ${enquiry.productName}</p>
          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone || "-"}</p>
          <p><strong>No. of Overhead Tanks:</strong> ${enquiry.numberOfTanks || "-"}</p>
          <p><strong>Address:</strong> ${enquiry.address}</p>
          <p><strong>Pincode:</strong> ${enquiry.pincode}</p>
          <p><strong>Sump / Motor Capacity:</strong> ${enquiry.sumpOrBoreCapacity || "-"}</p>
          <p><strong>No. of Motors:</strong> ${enquiry.numberOfMotors || "-"}</p>
          <p><strong>Motor Phase Type:</strong> ${enquiry.motorPhaseType || "-"}</p>
          <p><strong>Motor Type:</strong> ${enquiry.motorType || "-"}</p>
          <p><strong>Starter Type:</strong> ${enquiry.starterType || "-"}</p>
          <p><strong>Sump / Bore / Both:</strong> ${enquiry.waterSource || "-"}</p>
          <p><strong>Additional Requirements:</strong> ${enquiry.message || "-"}</p>
        `,
      }),
    });
  } catch (err) {
    console.error("Failed to send enquiry email", err);
  }
}
