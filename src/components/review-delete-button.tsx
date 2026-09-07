"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      toast.success("Review deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs font-medium text-destructive hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Delete this review?</span>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={deleting}
        onClick={handleDelete}
      >
        {deleting ? "Deleting..." : "Confirm"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        disabled={deleting}
        onClick={() => setConfirming(false)}
      >
        Cancel
      </Button>
    </div>
  );
}
