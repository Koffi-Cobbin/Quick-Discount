import { useState } from "react";
import StarDisplay from "../Shared/StarDisplay";
import ReplyBox from "./ReplyBox"; 

export default function ReviewItem({
  review,
  isOrganizer = false,

  // Actions
  onVote,
  onReplyAdd,

  // UI / behavior config
  maxContentLength = 200,
  defaultRepliesOpen = true,

  // Utilities
  formatTime,

  // Optional component injection
  ReplyComponent,

  // Labels
  labels = {},
}) {
  const {
    helpfulLabel = "Was this helpful?",
    readMore = "read more",
    showLess = "show less",
    showReplies = "Show",
    hideReplies = "Hide",
  } = labels;

  const [localReview, setLocalReview] = useState(review);
  const [voted, setVoted] = useState(null);
  const [repliesOpen, setRepliesOpen] = useState(defaultRepliesOpen);
  const [expanded, setExpanded] = useState(false);

  const isLong = localReview.content.length > maxContentLength;

  const handleVote = async (type) => {
    if (voted) return;

    setVoted(type);

    // optimistic update
    setLocalReview((r) => ({
      ...r,
      helpful_count:
        type === "helpful" ? r.helpful_count + 1 : r.helpful_count,
      unhelpful_count:
        type === "unhelpful" ? r.unhelpful_count + 1 : r.unhelpful_count,
    }));

    try {
      await onVote?.(type, localReview);
    } catch {
      // rollback on failure
      setLocalReview(review);
      setVoted(null);
    }
  };

  const handleReplyAdded = (reply) => {
    const updated = {
      ...localReview,
      replies: [...localReview.replies, reply],
    };

    setLocalReview(updated);
    setRepliesOpen(true);

    onReplyAdd?.(reply, updated);
  };

  const displayContent =
    isLong && !expanded
      ? localReview.content.slice(0, maxContentLength) + "…"
      : localReview.content;

  return (
    <div
      style={{
        padding: "20px 0",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "var(--avatar-bg, #eee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 500,
            fontSize: 13,
          }}
        >
          {localReview.user.initials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
            <span style={{ fontWeight: 500 }}>
              {localReview.user.name}
            </span>

            {localReview.is_verified_purchase && (
              <span style={{ fontSize: 11 }}>
                Verified purchase
              </span>
            )}

            <span style={{ marginLeft: "auto", fontSize: 12 }}>
              {formatTime?.(localReview.created_at)}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <StarDisplay rating={localReview.rating} size={14} />
            <span style={{ fontSize: 12 }}>
              {localReview.rating}/5
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <p style={{ fontWeight: 500 }}>{localReview.title}</p>

      {/* Content */}
      <p style={{ lineHeight: 1.6 }}>
        {displayContent}

        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{ marginLeft: 4 }}
          >
            {expanded ? showLess : readMore}
          </button>
        )}
      </p>

      {/* Voting */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 12 }}>{helpfulLabel}</span>

        <button onClick={() => handleVote("helpful")}>
          👍 {localReview.helpful_count}
        </button>

        <button onClick={() => handleVote("unhelpful")}>
          👎 {localReview.unhelpful_count}
        </button>
      </div>

      {/* Replies */}
      {localReview.replies?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setRepliesOpen((v) => !v)}>
            {repliesOpen ? hideReplies : showReplies}{" "}
            {localReview.replies.length}{" "}
            {localReview.replies.length === 1 ? "reply" : "replies"}
          </button>

          {repliesOpen &&
            localReview.replies.map((rep) => (
              <div
                key={rep.id}
                style={{
                  marginTop: 10,
                  marginLeft: 16,
                  padding: 12,
                  background: "var(--color-background-secondary)",
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <strong>{rep.author}</strong>
                  <span style={{ marginLeft: "auto", fontSize: 11 }}>
                    {formatTime?.(rep.created_at)}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{rep.content}</p>
              </div>
            ))}
        </div>
      )}

      {/* Reply Box */}
      {ReplyComponent && (
        <div style={{ marginTop: 10 }}>
          <ReplyComponent
            reviewId={localReview.id}
            isOrganizer={isOrganizer}
            onReplyAdded={handleReplyAdded}
          />
        </div>
      )}
    </div>
  );
}