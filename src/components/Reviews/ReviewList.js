import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import ReviewStats from "./ReviewStats";

// ─── Animations ───────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.1) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 4px;
`;

const SkeletonRow = styled.div`
  padding: 20px 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const SkeletonLine = styled(SkeletonBase)`
  height: 12px;
  width: ${({ width }) => width || "100%"};
  margin-bottom: ${({ mb }) => mb || "8px"};
`;

// ─── Controls ─────────────────────────────────────────────────────────────────

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const ControlsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SortSelect = styled.select`
  height: 34px;
  padding: 0 10px;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: #fff;
  color: #1a1a16;
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.18s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;

  &:hover,
  &:focus {
    border-color: #fa8128;
  }

  option {
    color: #1a1a16;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  input[type="checkbox"] {
    width: 15px;
    height: 15px;
    accent-color: #fa8128;
    cursor: pointer;
  }
`;

const WriteButton = styled.button`
  height: 34px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.12s;

  background: ${({ $active }) => ($active ? "transparent" : "#fa8128")};
  color: ${({ $active }) => ($active ? "rgba(0,0,0,0.5)" : "#fff")};
  border: 0.5px solid ${({ $active }) => ($active ? "rgba(0,0,0,0.15)" : "#fa8128")};

  &:hover {
    background: ${({ $active }) => ($active ? "rgba(0,0,0,0.04)" : "#e67020")};
    border-color: ${({ $active }) => ($active ? "rgba(0,0,0,0.25)" : "#e67020")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ─── Form wrapper ─────────────────────────────────────────────────────────────

const FormWrapper = styled.div`
  background: rgba(0, 0, 0, 0.025);
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.25s ease both;
`;

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  text-align: center;
`;

const EmptyTitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  margin: 0 0 6px;
`;

const EmptySubtitle = styled.p`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.4);
  margin: 0;
  line-height: 1.5;
  max-width: 240px;
`;

// ─── List ─────────────────────────────────────────────────────────────────────

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewList({
  reviews = [],
  stats = null,
  loading = false,
  isOrganizer = false,
  onFetch,
  onCreateReview,
  initialSort = "helpful",
  initialRatingFilter = null,
  initialVerifiedOnly = false,
  sorts = [
    { value: "helpful", label: "Most helpful" },
    { value: "newest",  label: "Newest" },
    { value: "highest", label: "Highest rated" },
  ],
  labels = {},
}) {
  const {
    emptyTitle        = "No reviews yet",
    emptySubtitle     = "Be the first to share your experience.",
    writeReview       = "Write a review",
    cancel            = "Cancel",
    verifiedOnlyLabel = "Verified only",
  } = labels;

  const [sort,        setSort]        = useState(initialSort);
  const [verifiedOnly, setVerifiedOnly] = useState(initialVerifiedOnly);
  const [showForm,     setShowForm]    = useState(false);

  useEffect(() => {
    onFetch?.({ sort, verifiedOnly });
  }, [sort, verifiedOnly]);

  return (
    <div>
      {stats && <ReviewStats stats={stats} total_reviews={reviews.length} />}

      <ControlsRow>
        <ControlsLeft>
          <SortSelect
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SortSelect>

          <CheckboxLabel>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            {verifiedOnlyLabel}
          </CheckboxLabel>
        </ControlsLeft>

        <WriteButton
          $active={showForm}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? cancel : writeReview}
        </WriteButton>
      </ControlsRow>

      {showForm && (
        <FormWrapper>
          <ReviewForm
            onSubmit={onCreateReview}
            onSuccess={() => {
              setShowForm(false);
              onFetch?.({ sort, verifiedOnly });
            }}
          />
        </FormWrapper>
      )}

      {loading && (
        <>
          {[1, 2].map((i) => (
            <SkeletonRow key={i}>
              <SkeletonLine width="30%" mb="10px" />
              <SkeletonLine width="15%" mb="14px" />
              <SkeletonLine width="80%" mb="6px" />
              <SkeletonLine width="60%" mb="0" />
            </SkeletonRow>
          ))}
        </>
      )}

      {!loading && reviews.length === 0 && (
        <EmptyState>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptySubtitle>{emptySubtitle}</EmptySubtitle>
        </EmptyState>
      )}

      {!loading && reviews.length > 0 && (
        <List>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              isOrganizer={isOrganizer}
            />
          ))}
        </List>
      )}
    </div>
  );
}