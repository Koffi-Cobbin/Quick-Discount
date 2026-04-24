import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";

import { LeftButton, RightButton } from "../Shared/CarouselControls";
import Loading from "../Shared/Loading";
import Gallery from "../Gallery/Gallery";
import CarouselFlex from "../Shared/CarouselFlex";
import Card, { Badge } from "../Shared/Card";

import ReviewList from "../Reviews/ReviewList";
import ReplyBox from "../Reviews/ReplyBox";
import ReviewItem from "../Reviews/ReviewItem";
import ReviewForm from "../Reviews/ReviewForm";
import ReviewStats from "../Reviews/ReviewStats";

import {
  getDiscountsAPI,
  getDiscountMediaAPI,
  getDiscountReviewsAPI,
  isUserFollowerAPI,
  setUserIsFollower,
  isDiscountLikedByUserAPI,
  setUserDiscountLike,
  setPreviousUrl,
} from "../../actions";
import { BASE_URL } from "../../utils/constants";

// ─── Axios instance ─────────────────────────────────────────────────────────────
const authAxios = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

// ─── Pure helpers ────────────────────────────────────────────────────────────────

function getDaysLeft(endDateStr) {
  if (!endDateStr) return null;
  const end = new Date(endDateStr + "T23:59:59");
  const now = new Date();
  if (now >= end) return "Expired";
  return String(Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

function formatExpiry(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

// ─── Sub-component: TokenModal ───────────────────────────────────────────────────

const TokenModal = ({ token, onClose, discountEndDate }) => {
  const [copied, setCopied] = useState(false);

  // Resolve the display string for the token value itself
  const tokenValue =
    typeof token === "object" && token !== null
      ? token.token_code ?? token.token ?? token.value ?? JSON.stringify(token)
      : String(token ?? "");

  // Expiry note derived from discount end date
  const daysLeft = getDaysLeft(discountEndDate);
  const isExpired = daysLeft === "Expired";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tokenValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [tokenValue]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <ModalBackdrop onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Your discount token">
      <ModalCard>
        <ModalHeader>
          <ModalTitle>Your Discount Token</ModalTitle>
          <ModalCloseButton onClick={onClose} aria-label="Close token modal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <TokenLabel>Present this token at the merchant to redeem your discount</TokenLabel>

          <TokenDisplayRow>
            <TokenValue>{tokenValue}</TokenValue>
            <CopyButton onClick={handleCopy} aria-label="Copy token to clipboard" $copied={copied}>
              {copied ? (
                // Checkmark icon when copied
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                // Copy icon
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </CopyButton>
          </TokenDisplayRow>

          <TokenExpiryNote $expired={isExpired}>
            {isExpired ? (
              <>
                <ExpiryIcon aria-hidden="true">⚠️</ExpiryIcon>
                This token has expired
              </>
            ) : daysLeft ? (
              <>
                <ExpiryIcon aria-hidden="true">🗓️</ExpiryIcon>
                Expires in <strong>&nbsp;{daysLeft} {daysLeft === "1" ? "day" : "days"}</strong>
              </>
            ) : (
              <>
                <ExpiryIcon aria-hidden="true">♾️</ExpiryIcon>
                No expiry date set
              </>
            )}
          </TokenExpiryNote>
        </ModalBody>
      </ModalCard>
    </ModalBackdrop>
  );
};

// ─── Sub-component: ExpandableDescription ────────────────────────────────────────

const ExpandableDescription = ({ html }) => {
  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
  }, [html]);

  return (
    <>
      <DescriptionContent ref={contentRef} $expanded={expanded}>
        {parse(html)}
      </DescriptionContent>
      {overflows && (
        <ReadMoreOrLess onClick={() => setExpanded((p) => !p)} aria-expanded={expanded}>
          {expanded ? "Read Less" : "Read More"}
        </ReadMoreOrLess>
      )}
    </>
  );
};

// ─── Sub-component: HeroSection ──────────────────────────────────────────────────

const HeroSection = ({ discount, onShare }) => {
  const daysLeft = discount.end_date ? getDaysLeft(discount.end_date) : null;
  const isExpired = daysLeft === "Expired";

  return (
    <DiscountImageWrapper>
      <DiscountImage imgUrl={discount.flyer} role="img" aria-label={`Flyer for ${discount.title}`} />
      <ButtonsContainer>
        {isExpired ? (
          <ExpiryTag data-expired="true">EXPIRED</ExpiryTag>
        ) : (
          <>
            <DiscountBadge>{discount.percentage_discount ?? "Deal"}</DiscountBadge>
            {daysLeft && (
              <ExpiryTag>
                {daysLeft}
                <span>&nbsp;days left</span>
              </ExpiryTag>
            )}
            <ShareDiscount onClick={onShare} aria-label="Copy link to clipboard">
              <img src="/images/icons/share-w.svg" alt="" width="25" height="25" />
            </ShareDiscount>
          </>
        )}
      </ButtonsContainer>
    </DiscountImageWrapper>
  );
};

// ─── Sub-component: DiscountInfoSection ──────────────────────────────────────────

const DiscountInfoSection = ({ discount, liked, displayedLikes, onLike }) => (
  <DiscountInfo>
    <Title>
      <b>{discount.title}&nbsp;</b>
      <Like
        $liked={liked}
        onClick={onLike}
        aria-label={liked ? "Unlike this discount" : "Like this discount"}
        aria-pressed={liked}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.9977 5.63891C16.2695 4.34931 15.433 3.00969 14.2102 2.59462C13.6171 2.37633 12.9892 2.4252 12.4662 2.60499C11.9449 2.78419 11.4461 3.12142 11.1369 3.58441L11.136 3.58573L7.49506 9.00272C8.05104 9.29585 8.43005 9.87954 8.43005 10.5518V21.3018H6.91003V21.3018H16.6801C18.2938 21.3018 19.2028 20.2977 19.8943 19.202C20.6524 18.0009 21.1453 16.7211 21.5116 15.5812C21.6808 15.0546 21.8252 14.5503 21.9547 14.0984L21.9863 13.9881C22.126 13.5007 22.2457 13.0904 22.366 12.7549C22.698 11.8292 22.5933 10.9072 22.067 10.2072C21.5476 9.5166 20.7005 9.15175 19.76 9.15175H15.76C15.6702 9.15175 15.6017 9.11544 15.5599 9.06803C15.5238 9.02716 15.4831 8.95058 15.502 8.81171L15.9977 5.63891Z"
            />
            <path d="M2.18005 10.6199C2.18005 10.03 2.62777 9.55176 3.18005 9.55176H6.68005C7.23234 9.55176 7.68005 10.03 7.68005 10.6199V21.3018H3.18005C2.62777 21.3018 2.18005 20.8235 2.18005 20.2336V10.6199Z" />
          </g>
        </svg>
        <span>{displayedLikes}</span>
      </Like>
    </Title>

    <Description>
      <p>
        <b>Duration: </b>
        <Colored> {formatExpiry(discount.start_date)} </Colored>to
        <Colored> {formatExpiry(discount.end_date)} </Colored>
      </p>
      <p>
        <b>Location: </b>
        <Colored> {discount.location} </Colored>
      </p>
      <b>Description </b>
      <ExpandableDescription html={discount.description} />
    </Description>
  </DiscountInfo>
);

// ─── Sub-component: ContactInfoSection ───────────────────────────────────────────

const ContactInfoSection = ({ organizer, websiteUrl, onGetToken, tokenLoading, hasToken, onShowToken }) => {
  const [showPopup, setShowPopup] = useState(false);
  const handles = organizer.social_media_handles;

  return (
    <ContactSection>
      <GetTokenButton
        onClick={hasToken ? onShowToken : onGetToken}
        disabled={tokenLoading}
        $loading={tokenLoading}
        $hasToken={hasToken}
        aria-label={hasToken ? "Show your token for this discount" : "Get a token for this discount"}
      >
        {tokenLoading ? (
          "Getting token..."
        ) : hasToken ? (
          <>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
              <circle cx="8" cy="8" r="3" />
              <path d="M11 8h8M19 6v4" />
              <rect x="2" y="14" width="8" height="6" rx="1" />
            </svg>
            Show Token
          </>
        ) : (
          "Get Token"
        )}
      </GetTokenButton>

      <SectionTitle className="contact-sec">Reach Us To Redeem</SectionTitle>

      <ContactSectionContent>
        {handles && (
          <ContactButtons className="small">
            {handles.whatsapp && (
              <ContactButton href={`https://wa.me/${organizer.phone_number}`} target="_blank" aria-label="Contact via WhatsApp">
                <img src="/images/icons/whatsapp.png" alt="WhatsApp" width="42" height="42" />
              </ContactButton>
            )}
            {handles.facebook && (
              <ContactButton href={handles.facebook} target="_blank" aria-label="Visit Facebook page">
                <img src="/images/icons/Facebook.webp" alt="Facebook" width="42" height="42" />
              </ContactButton>
            )}
            {handles.instagram && (
              <ContactButton href={handles.instagram} target="_blank" aria-label="Visit Instagram page">
                <img src="/images/icons/Instagram.png" alt="Instagram" width="42" height="42" />
              </ContactButton>
            )}
            {handles.twitter && (
              <ContactButton href={handles.twitter} target="_blank" aria-label="Visit Twitter page">
                <img src="/images/icons/twitter.svg" alt="Twitter" width="42" height="42" />
              </ContactButton>
            )}
          </ContactButtons>
        )}
        <ContactButtons>
          <PhoneButton
            href={`tel:${organizer.phone_number}`}
            target="_blank"
            onMouseEnter={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
            style={{ position: "relative" }}
            aria-label={`Call ${organizer.phone_number}`}
          >
            <img src="/images/icons/phone-calling-w.svg" alt="" width="15" height="15" />
            <b>Phone</b>
            {showPopup && (
              <PhoneToolTip role="tooltip">
                <p>{organizer.phone_number}</p>
              </PhoneToolTip>
            )}
          </PhoneButton>
          <WebLinkButton href={websiteUrl} target="_blank" aria-label="Visit merchant website">
            <img src="/images/icons/globe-v.svg" alt="" width="14" height="14" />
            <b>Website</b>
          </WebLinkButton>
        </ContactButtons>
      </ContactSectionContent>
    </ContactSection>
  );
};

// ─── Sub-component: OrganizerSection ─────────────────────────────────────────────

const OrganizerSection = ({ discount, displayedFollowers, following, onFollow }) => (
  <AboutOrganiserAndMap>
    <SectionContent>
      <Map id="mapIframe">{parse(discount.address)}</Map>
      <AboutOrganiser>
        <Wrapper className="about-organizer">
          <OrganiserProfile>
            <img src="/images/1.jpg" alt={`${discount.organizer.name} profile`} width="100" height="100" />
          </OrganiserProfile>
          <div>
            <h4>{discount.organizer.name}</h4>
            <Followers>
              <span>{displayedFollowers}</span>&nbsp;
              {displayedFollowers === 1 ? "Follower" : "Followers"}
            </Followers>
          </div>
        </Wrapper>
        <OrganiserInfo>
          <p>{discount.organizer.description}</p>
        </OrganiserInfo>
        <OrganiserButtons>
          <FollowButton
            onClick={onFollow}
            aria-pressed={following}
            aria-label={following ? `Unfollow ${discount.organizer.name}` : `Follow ${discount.organizer.name}`}
          >
            {following ? "Unfollow" : "Follow"}
          </FollowButton>
        </OrganiserButtons>
      </AboutOrganiser>
    </SectionContent>
  </AboutOrganiserAndMap>
);

// ─── Sub-component: GallerySection ───────────────────────────────────────────────

const GallerySection = ({ media }) => {
  if (!media?.length) return null;
  return (
    <SectionWrapper>
      <DiscountGalleryTitle>Gallery</DiscountGalleryTitle>
      <DiscountGallery>
        <GalleryScroll id="gallery">
          <Gallery photos={media} type={null} />
        </GalleryScroll>
        <LeftButton target="gallery" pos="0" />
        <RightButton target="gallery" pos="0" />
      </DiscountGallery>
    </SectionWrapper>
  );
};

// ─── Sub-component: ReviewsSection ───────────────────────────────────────────────

const ReviewsSection = ({ discount, reviews, canReview }) => {
  const user      = useSelector((s) => s.userState.user);
  const dispatch  = useDispatch();
  const authToken = useSelector((s) => s.userState.token?.access ?? null);
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const reviewList = reviews?.results || [];

  const api = useMemo(() => authAxios(authToken), [authToken]);

  const handleFetch = async ({ sort, ratingFilter, verifiedOnly }) => {
    setLoading(true);
    try {
      return await dispatch(
        getDiscountReviewsAPI({
          discount: discount.id,
          sort: sort || "helpful",
          rating: ratingFilter,
          is_verified: verifiedOnly,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (data) => {
    if (!user) { navigate("/login"); return; }
    try {
      const res = await api.post("/reviews/create/", {
        discount: discount.id,
        rating: data.rating,
        title: data.title,
        content: data.content,
      });
      return res.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  };

  const handleVote = async (type, review) => {
    try {
      await api.post(`/reviews/${review.id}/${type === "helpful" ? "helpful" : "unhelpful"}/`, {});
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplySubmit = useCallback((_reviewId, content) =>
    Promise.resolve({
      id: Date.now(),
      author: "Organizer",
      content,
      created_at: new Date().toISOString(),
    }), []);

  return (
    <CommentsSection>
      <ReviewSectionContent>
        <SectionTitle>Customer Reviews</SectionTitle>
        <ReviewList
          reviews={reviewList}
          stats={{ total_rating: discount.total_rating, average_rating: discount.average_rating }}
          loading={loading}
          isOrganizer={true}
          showWriteReview={canReview}
          ReviewItemComponent={(props) => (
            <ReviewItem
              {...props}
              formatTime={(date) => new Date(date).toLocaleDateString()}
              onVote={handleVote}
              ReplyComponent={(replyProps) => (
                <ReplyBox
                  {...replyProps}
                  isVisible={true}
                  onSubmit={(content) => handleReplySubmit(replyProps.reviewId, content)}
                />
              )}
            />
          )}
          ReviewFormComponent={(props) => <ReviewForm {...props} onSubmit={handleCreateReview} />}
          StatsComponent={ReviewStats}
          onFetch={handleFetch}
          onCreateReview={handleCreateReview}
        />
      </ReviewSectionContent>
    </CommentsSection>
  );
};

// ─── Sub-component: RecommendedSection ───────────────────────────────────────────

const RecommendedSection = ({ recommendedDiscounts }) => {
  if (!recommendedDiscounts?.length) return null;
  return (
    <SuggestedDiscounts>
      <RecommendedDiscounts id="recommended-section" className="category-section">
        <SuggestedDiscountsTitle>
          <h4>Recommended deals</h4>
          <h4><Link to="/discounts">See more</Link></h4>
        </SuggestedDiscountsTitle>
        <CarouselFlex divId="recommended" type="category" classId="recommendations">
          {recommendedDiscounts.slice(0, 4).map((rec) => (
            <Card key={rec.id} discount={rec} bgColor="light" />
          ))}
        </CarouselFlex>
      </RecommendedDiscounts>
    </SuggestedDiscounts>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────────

const DiscountDetail = () => {
  const dispatch  = useDispatch();
  const user      = useSelector((s) => s.userState.user);
  const authToken = useSelector((s) => s.userState.token?.access ?? null);
  const discounts = useSelector((s) => s.discountState.discounts);
  const discountMedia  = useSelector((s) => s.discountState.discount_media);
  const reviews        = useSelector((s) => s.discountState.reviews);
  const isFollowerData = useSelector((s) => s.userState.is_follower);
  const userLike       = useSelector((s) => s.discountState.user_discount_like);

  // Token / redemption state
  const [token,        setToken]        = useState(null);
  const [tokenError,   setTokenError]   = useState(null);
  const [isRedeemed,   setIsRedeemed]   = useState(false);
  const [hasToken,     setHasToken]     = useState(false);
  const [hasReviewed,  setHasReviewed]  = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);

  // Modal visibility state
  const [showTokenModal, setShowTokenModal] = useState(false);

  const [localCounts, setLocalCounts] = useState({ likes: 0, followers: 0 });

  const { discountId } = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();

  const followLock = useRef(false);
  const likeLock   = useRef(false);

  const api = useMemo(() => authAxios(authToken), [authToken]);

  // ── Derived data ────────────────────────────────────────────────────────────

  const discount = useMemo(
    () => discounts?.results?.find((o) => o.id === +discountId) ?? null,
    [discounts?.results, discountId]
  );

  const organizerDiscounts = useMemo(() => {
    if (!discount || !discounts?.results) return null;
    const filtered = discounts.results.filter(
      (item) => item.id !== discount.id && item.organizer.id === discount.organizer.id
    );
    return filtered.length > 0 ? filtered : null;
  }, [discount, discounts?.results]);

  const recommendedDiscounts = useMemo(() => {
    if (!discount || !discounts?.results) return null;
    const categoryNames = new Set(discount.categories.map((c) => c.name));
    const filtered = discounts.results.filter(
      (item) =>
        item.id !== discount.id &&
        item.categories.some((c) => categoryNames.has(c.name))
    );
    return filtered.length > 0 ? filtered : null;
  }, [discount, discounts?.results]);

  const liked     = !!userLike;
  const following = !!isFollowerData?.user;

  // ── Video autoplay ──────────────────────────────────────────────────────────

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!discount?.video_url || !videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPlaying(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [discount?.video_url]);

  // ── Data loading effects ────────────────────────────────────────────────────

  useEffect(() => {
    if (!discounts?.results) dispatch(getDiscountsAPI());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!discount) return;
    dispatch(setPreviousUrl(location.pathname));
    if (authToken) {
      dispatch(isUserFollowerAPI(discount.organizer.id));
      dispatch(isDiscountLikedByUserAPI(discount.id));
    }
  }, [discountId, authToken, discount?.id, discount?.organizer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getDiscountReviewsAPI({ discount: discount?.id }));
  }, [discountId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!discount) return;
    const mediaEmpty = !discountMedia?.length;
    const mediaForOtherDiscount =
      discountMedia?.length > 0 && discountMedia[0].discount !== discount.url;
    if (mediaEmpty || mediaForOtherDiscount) dispatch(getDiscountMediaAPI(discountId));
  }, [discount?.url, discountMedia]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!discount) return;
    setLocalCounts({
      likes: discount.likes ?? 0,
      followers: discount.organizer?.followers ?? 0,
    });
  }, [discount?.id, discount?.likes, discount?.organizer?.followers]);

  // ── Check redemption + review status on mount / discount change ─────────────

  useEffect(() => {
    if (!discount || !authToken) return;

    const check = async () => {
      try {
        const redemptionRes = await api.get(`/tokens/discount/${discount.id}/redeemed/`);
        const redeemed = redemptionRes.data?.is_redeemed ?? false;
        setIsRedeemed(redeemed);
        if (redeemed) {
          setHasToken(true);
          // If user already has a token, fetch its value so "Show Token" works
          try {
            const tokenRes = await api.get(`/tokens/discount/${discount.id}/`);
            if (tokenRes.data) setToken(tokenRes.data);
          } catch {
            // Token fetch failed; "Show Token" will still render but modal may show a
            // placeholder — handled gracefully in TokenModal via tokenValue fallback.
          }
          const reviewRes = await api.get("/reviews/has-reviewed/", {
            params: { discount_id: discount.id },
          });
          setHasReviewed(reviewRes.data?.has_reviewed ?? false);
        }
      } catch (err) {
        console.error("Redemption / review check failed:", err);
      }
    };

    check();
  }, [discount?.id, authToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Event handlers ──────────────────────────────────────────────────────────

  const handleGetToken = useCallback(async () => {
    if (!user)               { navigate("/login"); return; }
    if (hasToken || tokenLoading) return;

    setTokenLoading(true);
    setTokenError(null);
    try {
      const res = await api.post("/tokens/", { discount_id: discount.id });
      setToken(res.data);
      setHasToken(true);
      setShowTokenModal(true); // Auto-open modal after successful token creation
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.discount_id?.[0] ||
        "Failed to get token. Please try again.";
      console.error("Token creation failed:", err);
      setTokenError(msg);
    } finally {
      setTokenLoading(false);
    }
  }, [user, hasToken, tokenLoading, discount?.id, api, navigate]);

  const handleShowToken = useCallback(() => {
    setShowTokenModal(true);
  }, []);

  const handleCloseTokenModal = useCallback(() => {
    setShowTokenModal(false);
  }, []);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied: " + window.location.href);
  }, []);

  const handleFollow = useCallback(async () => {
    if (followLock.current || !discount) return;
    followLock.current = true;

    if (!user) { followLock.current = false; navigate("/login"); return; }

    setLocalCounts((prev) => ({
      ...prev,
      followers: following ? Math.max(0, prev.followers - 1) : prev.followers + 1,
    }));

    try {
      if (following) {
        const res = await api.delete(
          `/discounts/organizer/followers/delete/${isFollowerData?.id}/`
        );
        if (res.status === 204) dispatch(setUserIsFollower(null));
      } else {
        const res = await api.post("/discounts/organizer/followers/add/", {
          organizer_pk: discount.organizer.id,
        });
        if (res.data) dispatch(setUserIsFollower(res.data));
      }
    } catch {
      setLocalCounts((prev) => ({
        ...prev,
        followers: following ? prev.followers + 1 : Math.max(0, prev.followers - 1),
      }));
    } finally {
      followLock.current = false;
    }
  }, [following, discount, isFollowerData?.id, api, user, navigate, dispatch]);

  const handleLike = useCallback(async () => {
    if (likeLock.current || !discount) return;
    likeLock.current = true;

    if (!user) { likeLock.current = false; navigate("/login"); return; }

    setLocalCounts((prev) => ({
      ...prev,
      likes: liked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
    }));

    try {
      if (liked) {
        const res = await api.delete(`/discounts/likes/delete/${userLike?.id}/`);
        if (res.status === 204) dispatch(setUserDiscountLike(null));
      } else {
        const res = await api.post("/discounts/likes/add/", { discount_id: discount.id });
        if (res.data) dispatch(setUserDiscountLike(res.data));
      }
    } catch {
      setLocalCounts((prev) => ({
        ...prev,
        likes: liked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
      }));
    } finally {
      likeLock.current = false;
    }
  }, [liked, discount, userLike?.id, api, user, navigate, dispatch]);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!discount) return <Loading />;

  return (
    <Container>
      {/* Token modal — rendered at top level so it overlays everything */}
      {showTokenModal && token && (
        <TokenModal
          token={token}
          onClose={handleCloseTokenModal}
          discountEndDate={discount.end_date}
        />
      )}

      <HeroSection discount={discount} onShare={handleShare} />

      <AboutDiscountWrapper>
        <AboutDiscount>
          <DiscountInfoSection
            discount={discount}
            liked={liked}
            displayedLikes={localCounts.likes}
            onLike={handleLike}
          />
          <ContactInfoSection
            organizer={discount.organizer}
            websiteUrl={discount.website_url}
            onGetToken={handleGetToken}
            tokenLoading={tokenLoading}
            hasToken={hasToken}
            onShowToken={handleShowToken}
          />
        </AboutDiscount>
      </AboutDiscountWrapper>

      {tokenError && (
        <p style={{ color: "red", textAlign: "center", margin: "8px 0" }}>{tokenError}</p>
      )}

      <OrganizerSection
        discount={discount}
        displayedFollowers={localCounts.followers}
        following={following}
        onFollow={handleFollow}
      />

      {discount.video_url && (
        <SectionWrapper>
          <VideoWrap ref={videoRef}>
            <ReactPlayer
              width="100%"
              url={discount.video_url}
              controls
              muted
              volume={0.2}
              playing={isPlaying}
            />
          </VideoWrap>
        </SectionWrapper>
      )}

      <GallerySection media={discountMedia} />

      <ReviewsSection
        discount={discount}
        reviews={reviews}
        canReview={isRedeemed && !hasReviewed}
      />

      <RecommendedSection recommendedDiscounts={recommendedDiscounts} />
    </Container>
  );
};

export default DiscountDetail;

// ─── Styled components ────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

// ── Modal ──

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: ${slideUp} 0.25s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ModalCloseButton = styled.button`
  background: #f4f4f4;
  border: none;
  outline: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #e8e8e8;
    color: #111;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TokenLabel = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
`;

const TokenDisplayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #faf5ff;
  border: 1.5px dashed #c084fc;
  border-radius: 12px;
  padding: 14px 16px;
`;

const TokenValue = styled.span`
  flex: 1;
  font-family: "Courier New", Courier, monospace;
  font-size: 18px;
  font-weight: 700;
  color: #67309b;
  letter-spacing: 0.08em;
  word-break: break-all;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s, transform 0.1s;

  background: ${({ $copied }) => ($copied ? "#e8f5e9" : "#67309b")};
  color:      ${({ $copied }) => ($copied ? "#2e7d32" : "#fff")};

  &:hover {
    transform: translateY(-1px);
    background: ${({ $copied }) => ($copied ? "#e8f5e9" : "#57288b")};
  }
  &:active {
    transform: translateY(0);
  }
`;

const TokenExpiryNote = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${({ $expired }) => ($expired ? "#fff3f3" : "#fff8f0")};
  color:      ${({ $expired }) => ($expired ? "#c0392b" : "#b36200")};
  border: 1px solid ${({ $expired }) => ($expired ? "#fcc" : "#fde8c8")};

  strong {
    font-weight: 700;
  }
`;

const ExpiryIcon = styled.span`
  font-size: 15px;
  line-height: 1;
`;

// ── Existing styled components (unchanged) ──

const Container = styled.div`
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
  text-align: left;
  background: #fff;

  @media (min-width: 768px) {
    width: 70%;
    margin: 0 auto;
  }
  @media only screen and (min-width: 120em) {
    width: 60%;
    margin: 0 auto;
  }
  @media only screen and (min-width: 160em) {
    width: 50%;
    margin: 0 auto;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  &.about-organizer {
    @media only screen and (min-width: 621px) and (max-width: 1200px) {
      flex-wrap: wrap;
    }
  }
`;

const VideoWrap = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
`;

const DiscountImageWrapper = styled.div`
  width: 100%;
  height: 50vh;
  margin-top: 70px;
  position: relative;
  @media (max-width: 768px) {
    margin-top: 45px;
  }
`;

const DiscountImage = styled.div`
  background-color: #333;
  background-position: center;
  background-size: cover;
  height: inherit;
  background-image: ${(props) => `url(${props.imgUrl})`};
  margin: 0 auto;
  border-radius: 0 0 30px 30px;
`;

const DiscountBadge = styled(Badge)`
  position: static;
  box-shadow: none;
  transform: none;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 20px;
  &:hover {
    transform: none;
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  padding: 12px 16px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  justify-content: center;
  margin: 0 auto;
  max-width: 400px;

  @media (max-width: 380px) {
    flex-wrap: wrap;
    justify-content: center;
    bottom: 15px;
    left: 5%;
    right: 5%;
    width: 90%;
    padding: 10px 14px;

    ${DiscountBadge} {
      width: 100%;
      text-align: center;
    }
  }
`;

const ShareDiscount = styled.button`
  background-color: rgba(0, 0, 0, 0.9);
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const ExpiryTag = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  border: none;
  outline: none;
  padding: 0 24px;
  border-radius: 25px;
  color: #e05a00;
  font-family: var(--font-sans);
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 15px rgba(255, 165, 0, 0.4);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  span {
    font-size: 12px;
    color: white;
    font-weight: 800;
  }

  &[data-expired="true"] {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
    transform: scale(1.05);
    font-size: 15px;
    font-weight: 900;
    animation: pulse 2s infinite;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px 24px;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4); }
    50%  { box-shadow: 0 6px 20px rgba(255, 68, 68, 0.6); }
    100% { box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4); }
  }
`;

const SectionWrapper = styled.div``;

const SectionContent = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  @media (max-width: 620px) {
    flex-wrap: wrap;
  }
`;

const ReviewSectionContent = styled(SectionContent)`
  margin: 0 auto;
  display: block;
  @media (max-width: 620px) {
    flex-wrap: no-wrap;
    padding: 10px;
  }
`;

const AboutDiscountWrapper = styled(SectionWrapper)``;

const AboutDiscount = styled(SectionContent)`
  margin-top: 40px;
`;

const DiscountInfo = styled.div`
  color: #36454f;
  padding: 10px;
  width: 70%;
  @media (max-width: 620px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  margin-top: 1px;
  padding-bottom: 2px;
  font-size: 30px;
  display: flex;
  align-items: baseline;
`;

const Colored = styled.span`
  color: #fa8128;
`;

const GetTokenButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 80%;
  max-width: 150px;
  height: 36px;
  margin: 0 auto 10px;
  border-radius: 30px;
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: #fff;
  /* "Show Token" gets a purple outline style; loading gets grey; default gets orange */
  background-color: ${({ $loading, $hasToken }) =>
    $loading ? "#ccc" : $hasToken ? "#67309b" : "#fa8128"};
  transition: background-color 0.2s, transform 0.15s;

  &:hover:not(:disabled) {
    background-color: ${({ $hasToken }) => ($hasToken ? "#57288b" : "#e67020")};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ContactSection = styled.div`
  width: 30%;
  & > h4 {
    text-align: center;
    margin: 30px auto;
    padding: 0;
  }
  @media (max-width: 620px) {
    width: 100%;
    & > h4 {
      margin: 0 auto;
    }
  }
`;

const ContactSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 620px) {
    margin-top: 0;
  }
`;

const ContactButtons = styled.div`
  &.small {
    width: fit-content;
    margin: 0 auto;
  }
  @media (max-width: 620px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const ContactButton = styled.a`
  display: inline-block;
  text-decoration: none;
  text-align: center;
  margin: 5px;
  color: blue;
  background-color: #fff;
  border-radius: 30px;
  outline: none;
  &.active {
    text-decoration: none;
  }
`;

const WebLinkButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  width: 80%;
  max-width: 150px;
  height: 30px;
  margin: 10px auto;
  border: none;
  outline: none;
  border-radius: 30px;
  border: 1px solid #67309b;
  color: #67309b;
  background-color: #fff;
  & > img {
    border: none;
    outline: none;
    margin-right: 5px;
  }
  &:hover,
  &.active {
    text-decoration: none;
    color: #67309b;
  }
`;

const PhoneButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 150px;
  height: 30px;
  margin: 10px auto;
  border: none;
  outline: none;
  text-decoration: none;
  border-radius: 30px;
  border: 1px solid #808080;
  color: #fff;
  background-color: #67309b;
  cursor: pointer;
  & > img {
    border: none;
    outline: none;
    margin-right: 5px;
  }
  &.active,
  &:hover {
    text-decoration: none;
    color: #fff;
  }
`;

const PhoneToolTip = styled.div`
  position: absolute;
  top: -150%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #67309b;
  border: 1px solid #67309b;
  border-radius: 10px;
  padding: 10px;
  z-index: 100;
  p {
    padding: 0;
    margin: 0;
  }
`;

const Followers = styled(ContactButton)`
  display: inline-block;
  width: 150px;
  height: 30px;
  margin: 10px;
  border: none;
  outline: none;
  border-radius: 30px;
  border: 1px solid #fa8128;
  color: #fa8128;
  font-weight: 600;
  cursor: default;
`;

const Like = styled.button`
  padding: 2px;
  height: 25px;
  display: flex;
  align-items: center;
  color: #fa8128;
  font-size: 14px;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;

  svg {
    width: 25px;
    height: 25px;
    margin-right: 8px;
    fill: ${(props) => (props.$liked ? "#fa8128" : "#888")};
    padding: 3px;
    background: #e5e4e2;
    border-radius: 50%;
    opacity: 0.7;
    transition: transform 0.15s ease, fill 0.2s ease;
  }
  &:hover svg {
    transform: scale(1.1);
  }
`;

const Description = styled.div`
  margin: 10px 0;
  line-height: 1.75;
  @media (max-width: 530px) {
    font-size: 16px;
    padding: 5px 0;
  }
`;

const DescriptionContent = styled.div`
  max-height: ${(props) => (props.$expanded ? "none" : "100px")};
  overflow: hidden;
  transition: max-height 0.5s ease-out;
`;

const ReadMoreOrLess = styled.button`
  margin: 10px auto;
  font-size: 12px;
  padding: 3px 8px;
  width: fit-content;
  display: flex;
  justify-content: space-around;
  border: 1px solid #a9a9a9;
  outline: none;
  border-radius: 15px;
  text-align: center;
  color: #818589;
  cursor: pointer;
  background: transparent;
`;

const AboutOrganiserAndMap = styled(SectionWrapper)`
  margin: 10px 0;
  padding: 30px 0;
  background: #fcfbf4;
`;

const Map = styled.div`
  width: 60%;
  height: 300px;
  background: #fff;
  border-radius: 10px;
  margin: 10px 0;
  border: 1px solid #e5e4e2;
  background-position: center;
  background-size: cover;
  @media (max-width: 620px) {
    width: 100%;
    margin: 5px;
  }
`;

const AboutOrganiser = styled.div`
  width: 35%;
  height: fit-content;
  background: #fff;
  border: 1px solid #e5e4e2;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  text-align: center;
  h4 {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #000;
  }
  @media (max-width: 620px) {
    width: 100%;
  }
`;

const OrganiserProfile = styled.div`
  width: 35%;
  & > img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid #e5e4e2;
  }
  @media only screen and (min-width: 621px) and (max-width: 1200px) {
    width: 100%;
  }
`;

const OrganiserButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const FollowButton = styled.button`
  display: inline-block;
  text-align: center;
  width: 100px;
  padding: 5px 0;
  margin: 10px;
  color: white;
  background-color: #67309b;
  border: none;
  border-radius: 30px;
  outline: none;
  cursor: pointer;
  &:hover,
  &.active {
    text-decoration: none;
    color: white;
  }
`;

const OrganiserInfo = styled.div`
  margin: 0 15px;
`;

const CommentsSection = styled(SectionWrapper)`
  margin: 10px 0;
`;

const SectionTitle = styled.h4`
  margin: 10px 0;
  padding: 30px 0;
  color: #000;
  @media (max-width: 620px) {
    margin: 0;
  }
  &.contact-sec {
    @media (max-width: 620px) {
      margin: 10px 0 20px;
    }
  }
`;

const SuggestedDiscounts = styled(SectionWrapper)`
  margin: 0;
`;

const RecommendedDiscounts = styled.div``;

const SuggestedDiscountsTitle = styled.div`
  color: #fa8128;
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    padding: 5px;
    a {
      color: #808080;
      font-size: 14px;
      text-decoration: none;
      &:hover {
        cursor: default;
      }
    }
  }
  @media (min-width: 768px) {
    margin: 0 auto;
  }
`;

const DiscountGallery = styled.div`
  position: relative;
  margin: 0 10px;
`;

const DiscountGalleryTitle = styled.h4`
  padding: 10px;
  margin: 0;
  color: #000;
`;

const GalleryScroll = styled.div`
  display: flex;
  padding: 0;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 20px 10px;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;