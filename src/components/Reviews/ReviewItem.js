import { useState } from "react";
import styled from "styled-components";
import StarDisplay from "../Shared/StarDisplay";
import { getReviewerInitials } from "../../utils/middleware";

/* =======================
   Styled Components
======================= */

const Container = styled.div`
  padding: 20px 0;
  border-bottom: 0.5px solid var(--color-border-tertiary);
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--avatar-bg, #eee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 13px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TopRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 3px;
  align-items: center;
`;

const Name = styled.span`
  font-weight: 500;
`;

const VerifiedBadge = styled.span`
  font-size: 11px;
`;

const Time = styled.span`
  margin-left: auto;
  font-size: 12px;
`;

const RatingRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Title = styled.p`
  font-weight: 500;
  margin: 0 0 6px;
`;

const Content = styled.p`
  line-height: 1.6;
  margin: 0 0 12px;
`;

const InlineButton = styled.button`
  margin-left: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
`;

const VoteRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const VoteButton = styled.button`
  cursor: pointer;
  color: var(--color-text-secondary);
`;

const RepliesSection = styled.div`
  margin-top: 12px;
`;

const ToggleRepliesButton = styled.button`
  cursor: pointer;
`;

const ReplyItem = styled.div`
  margin-top: 10px;
  margin-left: 16px;
  padding: 12px;
  background: var(--color-background-secondary);
`;

const ReplyHeader = styled.div`
  display: flex;
  gap: 8px;
`;

const ReplyAuthor = styled.strong``;

const ReplyTime = styled.span`
  margin-left: auto;
  font-size: 11px;
`;

const ReplyContent = styled.p`
  margin: 0;
`;

const ReplyBoxWrapper = styled.div`
  margin-top: 10px;
`;

/* =======================
   Component
======================= */

export default function ReviewItem({
  review,
  isOrganizer = false,

  onVote,
  onReplyAdd,

  maxContentLength = 200,
  defaultRepliesOpen = true,

  formatTime,
  ReplyComponent,

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
    <Container>
      {/* Header */}
      <Header>
        <Avatar>
          {getReviewerInitials(localReview.reviewer_name)}
        </Avatar>

        <HeaderContent>
          <TopRow>
            <Name>{localReview.reviewer_name}</Name>

            {localReview.is_verified_purchase && (
              <VerifiedBadge>Verified purchase</VerifiedBadge>
            )}

            <Time>{formatTime?.(localReview.created_at)}</Time>
          </TopRow>

          <RatingRow>
            <StarDisplay value={localReview.rating} size={14} />
            <span>{localReview.rating}/5</span>
          </RatingRow>
        </HeaderContent>
      </Header>

      {/* Title */}
      <Title>{localReview.title}</Title>

      {/* Content */}
      <Content>
        {displayContent}

        {isLong && (
          <InlineButton onClick={() => setExpanded((v) => !v)}>
            {expanded ? showLess : readMore}
          </InlineButton>
        )}
      </Content>

      {/* Voting */}
      <VoteRow>
        <span>{helpfulLabel}</span>

        <VoteButton onClick={() => handleVote("helpful")}>
          👍 {localReview.helpful_count}
        </VoteButton>

        <VoteButton onClick={() => handleVote("unhelpful")}>
          👎 {localReview.unhelpful_count}
        </VoteButton>
      </VoteRow>

      {/* Replies */}
      {localReview.replies?.length > 0 && (
        <RepliesSection>
          <ToggleRepliesButton onClick={() => setRepliesOpen((v) => !v)}>
            {repliesOpen ? hideReplies : showReplies}{" "}
            {localReview.replies.length}{" "}
            {localReview.replies.length === 1 ? "reply" : "replies"}
          </ToggleRepliesButton>

          {repliesOpen &&
            localReview.replies.map((rep) => (
              <ReplyItem key={rep.id}>
                <ReplyHeader>
                  <ReplyAuthor>{rep.author}</ReplyAuthor>
                  <ReplyTime>
                    {formatTime?.(rep.created_at)}
                  </ReplyTime>
                </ReplyHeader>
                <ReplyContent>{rep.content}</ReplyContent>
              </ReplyItem>
            ))}
        </RepliesSection>
      )}

      {/* Reply Box */}
      {ReplyComponent && (
        <ReplyBoxWrapper>
          <ReplyComponent
            reviewId={localReview.id}
            isOrganizer={isOrganizer}
            onReplyAdded={handleReplyAdded}
          />
        </ReplyBoxWrapper>
      )}
    </Container>
  );
}