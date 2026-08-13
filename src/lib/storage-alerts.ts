import { getStorageUsage } from "@/lib/supabase";
import { getStorageAlertThreshold, setStorageAlertThreshold } from "@/lib/data";
import { sendStorageAlertEmail } from "@/lib/mail";

const THRESHOLDS = [100, 95, 90, 80, 50];

export async function checkStorageAlerts(): Promise<void> {
  try {
    const { usedBytes, limitBytes } = await getStorageUsage();
    if (limitBytes <= 0) return;

    const percent = (usedBytes / limitBytes) * 100;
    const currentThreshold = THRESHOLDS.find((t) => percent >= t) ?? 0;
    const lastNotified = await getStorageAlertThreshold();

    if (currentThreshold === lastNotified) return;

    if (currentThreshold > lastNotified) {
      await sendStorageAlertEmail({ threshold: currentThreshold, percent, usedBytes, limitBytes });
    }
    await setStorageAlertThreshold(currentThreshold);
  } catch (err) {
    console.error("Failed to check storage alerts", err);
  }
}
