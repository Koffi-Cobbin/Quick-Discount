import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import StarRating from "../Discounts/StarRating";
import StarDisplay from "../Shared/StarDisplay";

export default function ReviewStats({
  stats,

  // Data mapping (decouples API shape)
  getTotal = (s) => s?.total_rating ?? 0,
  getAverage = (s) => s?.average_rating ?? 0,

  // Config
  maxRating = 5,

  // Labels
  labels = {},
}) {

  // const [sort, setSort] = useState("helpful");

  const {
    reviewSingular = "review",
    reviewPlural = "reviews",
  } = labels;

  if (!stats) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: 64,
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
            }}
          />
        ))}
      </div>
    );
  }

  // const sorts = [
  //   { value: "helpful", label: "Most helpful" },
  //   { value: "newest", label: "Newest" },
  //   { value: "highest", label: "Highest rated" },
  //   { value: "lowest", label: "Least rated" },
  // ];

  const total = getTotal(stats);
  const average = getAverage(stats);

  return (
    <div>
      <ReviewSectionHeader>
        <Left>
          <Rating>{average.toFixed(1)}</Rating>
          <Stars>
            <StarRating rating={average} showRate={false} />
            <p>ratings</p>
          </Stars>
        </Left>

        {/* <Right>
          <label htmlFor="reviews-sort">Sort by&nbsp;</label>
          <SortSelect
            name="reviews-sort"
            id="reviews-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SortSelect>
        </Right> */}
      </ReviewSectionHeader>

      <ReviewVerificationInfo>
        <div>
          <img src="/images/icons/checked-tick.svg" alt="Verified reviews badge" width="42" height="42" />
        </div>
        <div className="verified-badge">
          <p><b>100% Verified Reviews</b></p>
          <p>
            All reviews are from people who have redeemed deals with this merchant.
            Review requests are sent by email or sms to customers who purchase the deal.
          </p>
        </div>
      </ReviewVerificationInfo>
    </div>
  );
}

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

const Right = styled.div``;

const Rating = styled.div`
  font-size: 45px;
  font-weight: 600;
  margin: 0;
  padding: 0;
  margin-right: 10px;
`;

const Stars = styled.div``;

const ReviewVerificationInfo = styled.div`
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 5px;
  padding: 7px;
  margin: 5px 0;
  & > div.verified-badge {
    margin-left: 5px;
  }
`;