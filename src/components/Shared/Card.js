import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import WishlistContext from "../../store/wishlist-context";
import { updateDiscountLikes, isDiscountLikedByUserAPI, removeUserDiscountLike, addUserDiscountLike, addToWishlistAPI, removeFromWishlistAPI } from "../../actions/index.js";

import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

// Theme tokens (DARK and LIGHT objects unchanged)
const DARK = {
  surface: "rgba(255,255,255,0.034)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(240,236,230,0.08)",
  borderHover: "rgba(250,129,40,0.35)",
  imgBg: "#1a1a16",
  expiryBg: "rgba(14,13,11,0.95)",
  expiryBorder: "rgba(240,236,230,0.08)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.15)",
  text: "#f0ece6",
  textMuted: "rgba(240,236,230,0.4)",
  textSub: "rgba(240,236,230,0.62)",
  footerBorder: "rgba(240,236,230,0.08)",
  error: "#ef4444",
  errorBg: "rgba(239,68,68,0.12)",
};

const LIGHT = {
  surface: "#fafaf9",
  surfaceHover: "rgba(0,0,0,0.02)",
  border: "rgba(0,0,0,0.1)",
  borderHover: "rgba(250,129,40,0.35)",
  imgBg: "#f0ede8",
  expiryBg: "rgba(255,255,255,0.98)",
  expiryBorder: "rgba(0,0,0,0.1)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.12)",
  text: "#1a1a16",
  textMuted: "rgba(20,20,15,0.45)",
  textSub: "rgba(20,20,15,0.6)",
  footerBorder: "rgba(0,0,0,0.08)",
  error: "#ef4444",
  errorBg: "rgba(239,68,68,0.08)",
};

// tok function unchanged
const tok = (prop) => ({ $theme }) => ($theme === "light" ? LIGHT : DARK)[prop];

const radius = "14px";

export const CardWrapper = styled.div`
  position: relative;
  background: ${tok("surface")};
  border: 1px solid ${tok("border")};
  border-radius: ${radius};
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    border-color 0.25s,
    transform 0.25s,
    box-shadow 0.25s;

  &:hover {
    border-color: ${tok("borderHover")};
    transform: translateY(-3px);
    box-shadow: ${({ $theme }) =>
      $theme === "light"
        ? "0 8px 28px rgba(0,0,0,0.09)"
        : "0 8px 28px rgba(0,0,0,0.35)"}; 
    text-decoration: none;
    color: inherit;
  }
`;

export const CardImg = styled.div`
  position: relative;
  height: 190px;
  overflow: hidden;
  background: ${tok("imgBg")};

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

  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

export const ExpiryTag = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: ${tok("expiryBg")};
  border: 1px solid ${tok("expiryBorder")};
  color: ${tok("textSub")};
  font-family: "Courier New", monospace;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  z-index: 2;
`;

export const CardBody = styled.div`
  padding: 18px 18px 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${tok("surface")};
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
`;

export const CatLabel = styled.span`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${tok("orange")};
  background: ${tok("orangeDim")};
  border: 1px solid rgba(250, 129, 40, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
`;

export const CardTitle = styled.h3`
  font-family: var(--font-sans);
  font-size: 1.08rem;
  font-weight: 700;
  color: ${tok("text")};
  line-height: 1.3;
  margin-bottom: 8px;
  transition: color 0.2s;
  text-align: left;
  flex-shrink: 0;

  ${CardWrapper}:hover & {
    color: ${tok("orange")};
  }
`;

export const CardLoc = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: ${tok("textSub")};
  margin-bottom: 14px;
  text-align: left;
  flex-shrink: 0;

  svg {
    color: ${tok("orange")};
    flex-shrink: 0;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 14px 18px;
  border-top: 1px solid ${tok("footerBorder")};
`;

export const LikeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${({ $isLiked, $theme }) =>
    $isLiked ? ($theme === "light" ? LIGHT.orange : DARK.orange) : ($theme === "light" ? LIGHT.border : DARK.border)};
  background: ${({ $isLiked, $theme }) =>
    $isLiked ? ($theme === "light" ? LIGHT.orangeDim : DARK.orangeDim) : "transparent"};
  color: ${({ $isLiked, $theme }) => {
    const t = $theme === "light" ? LIGHT : DARK;
    return $isLiked ? t.orange : t.textSub;
  }};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${tok("orange")};
    color: ${tok("orange")};
    background: ${tok("orangeDim")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 13px;
    height: 13px;
    fill: currentColor;
  }
`;

export const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${({ $isSaved, $theme }) =>
    $isSaved ? ($theme === "light" ? LIGHT.orange : DARK.orange) : ($theme === "light" ? LIGHT.border : DARK.border)};
  background: ${({ $isSaved, $theme }) =>
    $isSaved ? ($theme === "light" ? LIGHT.orangeDim : DARK.orangeDim) : "transparent"};
  color: ${({ $isSaved, $theme }) => {
    const t = $theme === "light" ? LIGHT : DARK;
    return $isSaved ? t.orange : t.textSub;
  }};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${tok("orange")};
    color: ${tok("orange")};
    background: ${tok("orangeDim")};
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
  border: 1px solid ${tok("border")};
  background: transparent;
  color: ${tok("textSub")};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${tok("orange")};
    color: ${tok("orange")};
    background: ${tok("orangeDim")};
  }
`;

export const DeleteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid ${tok("border")};
  background: transparent;
  color: ${tok("textSub")};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${tok("error")};
    color: ${tok("error")};
    background: ${tok("errorBg")};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

function Card({ discount, index = 0, onSave, isSaved, isEditMode, onEdit, onDelete, isLoading, bgColor, onLike, isLiked }) {
  const wishlistCtx = useContext(WishlistContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [localLiked, setLocalLiked] = useState(false);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  // Optimistic save state: initialised from the prop so it's correct on mount,
  // then updated immediately on click without waiting for the parent to re-render.
  const isLocallySaved = wishlistCtx.wishlist?.some((item) => item.id === discount.id) || false;
  const [optimisticSaved, setOptimisticSaved] = useState(isSaved || isLocallySaved);

  const theme = bgColor === "light" ? "light" : "dark";

  const reduxDiscounts = useSelector((state) => state.discountState?.discounts?.results || []);
  const userDiscountLikes = useSelector((state) => state.discountState?.userDiscountLikes || {});
  const authToken = useSelector((state) => state.userState?.token?.access);

  // When no onSave prop is provided, Card reads its own saved status from Redux
  // wishlist so it doesn't depend on the parent at all.
  const reduxWishlist = useSelector((state) => state.discountState?.wishlist);
  const reduxIsSaved = React.useMemo(() => {
    if (!reduxWishlist) return false;
    const list = reduxWishlist?.results ?? (Array.isArray(reduxWishlist) ? reduxWishlist : []);
    return list.some((item) => (item.discount?.id ?? item.discount ?? item.id) === discount.id);
  }, [reduxWishlist, discount.id]);

  const reduxDiscount = reduxDiscounts.find((d) => d.id === discount.id);
  
  const likesCount = reduxDiscount?.likes ?? discount.likes ?? 0;

  const likedItem = userDiscountLikes[discount.id];
  const isLikedRedux = !!likedItem;
  const likeId = likedItem?.id; // ✅ IMPORTANT for unlike

  const handleSlice = (data, size) => {
    if (!data || data.length <= size) return data;
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

  const formatExpiry = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };


  // Keep optimisticSaved in sync when the authoritative source changes.
  // - With onSave prop:    parent owns the isSaved value, sync from that.
  // - Without onSave prop: Card owns the state, sync from Redux wishlist.
  React.useEffect(() => {
    const authoritative = onSave ? (isSaved || isLocallySaved) : (reduxIsSaved || isLocallySaved);
    setOptimisticSaved(authoritative);
  }, [isSaved, isLocallySaved, reduxIsSaved, onSave]);

  const isItemSaved = optimisticSaved;
  const isLikedFinal = authToken ? isLikedRedux : localLiked;
  // Combine parent-controlled loading with internal save loading
  const isSaveLoading = isLoading || isSavingLocal;

  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Guest path: toggle local wishlist context, same for both prop/no-prop cases.
    if (!authToken) {
      isLocallySaved
        ? wishlistCtx.removeWishItem(discount.id)
        : wishlistCtx.addWishItem({ id: discount.id });
      return;
    }

    if (isSaveLoading) return;

    // Delegate to parent if it provided a handler.
    if (onSave) {
      setOptimisticSaved((prev) => !prev);
      onSave(discount.id);
      return;
    }

    // Self-managed path: Card dispatches the API action directly.
    const wasSaved = isItemSaved;
    setOptimisticSaved((prev) => !prev);
    setIsSavingLocal(true);
    try {
      if (wasSaved) {
        await dispatch(removeFromWishlistAPI({ discount_id: discount.id }));
      } else {
        await dispatch(addToWishlistAPI({ discount_id: discount.id }));
      }
    } catch {
      // Rollback optimistic flip on failure.
      setOptimisticSaved(wasSaved);
    } finally {
      setIsSavingLocal(false);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(discount.id);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(discount.id);
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingLike) return;

    // Handle non-auth users (local toggle only)
    if (!authToken) {
      setLocalLiked((prev) => !prev);
      return;
    }

    setIsLoadingLike(true);

    const wasLiked = isLikedFinal;
    console.log("Was liked ", wasLiked);
    const previousLikes = likesCount;
    const updatedLikes = Math.max(0, wasLiked ? previousLikes - 1 : previousLikes + 1);

    // ✅ Optimistic UI update
    dispatch(updateDiscountLikes(discount.id, updatedLikes));
    onLike?.(discount.id, !wasLiked, updatedLikes);

    try {
      console.log("Like ID for discount", discount.id, likeId);
      if (wasLiked) {
        // ========================
        // 🔻 UNLIKE FLOW
        // ========================
        console.log("Attempting to unlike with likeId:", likeId);

        if (!likeId) {
          console.error("Missing likeId for unlike");
          throw new Error("Like ID not found");
        }

        const res = await fetch(
          `${BASE_URL}/discounts/likes/delete/${likeId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to unlike");
        }

        dispatch(removeUserDiscountLike(discount.id));

      } else {
        // ========================
        // ❤️ LIKE FLOW
        // ========================

        console.log("Attempting to like discount ID:", discount.id);

        const res = await fetch(`${BASE_URL}/discounts/likes/add/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ discount_id: discount.id }),
        });

        if (!res.ok) {
          throw new Error("Failed to like");
        }

        const data = await res.json();
        // Optimistically update Redux with the new like entry so isLikedRedux
        // and likeId are available immediately without a re-fetch
        dispatch(addUserDiscountLike(discount.id, { id: data.id, discount_id: discount.id }));
      }

    } catch (err) {
      // ❌ Rollback UI if error
      dispatch(updateDiscountLikes(discount.id, previousLikes));
      onLike?.(discount.id, wasLiked, previousLikes);
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/discounts/${discount.id}`);
  };

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/discounts/${discount.id}`);
    }
  };

  if (!discount) return null;

  return (
    <CardWrapper
      $theme={theme}
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <CardImg $theme={theme}>
        <img src={discount.flyer} alt={discount.title} />
        {discount.percentage_discount ? (
          <Badge $theme={theme}>{handleSlice(discount.percentage_discount, 20)}</Badge>
        ) : (
          <Badge $theme={theme}>Deal</Badge>
        )}
        {discount.end_date && (
          <ExpiryTag $theme={theme}>Ends {formatExpiry(discount.end_date)}</ExpiryTag>
        )}
      </CardImg>
      <CardBody $theme={theme}>
        {discount.categories && discount.categories.length > 0 && (
          <CardMeta $theme={theme}>
            {discount.categories.map((c) => (
              <CatLabel key={c.name} $theme={theme}>{c.name}</CatLabel>
            ))}
          </CardMeta>
        )}
        <CardTitle $theme={theme}>{discount.title}</CardTitle>
        <CardLoc $theme={theme}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {discount.location}
        </CardLoc>
        <CardFooter $theme={theme}>
          <LikeBtn
            $theme={theme}
            $isLiked={isLikedFinal}
            onClick={handleLikeClick}
            disabled={isLoading || isLoadingLike}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <b>{likesCount}</b>
          </LikeBtn>
          {isEditMode ? (
            <ActionButtons>
              <EditBtn $theme={theme} onClick={handleEditClick}>✎ Edit</EditBtn>
              <DeleteBtn $theme={theme} onClick={handleDeleteClick}>✕ Delete</DeleteBtn>
            </ActionButtons>
          ) : (
            <SaveBtn
              $theme={theme}
              $isSaved={isItemSaved}
              onClick={handleSaveClick}
              disabled={isSaveLoading}
            >
              {isSaveLoading ? "..." : isItemSaved ? "✦ Saved" : "♡ Save"}
            </SaveBtn>
          )}
        </CardFooter>
      </CardBody>
    </CardWrapper>
  );
}

export default Card;