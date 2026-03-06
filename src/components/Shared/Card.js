import React from "react";
import styled from "styled-components";

// ─── Theme tokens (matches QuickDiscount app) ─────────────────────────────────
const T = {
  bg: "#0e0d0b",
  surface: "rgba(255,255,255,0.034)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(240,236,230,0.08)",
  borderHover: "rgba(250,129,40,0.3)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.15)",
  orangeGlow: "rgba(250,129,40,0.06)",
  text: "#f0ece6",
  textMuted: "rgba(240,236,230,0.4)",
  textSub: "rgba(240,236,230,0.62)",
  radius: "14px",
  radiusSm: "8px",
};

// ─── Card Styled Components ─────────────────────────────────────────────────

export const CardWrapper = styled.a`
  position: relative;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
  transition:
    border-color 0.25s,
    transform 0.25s,
    box-shadow 0.25s;

  &:hover {
    border-color: rgba(250, 129, 40, 0.35);
    transform: translateY(-3px);
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(250, 129, 40, 0.1);
    text-decoration: none;
    color: inherit;
  }
`;

export const CardImg = styled.div`
  position: relative;
  height: 190px;
  overflow: hidden;
  background: #1a1a16;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s ease;
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.06);
  }
`;

export const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${T.orange};
  color: #fff;
  font-family: serif;
  font-style: italic;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: -0.01em;
  line-height: 1;
`;

export const ExpiryTag = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(14, 13, 11, 0.85);
  border: 1px solid ${T.border};
  color: ${T.textSub};
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
`;

export const CardBody = styled.div`
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

export const CatLabel = styled.span`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${T.orange};
  background: ${T.orangeDim};
  border: 1px solid rgba(250, 129, 40, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
`;

export const CardTitle = styled.h3`
  font-family: var(--font-sans);
  font-size: 1.08rem;
  font-weight: 700;
  color: ${T.text};
  line-height: 1.3;
  margin-bottom: 8px;
  transition: color 0.2s;
  text-align: left;

  ${CardWrapper}:hover & {
    color: ${T.orange};
  }
`;

export const CardLoc = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: ${T.textSub};
  margin-bottom: auto;
  text-align: left;

  svg {
    color: ${T.orange};
    flex-shrink: 0;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${T.border};
`;

export const Likes = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: ${T.textMuted};
  transition: color 0.2s;

  ${CardWrapper}:hover & {
    color: ${T.orange};
  }
`;

export const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${({ $isSaved }) => ($isSaved ? T.orange : T.border)};
  background: ${({ $isSaved }) => ($isSaved ? T.orangeDim : "transparent")};
  color: ${({ $isSaved }) => ($isSaved ? T.orange : T.textSub)};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${T.border};
  background: transparent;
  color: ${T.textSub};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }
`;

// ─── Card React Component ─────────────────────────────────────────────────

function Card({ discount, index = 0, onSave, isSaved, isEditMode, onEdit, isLoading }) {
  // Format end_date for display
  const formatExpiry = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave && !isLoading) {
      onSave(discount.id);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(discount.id);
    }
  };

  if (!discount) return null;

  return (
    <CardWrapper href={`/discounts/${discount.id}`}>
      <CardImg>
        <img src={discount.flyer} alt={discount.title} />
        {discount.percentage_discount && (
          <Badge>{discount.percentage_discount}</Badge>
        )}
        {discount.end_date && (
          <ExpiryTag>Ends {formatExpiry(discount.end_date)}</ExpiryTag>
        )}
      </CardImg>
      <CardBody>
        {discount.categories && discount.categories.length > 0 && (
          <CardMeta>
            {discount.categories.map((c) => (
              <CatLabel key={c.name}>{c.name}</CatLabel>
            ))}
          </CardMeta>
        )}
        <CardTitle>{discount.title}</CardTitle>
        <CardLoc>
          <svg
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {discount.location}
        </CardLoc>
        <CardFooter>
          <Likes>
            <svg
              width="13"
              height="13"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <b>{discount.likes}</b> likes
          </Likes>
          {isEditMode ? (
            <EditBtn onClick={handleEditClick}>
              ✎ Edit
            </EditBtn>
          ) : (
            <SaveBtn 
              onClick={handleSaveClick} 
              $isSaved={isSaved}
              disabled={isLoading}
            >
              {isLoading ? "..." : isSaved ? "✦ Saved" : "♡ Save"}
            </SaveBtn>
          )}
        </CardFooter>
      </CardBody>
    </CardWrapper>
  );
}

// Also export Card as default for backwards compatibility
export default Card;
