"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SuggestedUsers from "@/components/home/SuggestedUsers";
import { parseJsonResponse } from "@/lib/parseJsonResponse";

const REQUIRED_FOLLOWS = 5;

export default function FollowOnboardingPanel({
  followingCount,
  suggestedUsers,
  currentLoggedInUser,
  onFollowChange,
  onComplete,
  setCurrentLoggedInUser,
}) {
  const [submitting, setSubmitting] = useState(false);

  const progress = Math.min(followingCount, REQUIRED_FOLLOWS);
  const progressPct = (progress / REQUIRED_FOLLOWS) * 100;
  const canContinue = followingCount >= REQUIRED_FOLLOWS;

  const handleContinue = async () => {
    if (!canContinue) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/onboarding", { method: "POST" });
      const data = await parseJsonResponse(res, {});
      if (!res.ok) {
        toast.error(data.error || "Follow at least 5 people to continue");
        return;
      }
      setCurrentLoggedInUser?.((prev) =>
        prev ? { ...prev, followOnboardingCompleted: true } : prev
      );
      toast.success("You're all set — welcome to LineOne!");
      await onComplete?.(data);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-border/80 bg-card/90 shadow-lg backdrop-blur-sm p-5 sm:p-6">
        <Badge
          variant="secondary"
          className="mb-3 bg-[#ff6500]/15 text-[#ff6500] border-[#ff6500]/30"
        >
          Step 2 · Build your feed
        </Badge>
        <h2 className="text-xl sm:text-2xl font-semibold">
          Follow 5 people to get started
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {canContinue
            ? "You follow enough people — tap Continue to open your feed."
            : "Your Following tab shows posts from people you follow. Pick at least five below."}
        </p>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>
              {progress} of {REQUIRED_FOLLOWS} followed
            </span>
            <span className="text-[#ff6500]">
              {canContinue ? "Ready!" : `${REQUIRED_FOLLOWS - progress} to go`}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-[#ff6500] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <Button
          type="button"
          disabled={!canContinue || submitting}
          onClick={handleContinue}
          className="mt-5 w-full sm:w-auto sm:min-w-[220px] bg-[#ff6500] hover:bg-[#ff5f00] text-white disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Continue to feed"}
        </Button>
      </div>

      {!canContinue ? (
        <SuggestedUsers
          users={suggestedUsers}
          currentLoggedInUser={currentLoggedInUser}
          onFollowChange={onFollowChange}
          hideSeeAll
          title="Suggested for you"
        />
      ) : (
        <p className="text-sm text-muted-foreground mt-4 px-1">
          Discover shows public posts from across LineOne — available after you
          continue.
        </p>
      )}
    </div>
  );
}
