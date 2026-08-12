import type { Enquiry } from "@/lib/data";

const ADMIN_OTP_EMAIL = process.env.ADMIN_OTP_EMAIL || "manjushreeenterprisesblr@gmail.com";

export async function sendAdminOtpEmail(otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; admin login OTP:", otp);
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL || "onboarding@resend.dev",
        to: ADMIN_OTP_EMAIL,
        subject: "Your Vilva Admin login code",
        html: `
          <p>Your one-time login code is:</p>
          <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p>
          <p>This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
        `,
      }),
    });
  } catch (err) {
    console.error("Failed to send admin OTP email", err);
  }
}

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
          <p><strong>Motor Capacity:</strong> ${enquiry.sumpOrBoreCapacity || "-"}</p>
          <p><strong>No. of Motors:</strong> ${enquiry.numberOfMotors || "-"}</p>
          <p><strong>Motor Phase Type:</strong> ${enquiry.motorPhaseType || "-"}</p>
          <p><strong>Motor Type:</strong> ${enquiry.motorType || "-"}</p>
          <p><strong>Starter Type:</strong> ${enquiry.starterType || "-"}</p>
          <p><strong>Water Source:</strong> ${enquiry.waterSource || "-"}</p>
          <p><strong>Unit Type:</strong> ${enquiry.unitType || enquiry.timerType || "-"}</p>
          <p><strong>Additional Requirements:</strong> ${enquiry.message || "-"}</p>
        `,
      }),
    });
  } catch (err) {
    console.error("Failed to send enquiry email", err);
  }
}
