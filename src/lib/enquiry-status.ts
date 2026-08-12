export const ENQUIRY_STATUSES = ["New", "Pending", "Done", "Cancelled"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
