import React, {
    useRef,
    useCallback,
    useMemo,
    useState,
    useEffect,
} from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import parse from "html-react-parser";
import styled from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";

import { LeftButton, RightButton } from "../Shared/CarouselControls";
import Loading from "../Shared/Loading";
import Gallery from "../Gallery/Gallery";
import CustomerReview from "./CustomerReview";
import StarRating from "./StarRating";
import CarouselFlex from "../Shared/CarouselFlex";
import Card, { Badge } from "../Shared/Card";

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

// ─── Pure helpers ──────────────────────────────────────────────────────────────

/** Returns "Expired", a day-count string, or null when no end date is given. */
function getDaysLeft(endDateStr) {
    if (!endDateStr) return null;
    const end = new Date(endDateStr + "T23:59:59");
    const now = new Date();
    if (now >= end) return "Expired";
    return String(Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

/** Formats an ISO date string as "12 Apr" style. */
function formatExpiry(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}

// ─── Sub-component: ExpandableDescription ─────────────────────────────────────
// Keeps all DOM measurement & toggle state self-contained; parent stays clean.

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
                <ReadMoreOrLess
                    onClick={() => setExpanded((prev) => !prev)}
                    aria-expanded={expanded}
                >
                    {expanded ? "Read Less" : "Read More"}
                </ReadMoreOrLess>
            )}
        </>
    );
};

// ─── Sub-component: HeroSection ───────────────────────────────────────────────

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

// ─── Sub-component: DiscountInfoSection ───────────────────────────────────────

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
            <ExpandableDescription html={discount.description} />
        </Description>
    </DiscountInfo>
);

// ─── Sub-component: ContactSection ────────────────────────────────────────────

const ContactInfoSection = ({ organizer, websiteUrl }) => {
    const [showPopup, setShowPopup] = useState(false);
    const handles = organizer.social_media_handles;

    return (
        <ContactSection>
            <SectionTitle className="contact-sec">Contact Us</SectionTitle>
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

// ─── Sub-component: OrganizerSection ──────────────────────────────────────────

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

// ─── Sub-component: GallerySection ────────────────────────────────────────────

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

// ─── Sub-component: ReviewsSection ────────────────────────────────────────────

const ReviewsSection = ({ discount, reviews }) => (
    <CommentsSection>
        <ReviewSectionContent>
            <SectionTitle>Customer Reviews</SectionTitle>
            <ReviewSectionHeader>
                <Left>
                    <Rating>{discount.average_rating}</Rating>
                    <Stars>
                        <StarRating rating={discount.average_rating} showRate={false} />
                        <p>{discount.total_rating} ratings</p>
                    </Stars>
                </Left>
                <Right>
                    <label htmlFor="reviews-sort">Sort by&nbsp;</label>
                    <select name="reviews-sort" id="reviews-sort">
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Least Rated</option>
                    </select>
                </Right>
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

            <CommentList>
                {!reviews?.results?.length ? (
                    <NoComments>There are no reviews yet.</NoComments>
                ) : (
                    // Reverse once into a stable copy; slice avoids mutating Redux state
                    [...reviews.results].reverse().map((review) => (
                        <CustomerReview
                            className="customer-review"
                            key={review.id}
                            discount={discount}
                            review={review}
                        />
                    ))
                )}
            </CommentList>
        </ReviewSectionContent>
    </CommentsSection>
);

// ─── Sub-component: RecommendedSection ────────────────────────────────────────

const RecommendedSection = ({ recommendedDiscounts }) => {
    if (!recommendedDiscounts?.length) return null;
    return (
        <SuggestedDiscounts>
            <RecommendedDiscounts id="recommended-section" className="category-section">
                <SuggestedDiscountsTitle>
                    <h4>Recommended deals</h4>
                    <h4>
                        <Link to="/discounts">See more</Link>
                    </h4>
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

// ─── Main component ────────────────────────────────────────────────────────────

const DiscountDetail = () => {
    // ── Redux ─────────────────────────────────────────────────────────────────
    // useSelector replaces connect(mapStateToProps); no prop drilling required.
    const dispatch = useDispatch();
    const user           = useSelector((s) => s.userState.user);
    const authToken      = useSelector((s) => s.userState.token?.access ?? null);
    const discounts      = useSelector((s) => s.discountState.discounts);
    const discountMedia  = useSelector((s) => s.discountState.discount_media);
    const reviews        = useSelector((s) => s.discountState.reviews);
    const isFollowerData = useSelector((s) => s.userState.is_follower);
    const userLike       = useSelector((s) => s.discountState.user_discount_like);

    // ── Local reducer-backed state synced with Redux ──
    const [localCounts, setLocalCounts] = useState({
        likes: 0,
        followers: 0,
    });

    // ── Routing ───────────────────────────────────────────────────────────────
    const { discountId } = useParams();
    const navigate  = useNavigate();
    const location  = useLocation();

    // ── Click-race guards — refs so they never trigger re-renders ─────────────
    const followLock = useRef(false);
    const likeLock   = useRef(false);

    // ── Derived data from Redux — no local copies, always in sync ─────────────
    const discount = useMemo(
        () => discounts?.results?.find((obj) => obj.id === +discountId) ?? null,
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

    // Booleans derived from Redux — stay in sync automatically
    const liked     = !!userLike;
    const following = !!isFollowerData?.user;

    const displayedLikes = localCounts.likes;
    const displayedFollowers = localCounts.followers;

    // ── Video autoplay (IntersectionObserver) ──────────────────────────────────
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

    // ── Data loading effects — each has exactly one responsibility ─────────────

    // Load the discount list once on mount if not already fetched
    useEffect(() => {
        if (!discounts?.results) dispatch(getDiscountsAPI());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Record URL + check follow/like whenever the resolved discount changes
    useEffect(() => {
        if (!discount) return;
        dispatch(setPreviousUrl(location.pathname));
        if (authToken) {
            dispatch(isUserFollowerAPI(discount.organizer.id));
            dispatch(isDiscountLikedByUserAPI(discount.id));
        }
    }, [discountId, authToken, discount?.id, discount?.organizer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load reviews whenever the route param changes
    useEffect(() => {
        dispatch(getDiscountReviewsAPI(discountId));
    }, [discountId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load media only when the discount changes or media belongs to a different discount
    useEffect(() => {
        if (!discount) return;
        const mediaEmpty             = !discountMedia?.length;
        const mediaForOtherDiscount  = discountMedia?.length > 0 && discountMedia[0].discount !== discount.url;
        if (mediaEmpty || mediaForOtherDiscount) dispatch(getDiscountMediaAPI(discountId));
    }, [discount?.url, discountMedia]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!discount) return;

        setLocalCounts({
            likes: discount.likes ?? 0,
            followers: discount.organizer?.followers ?? 0,
        });
    }, [discount?.id, discount?.likes, discount?.organizer?.followers]);

    // ── Event handlers ─────────────────────────────────────────────────────────

    const handleShare = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied: " + window.location.href);
    }, []);
    

    const handleFollow = useCallback(async () => {
        if (followLock.current || !discount) return;
        followLock.current = true;

        if (!user) {
            followLock.current = false;
            navigate("/login");
            return;
        }

        setLocalCounts((prev) => ({
            ...prev,
            followers: following ? Math.max(0, prev.followers - 1) : prev.followers + 1,
        }));

        try {
            if (following) {
                const res = await axios.delete(
                    `${BASE_URL}/discounts/organizer/followers/delete/${isFollowerData?.id}/`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                if (res.status === 204) dispatch(setUserIsFollower(null));
            } else {
                const res = await axios.post(
                    `${BASE_URL}/discounts/organizer/followers/add/`,
                    { organizer_pk: discount.organizer.id },
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
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
    }, [following, discount, isFollowerData?.id, authToken, user, navigate, dispatch]);


    const handleLike = useCallback(async () => {
        if (likeLock.current || !discount) return;
        likeLock.current = true;

        if (!user) {
            likeLock.current = false;
            navigate("/login");
            return;
        }

        // optimistic update from SINGLE source of truth
        setLocalCounts((prev) => ({
            ...prev,
            likes: liked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
        }));

        try {
            if (liked) {
                const res = await axios.delete(
                    `${BASE_URL}/discounts/likes/delete/${userLike?.id}/`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
                if (res.status === 204) dispatch(setUserDiscountLike(null));
            } else {
                const res = await axios.post(
                    `${BASE_URL}/discounts/likes/add/`,
                    { discount_id: discount.id },
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                if (res.data) dispatch(setUserDiscountLike(res.data));
            }
        } catch {
            // rollback from SAME source
            setLocalCounts((prev) => ({
                ...prev,
                likes: liked ? prev.likes + 1 : Math.max(0, prev.likes - 1),
            }));
        } finally {
            likeLock.current = false;
        }
    }, [liked, discount, userLike?.id, authToken, user, navigate, dispatch]);

    // ── Render ─────────────────────────────────────────────────────────────────

    if (!discount) return <Loading />;

    return (
        <Container>
            {/* 1. Hero image with badge / expiry overlay */}
            <HeroSection discount={discount} onShare={handleShare} />

            {/* 2. Discount details + contact */}
            <AboutDiscountWrapper>
                <AboutDiscount>
                    <DiscountInfoSection
                        discount={discount}
                        liked={liked}
                        displayedLikes={displayedLikes}
                        onLike={handleLike}
                    />
                    <ContactInfoSection
                        organizer={discount.organizer}
                        websiteUrl={discount.website_url}
                    />
                </AboutDiscount>
            </AboutDiscountWrapper>

            {/* 3. Map + organiser card */}
            <OrganizerSection
                discount={discount}
                displayedFollowers={displayedFollowers}
                following={following}
                onFollow={handleFollow}
            />

            {/* 4. Optional video (autoplay via IntersectionObserver) */}
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

            {/* 5. Photo gallery */}
            <GallerySection media={discountMedia} />

            {/* 6. Customer reviews */}
            <ReviewsSection discount={discount} reviews={reviews} />

            {/* 7. Recommended deals carousel */}
            <RecommendedSection recommendedDiscounts={recommendedDiscounts} />
        </Container>
    );
};

export default DiscountDetail;

// ─── Styled components ─────────────────────────────────────────────────────────

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

const Right = styled.div`
  & > select {
    color: #808080;
    border-radius: 5px;
    border: 1px solid #808080;
    padding: 7px;
  }
  @media (max-width: 620px) {
    width: 100%;
  }
`;

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

const CommentList = styled.div``;

const NoComments = styled.p``;

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