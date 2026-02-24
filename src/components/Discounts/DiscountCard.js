import React from "react";
import styled, { keyframes, css } from "styled-components";
import { formatDate } from "../../utils/middleware";
import StarRating from "./StarRating";

const DiscountCard = (props) => {
  const handleSlice = (data, size) => {
    if (data.length <= size) {
      return data;
    }
    const words = data.split(" ");
    let truncatedString = "";
    for (let i = 0; i < words.length; i++) {
      if (truncatedString.length + words[i].length <= size) {
        truncatedString += words[i] + " ";
      } else {
        break;
      }
    }
    return `${truncatedString.trim()} ...`;
  };

  return (
    <>
      {props.discount && (
        <Card
          href={`/discounts/${props.discount.id}`}
          $index={props.index || 0}
        >
          <ImageWrapper>
            <BackgroundImage
              style={{ backgroundImage: `url(${props.discount.flyer})` }}
            />
            <ShineOverlay />
            <DiscountBadge>
              {props.discount.percentage_discount
                ? handleSlice(props.discount.percentage_discount, 20)
                : "Deal"}
            </DiscountBadge>
          </ImageWrapper>

          <EventInfo>
            <Title>{handleSlice(props.discount.title, 50)}</Title>

            <Address>
              <LocationIcon>
                {/* Map pin — outline style with filled dot, matches 16px star size */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2a7 7 0 0 0-7 7c0 4.418 5.686 11.617 6.7 12.802a.4.4 0 0 0 .6 0C13.314 20.617 19 13.418 19 9a7 7 0 0 0-7-7z"
                    fill="currentColor"
                    fillOpacity="0.18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                </svg>
              </LocationIcon>
              <span>{props.discount.location}</span>
            </Address>

            <DateTimeWrapper>
              <Date>
                <p>
                  <span>
                    {formatDate(props.discount.start_date, false)}
                    &nbsp; to {formatDate(props.discount.end_date, false)}
                  </span>
                </p>
              </Date>
            </DateTimeWrapper>

            <SocialActions>
              <Left>
                <LikesCount>
                  {/* Heart — rounded, filled, matches 16px star size */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
                  </svg>
                  <b>{props.discount.likes}</b>
                </LikesCount>
              </Left>
              <Right>
                <StarRating
                  rating={props.discount.total_rating}
                  showRate={true}
                />
              </Right>
            </SocialActions>
          </EventInfo>
        </Card>
      )}
    </>
  );
};

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const shineSweep = keyframes`
  0%   { left: -80%; opacity: 0; }
  10%  { opacity: 1; }
  60%  { left: 120%; opacity: 0.6; }
  100% { left: 120%; opacity: 0; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const Card = styled.a`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #fff;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  color: inherit;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  flex-direction: column;

  /* Staggered entry animation */
  animation: ${fadeSlideUp} 0.45s ease both;
  animation-delay: ${({ $index }) => Math.min($index * 0.07, 0.35)}s;

  /* Smooth transitions for all hover effects */
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.14),
      0 4px 12px rgba(250, 129, 40, 0.18),
      0 1px 2px rgba(0, 0, 0, 0.06);
    text-decoration: none;
    color: inherit;
  }

  &:active {
    transform: translateY(-2px) scale(1.005);
    transition-duration: 0.1s;
  }

  &:visited,
  &:focus {
    text-decoration: none;
    color: inherit;
    outline: none;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
`;

const BackgroundImage = styled.div`
  width: 100%;
  min-height: 180px;
  background-color: #333;
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 0 0;

  /* Smooth image zoom on hover */
  transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${Card}:hover & {
    transform: scale(1.06);
  }
`;

/* Shine sweep — triggers on hover */
const ShineOverlay = styled.div`
  position: absolute;
  top: 0;
  left: -80%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.28) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  pointer-events: none;
  opacity: 0;

  ${Card}:hover & {
    animation: ${shineSweep} 0.6s ease forwards;
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #fa8128, #e05a00);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 8px rgba(250, 129, 40, 0.45);
  pointer-events: none;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const EventInfo = styled.div`
  color: #36454f;
  position: relative;
  padding: 12px;
  font-size: 16px;
  font-family: Lato, "Roboto", sans-serif;
  flex: 1;

  transition: background-color 0.25s ease;

  ${Card}:hover & {
    background-color: #fafaf9;
  }
`;

const Title = styled.h4`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  max-height: 45px;
  overflow: hidden;

  transition: color 0.25s ease;

  ${Card}:hover & {
    color: #fa8128;
  }
`;

const DateTimeWrapper = styled.div`
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Date = styled.div`
  text-align: left;
  align-items: center;
  display: flex;
  margin-bottom: 12px;
  p {
    span {
      font-size: 13px;
      color: #888;
    }
  }
`;

const Address = styled.p`
  text-align: left;
  overflow: hidden;
  margin-bottom: 5px;
  font-weight: 600;
  max-height: 42px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #555;
`;

const LocationIcon = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #fa8128;
  transition:
    color 0.25s ease,
    transform 0.25s ease;

  ${Card}:hover & {
    color: #e05a00;
    transform: scale(1.15);
  }
`;

const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
`;

const Left = styled.div``;
const Right = styled.div``;

const LikesCount = styled.span`
  font-size: 13px;
  color: #ccc;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: color 0.25s ease;

  svg {
    flex-shrink: 0;
    transition:
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      color 0.25s ease;
  }

  ${Card}:hover & {
    color: #fa8128;
    svg {
      transform: scale(1.2);
    }
  }

  b {
    color: inherit;
    font-weight: 600;
  }
`;

export default DiscountCard;
