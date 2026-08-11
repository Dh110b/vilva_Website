import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { ReviewReplyForm } from "@/components/review-reply-form";
import type { Review } from "@/lib/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewList({
  reviews,
  isAuthed = false,
}: {
  reviews: Review[];
  isAuthed?: boolean;
}) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet. Be the first to share your experience.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-medium">{review.name}</span>
              <StarRating value={review.rating} size="sm" />
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {review.description}
          </p>
          {review.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.images.map((img, i) => (
                <div key={img} className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
                  <Image src={img} alt={`${review.name} review photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {review.replies.length > 0 && (
            <div className="mt-4 ml-4 space-y-3 border-l-2 border-border pl-4">
              {review.replies.map((reply) => (
                <div key={reply.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{reply.name}</span>
                    {reply.isOwner && (
                      <Badge variant="default" className="text-[10px]">
                        Owner
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                    {reply.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 ml-4">
            <ReviewReplyForm reviewId={review.id} isAuthed={isAuthed} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewSummary({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="flex items-center gap-2">
      <StarRating value={Math.round(average)} size="sm" />
      <span className="text-sm text-muted-foreground">
        {average.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? "" : "s"})
      </span>
    </div>
  );
}
