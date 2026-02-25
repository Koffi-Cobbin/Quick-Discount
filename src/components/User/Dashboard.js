/**
 * Dashboard.jsx — Reimagined (v2)
 * QuickDiscount · warm-dark editorial theme
 *
 * New in v2:
 *  ① Settings tab — update name, email, contact & profile photo
 *  ② Organizer Dashboard banner — shown when user.organizer_detail exists
 *
 * Drop-in replacement for src/components/User/Dashboard.js
 * Redux props: user, discounts, wishlist, payment, notifications, organizer
 * Redux dispatchers: updateUser, getWishlist
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWishlistAPI, setPayment, userUpdateAPI } from "../../actions";
import { isContactValid, isEmailValid } from "../../utils/middleware";
import DiscountCard from "../Discounts/DiscountCard";

// ══════════════════════════════════════════════════════════════════
//  THEME TOKENS
// ══════════════════════════════════════════════════════════════════
const T = {
    bg: "#0b0905",
    surface: "rgba(255,255,255,0.032)",
    surfaceHover: "rgba(255,255,255,0.058)",
    border: "rgba(240,236,230,0.07)",
    borderOrange: "rgba(250,129,40,0.28)",
    orange: "#fa8128",
    orangeDim: "rgba(250,129,40,0.14)",
    text: "#f0ece6",
    textMuted: "rgba(240,236,230,0.38)",
    textSub: "rgba(240,236,230,0.60)",
    error: "#ff6b6b",
    radius: "14px",
    radiusSm: "8px",
};

// ══════════════════════════════════════════════════════════════════
//  ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
`;
const borderGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(250,129,40,0); }
  50%       { box-shadow: 0 0 18px rgba(250,129,40,0.12); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// ══════════════════════════════════════════════════════════════════
//  COMPONENT
// ══════════════════════════════════════════════════════════════════
const Dashboard = (props) => {
    const navigate = useNavigate();

    const [wishlistEvents, setWishlistEvents] = useState([]);
    const [activeTab, setActiveTab] = useState("discounts");
    const [greeting, setGreeting] = useState("");
    const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"

    // Settings fields — initialised from Redux user
    const [username, setUsername] = useState(props.user?.name || "");
    const [email, setEmail] = useState(props.user?.email || "");
    const [contact, setContact] = useState(props.user?.contact || "");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(props.user?.profile_pic || null);
    const [emailErr, setEmailErr] = useState("");
    const [contactErr, setContactErr] = useState("");
    const fileRef = useRef();

    // Destructure all props used in effects to satisfy react-hooks/exhaustive-deps
    const {
        wishlist,
        discounts: discountsData,
        notifications: rawNotifications,
        payment,
        organizer,
        getWishlist,
        updateUser,
    } = props;

    const notifications = useMemo(
        () => rawNotifications || [],
        [rawNotifications],
    );
    const discounts = useMemo(
        () => discountsData?.results || [],
        [discountsData],
    );
    const unread = notifications.filter((n) => !n.read).length;
    const isOrganizer = !!(props.user?.organizer_detail || organizer);

    // ── Greeting ──────────────────────────────────────────────────
    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(
            h < 12
                ? "Good morning"
                : h < 17
                  ? "Good afternoon"
                  : "Good evening",
        );
    }, []);

    // ── Wishlist ──────────────────────────────────────────────────
    useEffect(() => {
        if (wishlist) {
            const wUrls = wishlist.map((w) => w.discount);
            setWishlistEvents(discounts.filter((d) => wUrls.includes(d.url)));
        } else {
            getWishlist?.();
        }
    }, [wishlist, discounts, getWishlist]);

    // ── Payment clear ──────────────────────────────────────────────
    useEffect(() => {
        if (payment?.paid) setPayment(null);
    }, [payment]);

    // ── Settings: validators ──────────────────────────────────────
    const validateEmail = (v) => {
        setEmail(v);
        const [, err] = isEmailValid(v);
        setEmailErr(err || "");
    };
    const validateContact = (v) => {
        setContact(v);
        const [, err] = isContactValid(v);
        setContactErr(err || "");
    };
    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };
    const handleSave = (e) => {
        e.preventDefault();
        if (emailErr || contactErr) return;
        setSaveStatus("saving");
        const payload = new FormData();
        payload.append("name", username);
        payload.append("email", email);
        payload.append("contact", contact);
        if (file) payload.append("profile_pic", file);
        updateUser?.(payload);
        setTimeout(() => setSaveStatus("saved"), 1400);
    };

    // ══════════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════════
    return (
        <Page>
            <Grain />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <Hero>
                <HeroLeft>
                    <Avatar
                        style={{
                            backgroundImage: preview
                                ? `url(${preview})`
                                : "none",
                        }}
                        onClick={() => {
                            setActiveTab("settings");
                            fileRef.current?.click();
                        }}
                        title="Change photo"
                    >
                        {!preview && (
                            <AvatarInitial>
                                {(props.user?.name || "U")[0]}
                            </AvatarInitial>
                        )}
                        <AvatarOverlay>📷</AvatarOverlay>
                        <AvatarRing />
                    </Avatar>

                    <HeroText>
                        <Greeting>{greeting},</Greeting>
                        <UserName>
                            {props.user?.name || props.user?.email}
                        </UserName>
                        <UserMeta>
                            Member · QuickDiscount
                            {isOrganizer && <OrgPip>· Organizer</OrgPip>}
                        </UserMeta>
                        {isOrganizer && (
                            <OrgButton
                                onClick={() => navigate("/organizer-dashboard")}
                            >
                                Go to Organizer Dashboard →
                            </OrgButton>
                        )}
                    </HeroText>
                </HeroLeft>

                <StatRow>
                    <Stat delay={0}>
                        <StatNum>{discounts.length}</StatNum>
                        <StatLabel>Active Deals</StatLabel>
                    </Stat>
                    <StatDivider />
                    <Stat delay={80}>
                        <StatNum>{wishlistEvents.length}</StatNum>
                        <StatLabel>Saved</StatLabel>
                    </Stat>
                    <StatDivider />
                    <Stat delay={160}>
                        <StatNum
                            style={{ color: unread > 0 ? T.orange : T.text }}
                        >
                            {unread}
                        </StatNum>
                        <StatLabel>Unread Alerts</StatLabel>
                    </Stat>
                </StatRow>
            </Hero>

            {/* ── Tab bar ──────────────────────────────────────────── */}
            <TabBar>
                {[
                    { id: "discounts", label: "My Discounts" },
                    { id: "saved", label: "Saved" },
                    {
                        id: "notifications",
                        label: `Alerts${unread > 0 ? ` (${unread})` : ""}`,
                    },
                    { id: "settings", label: "Settings" },
                ].map((t) => (
                    <Tab
                        key={t.id}
                        active={activeTab === t.id}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.label}
                        {activeTab === t.id && <TabPip />}
                    </Tab>
                ))}
            </TabBar>

            {/* ── Content ──────────────────────────────────────────── */}
            <ContentArea>
                {/* MY DISCOUNTS */}
                {activeTab === "discounts" && (
                    <Panel key="discounts">
                        {discounts.length === 0 ? (
                            <Empty>
                                <EmptyIcon>🎟</EmptyIcon>
                                <EmptyTitle>No active discounts yet</EmptyTitle>
                                <EmptyBody>
                                    Browse available deals and grab one that
                                    suits you.
                                </EmptyBody>
                            </Empty>
                        ) : (
                            <CardGrid>
                                {discounts.map((d, i) => (
                                    <GridItem key={d.id} delay={i * 60}>
                                        <DiscountCard
                                            discount={d}
                                            showForm={false}
                                        />
                                    </GridItem>
                                ))}
                            </CardGrid>
                        )}
                    </Panel>
                )}

                {/* SAVED */}
                {activeTab === "saved" && (
                    <Panel key="saved">
                        {wishlistEvents.length === 0 ? (
                            <Empty>
                                <EmptyIcon>🔖</EmptyIcon>
                                <EmptyTitle>Nothing saved yet</EmptyTitle>
                                <EmptyBody>
                                    Bookmark deals to find them here quickly.
                                </EmptyBody>
                            </Empty>
                        ) : (
                            <CardGrid>
                                {wishlistEvents.map((d, i) => (
                                    <GridItem key={d.id} delay={i * 60}>
                                        <DiscountCard
                                            discount={d}
                                            showForm={false}
                                        />
                                    </GridItem>
                                ))}
                            </CardGrid>
                        )}
                    </Panel>
                )}

                {/* NOTIFICATIONS */}
                {activeTab === "notifications" && (
                    <Panel key="notifications">
                        {notifications.length === 0 ? (
                            <Empty>
                                <EmptyIcon>🔔</EmptyIcon>
                                <EmptyTitle>All caught up</EmptyTitle>
                                <EmptyBody>
                                    You have no new notifications.
                                </EmptyBody>
                            </Empty>
                        ) : (
                            <NotiList>
                                {notifications.map((n, i) => (
                                    <NotiItem
                                        key={n.id}
                                        unread={!n.read}
                                        delay={i * 50}
                                    >
                                        <NotiDot unread={!n.read} />
                                        <NotiContent>
                                            <NotiText>
                                                {n.message || n.text}
                                            </NotiText>
                                            <NotiTime>
                                                {n.created_at || n.time}
                                            </NotiTime>
                                        </NotiContent>
                                    </NotiItem>
                                ))}
                            </NotiList>
                        )}
                    </Panel>
                )}

                {/* ── SETTINGS ── */}
                {activeTab === "settings" && (
                    <Panel key="settings">
                        <SettingsGrid>
                            {/* Left: Avatar card */}
                            <AvatarCard>
                                <AvatarCardInner
                                    style={{
                                        backgroundImage: preview
                                            ? `url(${preview})`
                                            : "none",
                                    }}
                                    onClick={() => fileRef.current?.click()}
                                    title="Click to change photo"
                                >
                                    {!preview && (
                                        <AvatarCardInitial>
                                            {(props.user?.name || "U")[0]}
                                        </AvatarCardInitial>
                                    )}
                                    <AvatarCardOverlay>
                                        <span>📷</span>
                                        <AvatarCardOverlayText>
                                            Change Photo
                                        </AvatarCardOverlayText>
                                    </AvatarCardOverlay>
                                </AvatarCardInner>

                                <AvatarCardName>
                                    {props.user?.name || "—"}
                                </AvatarCardName>
                                <AvatarCardMeta>
                                    {props.user?.email}
                                </AvatarCardMeta>

                                {/* Hidden file input */}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFile}
                                />

                                {/* Organizer shortcut inside settings */}
                                {isOrganizer && (
                                    <OrgShortcut
                                        onClick={() =>
                                            navigate("/organizer-dashboard")
                                        }
                                    >
                                        🏢 Organizer Dashboard
                                    </OrgShortcut>
                                )}
                            </AvatarCard>

                            {/* Right: Form card */}
                            <FormCard>
                                <FormTitle>Account Details</FormTitle>

                                <FieldGroup>
                                    <FieldLabel htmlFor="s-name">
                                        Display Name
                                    </FieldLabel>
                                    <FieldInput
                                        id="s-name"
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Your name"
                                    />
                                </FieldGroup>

                                <FieldGroup>
                                    <FieldLabel htmlFor="s-email">
                                        Email Address
                                    </FieldLabel>
                                    <FieldInput
                                        id="s-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            validateEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        hasError={!!emailErr}
                                    />
                                    {emailErr && (
                                        <FieldError>{emailErr}</FieldError>
                                    )}
                                </FieldGroup>

                                <FieldGroup>
                                    <FieldLabel htmlFor="s-contact">
                                        Phone Number
                                    </FieldLabel>
                                    <FieldInput
                                        id="s-contact"
                                        type="tel"
                                        value={contact}
                                        onChange={(e) =>
                                            validateContact(e.target.value)
                                        }
                                        placeholder="+233 XX XXX XXXX"
                                        hasError={!!contactErr}
                                    />
                                    {contactErr && (
                                        <FieldError>{contactErr}</FieldError>
                                    )}
                                </FieldGroup>

                                <SaveRow>
                                    <SaveBtn
                                        onClick={handleSave}
                                        disabled={
                                            !!emailErr ||
                                            !!contactErr ||
                                            saveStatus === "saving"
                                        }
                                    >
                                        {saveStatus === "saving" ? (
                                            <>
                                                <Spinner /> Saving…
                                            </>
                                        ) : saveStatus === "saved" ? (
                                            "✓ Saved"
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </SaveBtn>
                                    {saveStatus === "saved" && (
                                        <SaveFeedback>
                                            Your details have been updated.
                                        </SaveFeedback>
                                    )}
                                </SaveRow>
                            </FormCard>
                        </SettingsGrid>
                    </Panel>
                )}
            </ContentArea>
        </Page>
    );
};

// ══════════════════════════════════════════════════════════════════
//  REDUX
// ══════════════════════════════════════════════════════════════════
const mapStateToProps = (state) => ({
    user: state.userState.user,
    discounts: state.discountState.discounts,
    wishlist: state.discountState.wishlist,
    payment: state.userState.payment,
    notifications: state.userState.notifications,
    organizer: state.organizerState.organizer,
});
const mapDispatchToProps = (dispatch) => ({
    getWishlist: () => dispatch(getWishlistAPI()),
    updateUser: (payload) => dispatch(userUpdateAPI(payload)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

// ══════════════════════════════════════════════════════════════════
//  STYLED COMPONENTS
// ══════════════════════════════════════════════════════════════════

const Page = styled.div`
    min-height: 100vh;
    padding-top: 60px;
    background-color: ${T.bg};
    color: ${T.text};
    font-family: "Georgia", "Times New Roman", serif;
    position: relative;
    overflow-x: hidden;
`;
const Grain = styled.div`
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 180px;
`;

/* ── Hero ── */
const Hero = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 28px 20px 24px;
    border-bottom: 1px solid ${T.border};
    background: radial-gradient(
        ellipse 70% 120% at 0% 0%,
        rgba(250, 129, 40, 0.07) 0%,
        transparent 60%
    );
`;
const HeroLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const Avatar = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-color: rgba(250, 129, 40, 0.1);
    border: 1.5px solid rgba(250, 129, 40, 0.38);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    overflow: hidden;
    animation: ${css`
        ${borderGlow} 4s ease-in-out infinite
    `};
`;
const AvatarInitial = styled.span`
    font-family: "Georgia", serif;
    font-size: 1.4rem;
    color: ${T.orange};
`;
const AvatarOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    opacity: 0;
    transition: opacity 0.2s;
    ${Avatar}:hover & {
        opacity: 1;
    }
`;

const AvatarRing = styled.div`
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1px dashed rgba(250, 129, 40, 0.18);
    pointer-events: none;
`;

const HeroText = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
`;

const Greeting = styled.p`
    font-family: "Courier New", monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${T.textMuted};
    margin-bottom: 3px;
`;
const UserName = styled.h2`
    font-size: 1.55rem;
    font-weight: 700;
    color: ${T.text};
    line-height: 1.2;
    margin-bottom: 4px;
`;
const UserMeta = styled.p`
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(250, 129, 40, 0.6);
    display: flex;
    align-items: center;
    gap: 6px;
`;
const OrgPip = styled.span`
    color: rgba(250, 129, 40, 0.85);
`;

const StatRow = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    padding: 14px 0;
    backdrop-filter: blur(8px);
`;

const Stat = styled.div`
    flex: 1;
    text-align: center;
    padding: 0 12px;
    animation: ${css`
        ${fadeUp} .5s ease both
    `};
    animation-delay: ${({ delay }) => delay || 0}ms;
`;

const StatNum = styled.div`
    font-size: 1.65rem;
    font-weight: 700;
    color: ${T.text};
    line-height: 1;
    margin-bottom: 5px;
`;
const StatLabel = styled.div`
    font-family: "Courier New", monospace;
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${T.textMuted};
    white-space: nowrap;
`;
const StatDivider = styled.div`
    width: 1px;
    height: 34px;
    background: ${T.border};
    flex-shrink: 0;
`;

const OrgButton = styled.button`
    font-family: "Courier New", monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${T.orange};
    background: ${T.orangeDim};
    border: 1px solid rgba(250, 129, 40, 0.32);
    border-radius: 8px;
    padding: 8px 14px;
    margin-top: 10px;
    cursor: pointer;
    white-space: nowrap;
    transition:
        background 0.2s,
        border-color 0.2s,
        transform 0.15s;
    &:hover {
        background: rgba(250, 129, 40, 0.22);
        border-color: ${T.orange};
        transform: translateY(-1px);
    }
`;

/* ── Tab bar ── */
const TabBar = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 40px;
    border-bottom: 1px solid ${T.border};
    background: rgba(11, 9, 5, 0.7);
    backdrop-filter: blur(12px);
    @media (max-width: 640px) {
        padding: 0 16px;
        overflow-x: auto;
    }
`;
const Tab = styled.button`
    position: relative;
    flex-shrink: 0;
    font-family: "Courier New", monospace;
    font-size: 11.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ active }) => (active ? T.orange : T.textMuted)};
    background: none;
    border: none;
    cursor: pointer;
    padding: 18px 16px 16px;
    transition: color 0.2s;
    &:hover {
        color: ${({ active }) => (active ? T.orange : T.textSub)};
    }
`;
const TabPip = styled.div`
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 2px;
    background: ${T.orange};
    border-radius: 2px 2px 0 0;
    animation: ${css`
        ${fadeUp} .2s ease both
    `};
`;

/* ── Content ── */
const ContentArea = styled.div`
    position: relative;
    z-index: 1;
    padding: 36px 40px 72px;
    @media (max-width: 640px) {
        padding: 24px 16px 48px;
    }
`;
const Panel = styled.div`
    animation: ${css`
        ${fadeUp} .4s ease both
    `};
`;
const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
`;
const GridItem = styled.div`
    animation: ${css`
        ${fadeUp} .45s ease both
    `};
    animation-delay: ${({ delay }) => delay || 0}ms;
`;

/* ── Notifications ── */
const NotiList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 680px;
`;
const NotiItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    border-radius: ${T.radiusSm};
    background: ${({ unread }) =>
        unread ? "rgba(250,129,40,0.04)" : "transparent"};
    border: 1px solid
        ${({ unread }) => (unread ? "rgba(250,129,40,0.12)" : "transparent")};
    animation: ${css`
        ${fadeUp} .4s ease both
    `};
    animation-delay: ${({ delay }) => delay || 0}ms;
    transition: background 0.2s;
    &:hover {
        background: ${T.surface};
    }
`;
const NotiDot = styled.div`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
    background: ${({ unread }) => (unread ? T.orange : "transparent")};
    border: 1px solid ${({ unread }) => (unread ? T.orange : T.border)};
    animation: ${({ unread }) =>
        unread
            ? css`
                  ${pulse} 2.5s ease-in-out infinite
              `
            : "none"};
`;
const NotiContent = styled.div`
    flex: 1;
`;
const NotiText = styled.p`
    font-size: 0.9rem;
    color: ${T.textSub};
    line-height: 1.55;
    margin-bottom: 5px;
`;
const NotiTime = styled.span`
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: ${T.textMuted};
`;

/* ── Empty state ── */
const Empty = styled.div`
    text-align: center;
    padding: 72px 20px;
    animation: ${css`
        ${fadeUp} .5s ease both
    `};
`;
const EmptyIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 18px;
    opacity: 0.45;
`;
const EmptyTitle = styled.h3`
    font-size: 1.1rem;
    color: ${T.textSub};
    margin-bottom: 8px;
`;
const EmptyBody = styled.p`
    font-family: "Courier New", monospace;
    font-size: 12px;
    letter-spacing: 0.06em;
    color: ${T.textMuted};
`;

/* ══ SETTINGS ══════════════════════════════════════════════════ */
const SettingsGrid = styled.div`
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 28px;
    max-width: 800px;
    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
`;
const AvatarCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    padding: 28px 20px;
    animation: ${css`
        ${fadeUp} .4s ease both
    `};
`;
const AvatarCardInner = styled.div`
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: rgba(250, 129, 40, 0.1);
    border: 2px solid rgba(250, 129, 40, 0.35);
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 16px;
    animation: ${css`
        ${borderGlow} 4s ease-in-out infinite
    `};
`;
const AvatarCardInitial = styled.span`
    font-size: 2rem;
    font-weight: 700;
    color: ${T.orange};
`;
const AvatarCardOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    ${AvatarCardInner}:hover & {
        opacity: 1;
    }
`;
const AvatarCardOverlayText = styled.span`
    font-family: "Courier New", monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    color: #fff;
    margin-top: 4px;
`;
const AvatarCardName = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: ${T.text};
    text-align: center;
`;
const AvatarCardMeta = styled.div`
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.06em;
    color: ${T.textMuted};
    text-align: center;
    margin-top: 4px;
`;
const OrgShortcut = styled.button`
    margin-top: 20px;
    width: 100%;
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${T.orange};
    background: ${T.orangeDim};
    border: 1px solid rgba(250, 129, 40, 0.25);
    border-radius: ${T.radiusSm};
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: rgba(250, 129, 40, 0.22);
    }
`;

const FormCard = styled.div`
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: ${T.radius};
    padding: 28px 28px 24px;
    animation: ${css`
        ${fadeUp} .45s ease both
    `};
`;
const FormTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: ${T.text};
    margin-bottom: 24px;
    padding-bottom: 14px;
    border-bottom: 1px solid ${T.border};
`;
const FieldGroup = styled.div`
    margin-bottom: 20px;
`;
const FieldLabel = styled.label`
    display: block;
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${T.textMuted};
    margin-bottom: 8px;
`;
const FieldInput = styled.input`
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid
        ${({ hasError }) => (hasError ? "rgba(255,107,107,0.55)" : T.border)};
    border-radius: ${T.radiusSm};
    padding: 11px 14px;
    color: ${T.text};
    font-family: "Georgia", serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
    &::placeholder {
        color: ${T.textMuted};
    }
    &:focus {
        border-color: ${({ hasError }) =>
            hasError ? "rgba(255,107,107,0.7)" : T.borderOrange};
    }
`;
const FieldError = styled.p`
    font-family: "Courier New", monospace;
    font-size: 10px;
    letter-spacing: 0.05em;
    color: ${T.error};
    margin-top: 6px;
`;
const SaveRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
`;
const SaveBtn = styled.button`
    font-family: "Courier New", monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #0b0905;
    background: ${T.orange};
    border: none;
    border-radius: 8px;
    padding: 11px 24px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    display: flex;
    align-items: center;
    gap: 8px;
    transition:
        background 0.2s,
        transform 0.15s;
    &:hover:not(:disabled) {
        background: #e0701f;
        transform: translateY(-1px);
    }
`;
const SaveFeedback = styled.span`
    font-family: "Courier New", monospace;
    font-size: 10.5px;
    letter-spacing: 0.07em;
    color: rgba(250, 129, 40, 0.75);
    animation: ${css`
        ${fadeUp} .3s ease both
    `};
`;
const Spinner = styled.span`
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 2px solid rgba(11, 9, 5, 0.3);
    border-top-color: #0b0905;
    border-radius: 50%;
    animation: ${css`
        ${spin} .7s linear infinite
    `};
`;
