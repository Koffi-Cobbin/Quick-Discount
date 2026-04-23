import styled from "styled-components";
import StarRating from "../Discounts/StarRating";

/* =======================
   Component
======================= */

export default function ReviewStats({
  stats,
  total_reviews = 0,

  // Data mapping (decouples API shape)
  getTotal = (s) => s?.total_rating ?? 0,
  getAverage = (s) => s?.average_rating ?? 0,

  // Labels
  labels = {},
}) {
  const {
    reviewSingular = "review",
    reviewPlural = "reviews",
  } = labels;

  if (!stats) {
    return (
      <SkeletonGrid>
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </SkeletonGrid>
    );
  }

  const total = getTotal(stats);
  const average = getAverage(stats);

  return (
    <Wrapper>
      <ReviewSectionHeader>
        <Left>
          <Rating>{average.toFixed(1)}</Rating>

          <Stars>
            <StarRating rating={average} showRate={false} />
            <TotalText>
              {total_reviews === 0 ? "No reviews yet" : `${total_reviews} ${total_reviews === 1 ? reviewSingular : reviewPlural}`}
            </TotalText>
          </Stars>
        </Left>
      </ReviewSectionHeader>

      <ReviewVerificationInfo>
        <IconWrapper>
          <img
            src="/images/icons/checked-tick.svg"
            alt="Verified reviews badge"
            width="42"
            height="42"
          />
        </IconWrapper>

        <VerifiedContent>
          <p><strong>100% Verified Reviews</strong></p>
          <p>
            All reviews are from people who have redeemed deals with this merchant.
            Review requests are sent by email or SMS to customers who purchase the deal.
          </p>
        </VerifiedContent>
      </ReviewVerificationInfo>
    </Wrapper>
  );
}

/* =======================
   Styled Components
======================= */

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const SkeletonCard = styled.div`
  height: 64px;
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-md);
`;

const ReviewSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 620px) {
    flex-wrap: wrap;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  width: 30%;

  @media (max-width: 620px) {
    width: 100%;
  }
`;

const Rating = styled.div`
  font-size: 45px;
  font-weight: 600;
  margin-right: 10px;
  color: var(--color-text-primary);
`;

const Stars = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TotalText = styled.p`
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 2px 0 0;
`;

const ReviewVerificationInfo = styled.div`
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 5px;
  padding: 8px;
  margin-top: 8px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const VerifiedContent = styled.div`
  margin-left: 6px;

  p {
    margin: 0;
    font-size: 13px;
    color: var(--color-text-primary);
  }

  p:last-child {
    font-size: 12px;
    color: var(--color-text-secondary);
  }
`;