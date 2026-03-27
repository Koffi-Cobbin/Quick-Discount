import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import WishlistContext from "../../store/wishlist-context";
import { updateDiscountLikes, isDiscountLikedByUserAPI } from "../../actions/index.js";

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

// All styled components unchanged (CardWrapper, CardImg, Badge, etc.)
// ... (omit for brevity, same as original)

function Card({ discount, index = 0, onSave, isSaved, isEditMode, onEdit, onDelete, isLoading, bgColor, isLoggedIn, onLike, isLiked }) {
  const wishlistCtx = useContext(WishlistContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [localLiked, setLocalLiked] = useState(false);

  const theme = bgColor === "light" ? "light" : "dark";

  const reduxDiscounts = useSelector((state) => state.discountState?.discounts?.results || []);
  const userDiscountLike = useSelector((state) => state.discountState?.user_discount_like);
  const authToken = useSelector((state) => state.userState?.token?.access);
  const reduxDiscount = reduxDiscounts.find((d) => d.id === discount.id);
  const likesCount = reduxDiscount?.likes ?? discount.likes ?? 0;
  const isLikedRedux = userDiscountLike?.discount_id === discount.id;

  // helper functions unchanged

  const isLocallySaved = wishlistCtx.wishlist?.some((item) => item.id === discount.id) || false;
  const isItemSaved = isSaved || isLocallySaved;
  const isLikedFinal = authToken ? isLikedRedux : localLiked;

  // handler functions unchanged except handleLikeClick

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingLike) return;

    if (!authToken) {
      setLocalLiked(!localLiked);
      return;
    }

    setIsLoadingLike(true);

    const previousLikes = likesCount;
    const wasLiked = isLikedFinal;
    const newLikesCount = wasLiked ? previousLikes - 1 : previousLikes + 1;

    // Optimistic update
    dispatch(updateDiscountLikes(discount.id, newLikesCount));
    if (typeof onLike === 'function') {
      onLike(discount.id, !wasLiked, newLikesCount);
    }

    try {
      let likeId = discount.user_discount_like?.id || discount.user_like?.id || discount.like_id;

      if (wasLiked) {
        // Unlike logic
        if (!likeId) {
          const verifyResponse = await fetch(`${BASE_URL}/discounts/likes/verify/0/${discount.id}/`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (!verifyResponse.ok) {
            throw new Error(`Verify failed: ${verifyResponse.status}`);
          }

          const verifyData = await verifyResponse.json();
          likeId = verifyData?.id;
        }

        if (!likeId) {
          throw new Error("Missing like ID for unlike");
        }

        const deleteResponse = await fetch(`${BASE_URL}/discounts/likes/delete/${likeId}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!deleteResponse.ok && deleteResponse.status !== 204) {
          throw new Error(`Unlike failed: ${deleteResponse.status}`);
        }
      } else {
        // Like logic
        const likeResponse = await fetch(`${BASE_URL}/discounts/likes/add/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ discount_id: discount.id }),
        });

        if (!likeResponse.ok) {
          throw new Error(`Like failed: ${likeResponse.status}`);
        }
      }

      // Success
      dispatch(isDiscountLikedByUserAPI(discount.id));
    } catch (error) {
      // Revert
      dispatch(updateDiscountLikes(discount.id, previousLikes));
      if (typeof onLike === 'function') {
        onLike(discount.id, wasLiked, previousLikes);
      }
    } finally {
      setIsLoadingLike(false);
    }
  };

  // rest of handlers and JSX unchanged
  // ... (omit)

  return (/* JSX unchanged */);
}

export default Card;

