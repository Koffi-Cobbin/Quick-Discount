/**
 * DiscountForm — Reimagined
 *
 * Design direction: Warm-dark editorial, matching the rest of the QuickDiscount app.
 * - Deep near-black background, warm off-white text (#f5f0e8 family)
 * - #fa8128 orange as the sole accent / CTA colour
 * - Courier New for micro-labels and tags; Georgia serif for headings
 * - Glass-card panels with subtle border glow
 * - 4-step wizard with animated progress bar (replaces crude next/prev binary)
 * - Section grouping so each step feels purposeful, not an endless scroll
 * - Inline validation feedback, helper text, and smooth slide transitions
 *
 * NOTE: All prop connections (props.getCategories, props.postDiscount, etc.)
 * are preserved as-is from the original. Only the presentation layer changes.
 */

import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { connect } from "react-redux";
import { createId } from "@paralleldrive/cuid2";
import { useLocation } from "react-router-dom";
import Dropzone from "./Features/Dropzone";
import ImageGrid from "./Features/ImageGrid";
import {
  isContactValid,
  isEmailValid,
  isValidURL,
  generateEmbedFromName,
} from "../../utils/middleware";
import {
  getCategoriesAPI,
  createDiscountAPI,
  updateDiscountAPI,
  getDiscountMediaAPI,
  getDiscountPackagesAPI,
  setPreviousUrl,
} from "../../actions";
import Payment from "../Payment/Payment";

// ─── Theme tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0e0d0b",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(240,236,230,0.08)",
  borderFocus: "rgba(250,129,40,0.55)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.18)",
  orangeGlow: "rgba(250,129,40,0.08)",
  text: "#f0ece6",
  textMuted: "rgba(240,236,230,0.45)",
  textSub: "rgba(240,236,230,0.65)",
  error: "#ff6b6b",
  errorBg: "rgba(255,107,107,0.07)",
  radius: "12px",
  radiusSm: "8px",
};

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  min-height: 100vh;
  background-color: ${T.bg};
  background-image:
    radial-gradient(
      ellipse 70% 45% at 50% 0%,
      rgba(250, 129, 40, 0.13) 0%,
      transparent 68%
    ),
    radial-gradient(
      ellipse 40% 30% at 80% 80%,
      rgba(250, 129, 40, 0.05) 0%,
      transparent 60%
    );
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 16px 120px;

  @media (max-width: 480px) {
    padding: 72px 12px 140px;
  }

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px 256px;
  }

  &::after {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(250, 129, 40, 0.5) 25%,
      rgba(250, 129, 40, 0.25) 65%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

const CardOuter = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 640px;
  animation: ${fadeUp} 0.55s ease both;
`;

const CardTag = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-left: 2px;
`;

const CardTagLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, rgba(250, 129, 40, 0.4), transparent);
`;

const CardTagText = styled.span`
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(250, 129, 40, 0.55);
  white-space: nowrap;
`;

const Card = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.032);
  border: 1px solid rgba(240, 236, 230, 0.07);
  border-top: 1px solid rgba(250, 129, 40, 0.2);
  border-radius: 16px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 32px 80px rgba(0, 0, 0, 0.45),
    0 0 120px rgba(250, 129, 40, 0.04);
`;

// ─── Header ───────────────────────────────────────────────────────────────────
const CardHeader = styled.div`
  padding: 24px 16px 20px;
  border-bottom: 1px solid ${T.border};
  border-radius: 16px 16px 0 0;

  @media (min-width: 400px) {
    padding: 28px 24px 22px;
  }

  @media (min-width: 560px) {
    padding: 32px 36px 24px;
  }
`;

const Eyebrow = styled.span`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${T.orange};
  opacity: 0.7;
  display: block;
  margin-bottom: 8px;
`;

const FormTitle = styled.h1`
  font-family: "Georgia", serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: ${T.text};
  margin: 0 0 20px;
  letter-spacing: -0.02em;
  line-height: 1.15;
`;

// ─── Step Progress ────────────────────────────────────────────────────────────
const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (min-width: 400px) {
    gap: 8px;
  }
`;

const StepItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: ${({ active, done }) => (done ? "pointer" : "default")};
  padding: 0;
  flex: 1;
  min-width: 0;
  opacity: ${({ active, done }) => (active || done ? 1 : 0.35)};
  transition: opacity 0.3s;
`;

const StepDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Courier New", monospace;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s;
  background: ${({ active, done }) =>
    done ? T.orange : active ? "transparent" : "rgba(255,255,255,0.04)"};
  border: 1.5px solid
    ${({ active, done }) =>
      active || done ? T.orange : "rgba(240,236,230,0.12)"};
  color: ${({ active, done }) =>
    done ? "#fff" : active ? T.orange : T.textMuted};

  @media (min-width: 400px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
`;

const StepLabel = styled.span`
  font-family: "Courier New", monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ active }) => (active ? T.orange : T.textMuted)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  /* Hide labels on very small screens — dots + connector are enough */
  @media (max-width: 360px) {
    display: none;
  }

  @media (min-width: 400px) {
    font-size: 9px;
    letter-spacing: 0.12em;
  }
`;

const StepConnector = styled.div`
  flex: 1 1 8px;
  min-width: 6px;
  max-width: 28px;
  height: 1px;
  background: ${({ done }) => (done ? T.orange : "rgba(240,236,230,0.08)")};
  transition: background 0.4s;
  margin-bottom: 13px;

  @media (max-width: 360px) {
    margin-bottom: 0;
  }
`;

const ProgressBar = styled.div`
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
  margin-top: 18px;
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${({ pct }) => pct}%;
    background: ${T.orange};
    border-radius: 2px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// ─── Body / Steps ─────────────────────────────────────────────────────────────
const CardBody = styled.div`
  padding: 28px 36px 8px;

  @media (max-width: 480px) {
    padding: 20px 18px 8px;
  }
`;

const StepSlide = styled.div`
  animation: ${({ direction }) =>
    direction === "forward"
      ? css`
          ${slideIn} 0.38s cubic-bezier(0.4, 0, 0.2, 1) both
        `
      : css`
          ${slideInLeft} 0.38s cubic-bezier(0.4, 0, 0.2, 1) both
        `};
`;

// ─── Section heading inside a step ────────────────────────────────────────────
const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
`;

const SectionIcon = styled.span`
  font-size: 15px;
  opacity: 0.8;
`;

const SectionTitle = styled.h3`
  font-family: "Georgia", serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0;
  letter-spacing: -0.01em;
`;

// ─── Field primitives ─────────────────────────────────────────────────────────
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
  margin-bottom: 7px;
`;

const baseInput = css`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${T.border};
  border-radius: ${T.radiusSm};
  color: ${T.text};
  font-size: 0.92rem;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: ${T.textMuted};
  }

  &:focus {
    border-color: ${T.borderFocus};
    background: ${T.orangeGlow};
    box-shadow: 0 0 0 3px rgba(250, 129, 40, 0.06);
  }

  ${({ hasError }) =>
    hasError &&
    css`
      border-color: ${T.error};
      background: ${T.errorBg};
    `}
`;

const Input = styled.input`
  ${baseInput}
  height: 44px;
  padding: 0 14px;
`;

const Textarea = styled.textarea`
  ${baseInput}
  padding: 12px 14px;
  min-height: 100px;
  resize: vertical;
`;

const FieldError = styled.p`
  font-size: 0.78rem;
  color: ${T.error};
  margin: 5px 0 0;
  font-family: "Courier New", monospace;
`;

const FieldHint = styled.p`
  font-size: 0.78rem;
  color: ${T.textMuted};
  margin: 5px 0 0;
  line-height: 1.5;
`;

// ─── Two-col row ──────────────────────────────────────────────────────────────
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${T.border};
  margin: 24px 0;
`;

// ─── Category chips ───────────────────────────────────────────────────────────
const CategoryWrap = styled.div`
  position: relative;
`;

/* Fade-out edges hint that the rail is scrollable */
const CategoryRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 132px;
  overflow-y: auto;
  padding: 2px 2px 8px;

  /* hide scrollbar visually but keep it functional */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* When many categories exist, fade the bottom edge */
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
`;

const CategoryCount = styled.span`
  display: block;
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: ${T.textMuted};
  margin-top: 10px;
`;

/* Keep old name as alias so JSX doesn't need to change */
const ChipGrid = CategoryRail;

const Chip = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-family: "Courier New", monospace;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1px solid ${({ active }) => (active ? T.orange : T.border)};
  background: ${({ active }) => (active ? T.orangeDim : "transparent")};
  color: ${({ active }) => (active ? T.orange : T.textSub)};

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
  }

  /* Pulse the active state so selections are unmissable */
  ${({ active }) =>
    active &&
    `
    box-shadow: 0 0 0 3px rgba(250,129,40,0.12);
  `}
`;

// ─── Social media row ─────────────────────────────────────────────────────────
const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const SocialHandle = styled.span`
  font-family: "Courier New", monospace;
  font-size: 11px;
  color: ${T.orange};
  opacity: 0.7;
  width: 80px;
  flex-shrink: 0;
  letter-spacing: 0.05em;
`;

const SocialInput = styled(Input)`
  flex: 1;
  height: 38px;
  font-size: 0.85rem;
`;

// ─── Package cards ────────────────────────────────────────────────────────────
const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const PackageCard = styled.button`
  padding: 18px 16px;
  border-radius: ${T.radius};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  border: 1.5px solid ${({ active }) => (active ? T.orange : T.border)};
  background: ${({ active }) =>
    active
      ? "linear-gradient(135deg, rgba(250,129,40,0.14) 0%, rgba(180,70,0,0.08) 100%)"
      : T.surface};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ active }) =>
      active ? T.orange : "rgba(250,129,40,0.35)"};
    background: ${({ active }) => (active ? undefined : T.surfaceHover)};
  }
`;

const PackageName = styled.div`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ active }) => (active ? T.orange : T.textMuted)};
  margin-bottom: 6px;
`;

const PackagePrice = styled.div`
  font-family: "Georgia", serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${T.text};
`;

const PackagePricePer = styled.span`
  font-size: 0.7rem;
  font-weight: 400;
  color: ${T.textMuted};
  margin-left: 2px;
`;

const PackageCheck = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${T.orange};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: opacity 0.2s;
`;

// ─── Agreement ────────────────────────────────────────────────────────────────
const AgreementBox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 16px;
  border-radius: ${T.radiusSm};
  border: 1px solid ${({ checked }) => (checked ? T.borderFocus : T.border)};
  background: ${({ checked }) => (checked ? T.orangeGlow : "transparent")};
  transition: all 0.2s;
  margin-bottom: 24px;

  &:hover {
    border-color: ${T.borderFocus};
  }
`;

const Checkbox = styled.input`
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  accent-color: ${T.orange};
  margin-top: 1px;
  cursor: pointer;
`;

const AgreementText = styled.span`
  font-size: 0.85rem;
  color: ${T.textSub};
  line-height: 1.55;

  a {
    color: ${T.orange};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// ─── Asset upload areas ───────────────────────────────────────────────────────
const AssetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AssetSlot = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetLabel = styled.p`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.textMuted};
  margin: 0 0 8px;
`;

// ─── Footer actions ───────────────────────────────────────────────────────────
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${T.border};
  border-radius: 0 0 16px 16px;
  padding: 14px 16px 24px;
  gap: 10px;
  flex-wrap: nowrap;

  @media (min-width: 480px) {
    padding: 20px 36px 28px;
    gap: 12px;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 40px;
  font-family: "Courier New", monospace;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  padding: 10px 18px;
  font-size: 0.82rem;

  @media (min-width: 480px) {
    padding: 10px 22px;
    font-size: 0.85rem;
  }
`;

const PrevButton = styled(NavButton)`
  background: transparent;
  border: 1px solid ${T.border};
  color: ${T.textSub};
  flex-shrink: 0;

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
  }
`;

const NextButton = styled(NavButton)`
  background: ${T.orange};
  border: 1px solid ${T.orange};
  color: #fff;
  margin-left: auto;
  flex-shrink: 0;

  /* On mobile, grow to fill available space for easy tapping */
  @media (max-width: 479px) {
    flex: 1;
  }

  &:hover {
    background: #e67020;
  }
  &:disabled {
    background: rgba(250, 129, 40, 0.25);
    border-color: transparent;
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.4);
  }
`;

const StepCounter = styled.span`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: ${T.textMuted};
  flex-shrink: 0;
  white-space: nowrap;
`;

// ─── InfoNote ─────────────────────────────────────────────────────────────────
const InfoNote = styled.div`
  padding: 12px 16px;
  border-left: 3px solid rgba(250, 129, 40, 0.4);
  background: ${T.orangeGlow};
  border-radius: 0 8px 8px 0;
  font-size: 0.83rem;
  color: ${T.textSub};
  line-height: 1.55;
  margin-bottom: 20px;
`;

// ─── QuantityControl ──────────────────────────────────────────────────────────
const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const QtyButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${T.border};
  background: transparent;
  color: ${T.text};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
  }
`;

const QtyValue = styled.span`
  font-family: "Georgia", serif;
  font-size: 1.1rem;
  color: ${T.text};
  min-width: 24px;
  text-align: center;
`;

// ─── Steps meta ───────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Details", icon: "✦" },
  { label: "Organizer", icon: "◈" },
  { label: "Media", icon: "◉" },
  { label: "Package", icon: "◇" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const DiscountForm = (props) => {
  // ── State (same as original) ──────────────────────────────────────────────
  const [discountTitle, setDiscountName] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const [organizerName, setOrganizerName] = useState(
    props.organizer?.name ?? "",
  );
  const [organizerDescription, setOrganizerDescription] = useState(
    props.organizer?.description ?? "",
  );
  const [email, setEmail] = useState(props.organizer?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    props.organizer?.phone_number ?? "",
  );
  const [discountCategories, setDiscountCategories] = useState([]);
  const [percentageDiscount, setPercentageDiscount] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [discountFlyer, setDiscountFlyer] = useState();
  const [readDiscountFlyer, setReadDiscountFlyer] = useState("");
  const [discountImages, setDiscountImages] = useState([]);
  const [readDiscountImages, setReadDiscountImages] = useState([]);
  const [socialMediaHandles, setSocialMediaHandles] = useState(
    props.organizer?.social_media_handles ?? {
      whatsapp: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
  );
  const [videoURL, setVideoURL] = useState("");
  const [websiteURL, setWebsiteUrl] = useState("");
  const [agreement, setAgreement] = useState("");
  const [allCategories, setAllCategories] = useState();
  const [discountPackages, setDiscountPackages] = useState();
  const [packageOption, setPackageOption] = useState();

  // UI state
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  // Errors
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [imageError, setImageError] = useState({ flyer: "", images: "" });
  const [videoURLError, setVideoURLError] = useState("");
  const [websiteURLError, setWebsiteURLError] = useState("");
  const [socialMediaHandlesURLError, setSocialMediaHandlesURLError] = useState({
    whatsappError: "",
    facebookError: "",
    instagramError: "",
    twitterError: "",
  });
  const [isFlyerEmpty, setIsFlyerEmpty] = useState(false);
  const [filename, setFilename] = useState("");

  const { pathname } = useLocation();
  const {
    setUrl,
    categories,
    discount,
    discount_media,
    discount_packages,
    getCategories,
    getDiscountPackages,
    getDiscountMedia,
  } = props;

  // ── Effects ───────────────────────────────────────────────────────────────
  // Mount-only: record URL for post-login redirect. Refs let us read
  // the latest values without adding them as reactive dependencies.
  const pathnameRef = React.useRef(pathname);
  const setUrlRef = React.useRef(setUrl);
  useEffect(() => {
    setUrlRef.current?.(pathnameRef.current);
  }, []);

  useEffect(() => {
    if (categories) setAllCategories(categories);
    else getCategories?.();

    if (discount_packages) {
      setDiscountPackages(discount_packages.results);
      setPackageOption({ ...discount_packages.results[0], quantity: 1 });
    } else {
      getDiscountPackages?.();
    }

    if (discount && !discountFlyer) {
      setDiscountName(discount.name);
      setDiscountDescription(discount.description);
      setOrganizerName(discount.organizer.name);
      setOrganizerDescription(discount.organizer.description);
      setEmail(discount.organizer.email);
      setPhoneNumber(discount.organizer.phone_number);
      setDiscountCategories(discount.categories);
      setPercentageDiscount(discount.percentage_discount);
      setLocation(discount.location);
      setAddress(discount.address);
      setStartDate(discount.start_date);
      setEndDate(discount.end_date);
      setSocialMediaHandles(discount.organizer.social_media_handles);
      setWebsiteUrl(discount.website_url);
      setPackageOption(discount_packages.results[0]);
      setDiscountFlyer(discount.flyer);
      setAgreement(discount.agreement);
    }

    if (
      (!discount_media && discount) ||
      (discount && discount_media?.[0]?.discount !== discount.url)
    ) {
      getDiscountMedia?.(discount.id);
    }

    if (discount_media && !discountImages.length) {
      setDiscountImages(discount_media);
      setReadDiscountImages(discount_media);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    categories,
    discount,
    discount_media,
    discount_packages,
    discountFlyer,
    discountImages.length,
    getCategories,
    getDiscountMedia,
    getDiscountPackages,
  ]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const goTo = (next) => {
    setDirection(next > step ? "forward" : "back");
    setStep(next);
  };

  const toggleCategory = (cat) => {
    const exists = discountCategories?.some((c) => c.name === cat.name);
    setDiscountCategories(
      exists
        ? discountCategories.filter((c) => c.name !== cat.name)
        : [...(discountCategories || []), cat],
    );
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    const res = isEmailValid(val);
    setEmailError(res[1] ? res[1] : "");
  };

  const handleContactChange = (val) => {
    setPhoneNumber(val);
    const res = isContactValid(val);
    setContactError(res[1] ? res[1] : "");
  };

  const handleSocialChange = (platform, value) => {
    setSocialMediaHandles((prev) => ({ ...prev, [platform]: value }));
    if (value && !isValidURL(value)) {
      setSocialMediaHandlesURLError((prev) => ({
        ...prev,
        [`${platform}Error`]: "Invalid URL",
      }));
    } else {
      setSocialMediaHandlesURLError((prev) => ({
        ...prev,
        [`${platform}Error`]: "",
      }));
    }
  };

  const onDrop = (acceptedFiles) => {
    if (discountImages.length >= 3) {
      setImageError((e) => ({ ...e, images: "Maximum 3 images" }));
      return;
    }
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const imgId = createId();
      setDiscountImages((prev) => [...prev, { id: `image-${imgId}`, file }]);
      reader.onload = (e) =>
        setReadDiscountImages((prev) => [
          ...prev,
          { id: `image-${imgId}`, image: e.target.result },
        ]);
      reader.readAsDataURL(file);
    });
  };

  const flyerImageHandler = (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setDiscountFlyer(file);
    setIsFlyerEmpty(false);
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setReadDiscountFlyer(e.target.result);
    reader.readAsDataURL(file);
  };

  const popImage = (id) => {
    setDiscountImages((prev) => prev.filter((img) => img.id !== id));
    setReadDiscountImages((prev) => prev.filter((img) => img.id !== id));
  };

  const generateEmbed = async () => {
    try {
      const embed = await generateEmbedFromName(location);
      setAddress(embed);
      return embed;
    } catch (err) {
      console.error("Could not generate embed:", err);
    }
  };

  const handlePostDiscount = async () => {
    let embed_location = address;
    if (!address?.trim()) {
      try {
        embed_location = await generateEmbed();
      } catch (_) {}
    }

    const filteredSocial = Object.fromEntries(
      Object.entries(socialMediaHandles).filter(([, v]) => v?.trim()),
    );

    const payload = {
      discount_data: {
        title: discountTitle,
        description: discountDescription,
        package_type: packageOption?.type,
        percentage_discount: percentageDiscount,
        start_date: startDate,
        end_date: endDate,
        categories: discountCategories,
        video_url: videoURL,
        website_url: websiteURL,
        agreement,
        location,
        address: embed_location,
      },
      organizer_data: {
        name: organizerName,
        description: organizerDescription,
        email,
        phone_number: phoneNumber,
        social_media_handles: filteredSocial,
      },
      package_data: {
        type: packageOption?.type,
        quantity: packageOption?.quantity,
      },
    };

    const files = { flyer: discountFlyer, images: discountImages };
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    formData.append("flyer", files.flyer);
    formData.append("images_length", files.images.length);

    if (discount) {
      files.images.forEach((img, i) => {
        formData.append(
          `image-${i}`,
          img.file ? img.file : JSON.stringify(img),
        );
      });
      props.updateDiscount?.({ formData, discount_id: discount.id });
    } else {
      files.images.forEach((img, i) => formData.append(`image-${i}`, img.file));
      props.postDiscount?.(formData);
    }
  };

  // ── Step validation (simple) ───────────────────────────────────────────────
  const canProceed = [
    discountTitle && discountDescription && percentageDiscount,
    organizerName && email && !emailError,
    true, // media optional
    agreement === "agreed" && packageOption,
  ];

  // ── Render helpers ────────────────────────────────────────────────────────
  const pct = ((step + 1) / STEPS.length) * 100;

  // ─────────────────────────────────────────────────────────────────────────
  // STEP CONTENT
  // ─────────────────────────────────────────────────────────────────────────
  // Called as renderStepContent(), NOT as <StepContent /> — avoids React
  // treating it as a new component type each render (which would unmount/
  // remount all inputs, losing focus and resetting scroll on every keystroke).
  const renderStepContent = () => {
    switch (step) {
      // ── Step 0: Discount Details ────────────────────────────────────────
      case 0:
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>✦</SectionIcon>
              <SectionTitle>Discount Details</SectionTitle>
            </SectionHeading>

            <FieldGroup>
              <FieldLabel>Discount Title *</FieldLabel>
              <Input
                id="discountTitle"
                type="text"
                value={discountTitle}
                placeholder="e.g. Summer Flash Sale — 30% Off"
                onChange={(e) => setDiscountName(e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Description *</FieldLabel>
              <Textarea
                id="discountDescription"
                rows={4}
                value={discountDescription}
                placeholder="Describe the discount offer and any conditions…"
                onChange={(e) => setDiscountDescription(e.target.value)}
              />
            </FieldGroup>

            <TwoCol>
              <FieldGroup>
                <FieldLabel>Percentage / Value *</FieldLabel>
                <Input
                  id="percentageDiscount"
                  type="text"
                  value={percentageDiscount}
                  placeholder="e.g. 30% or GHS 50"
                  onChange={(e) => setPercentageDiscount(e.target.value)}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Location Name</FieldLabel>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  placeholder="e.g. Accra Mall, Ring Road"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </FieldGroup>
            </TwoCol>

            <TwoCol>
              <FieldGroup>
                <FieldLabel>Start Date</FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>End Date</FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FieldGroup>
            </TwoCol>

            <Divider />

            <SectionHeading>
              <SectionIcon>◈</SectionIcon>
              <SectionTitle>Categories</SectionTitle>
            </SectionHeading>

            {allCategories ? (
              <CategoryWrap>
                <ChipGrid id="categories">
                  {allCategories.map((cat) => (
                    <Chip
                      key={cat.id}
                      active={discountCategories?.some(
                        (c) => c.name === cat.name,
                      )}
                      onClick={() => toggleCategory(cat)}
                      type="button"
                    >
                      {cat.name}
                    </Chip>
                  ))}
                </ChipGrid>
                <CategoryCount>
                  {discountCategories?.length
                    ? `${discountCategories.length} selected · scroll to see all`
                    : `${allCategories.length} categories · scroll to see all`}
                </CategoryCount>
              </CategoryWrap>
            ) : (
              <FieldHint>Loading categories…</FieldHint>
            )}
          </StepSlide>
        );

      // ── Step 1: Organizer Info ──────────────────────────────────────────
      case 1:
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>◈</SectionIcon>
              <SectionTitle>Organizer Information</SectionTitle>
            </SectionHeading>

            <TwoCol>
              <FieldGroup>
                <FieldLabel>Business / Name *</FieldLabel>
                <Input
                  id="organizerName"
                  type="text"
                  value={organizerName}
                  placeholder="Your business name"
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Email *</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  hasError={!!emailError}
                  placeholder="you@example.com"
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                {emailError && <FieldError>{emailError}</FieldError>}
              </FieldGroup>
            </TwoCol>

            <TwoCol>
              <FieldGroup>
                <FieldLabel>Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  hasError={!!contactError}
                  placeholder="+233 20 000 0000"
                  onChange={(e) => handleContactChange(e.target.value)}
                />
                {contactError && <FieldError>{contactError}</FieldError>}
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Website</FieldLabel>
                <Input
                  type="url"
                  value={websiteURL}
                  hasError={!!websiteURLError}
                  placeholder="https://yoursite.com"
                  onChange={(e) => {
                    setWebsiteUrl(e.target.value);
                    setWebsiteURLError(
                      isValidURL(e.target.value) || !e.target.value
                        ? ""
                        : "Invalid URL",
                    );
                  }}
                />
                {websiteURLError && <FieldError>{websiteURLError}</FieldError>}
              </FieldGroup>
            </TwoCol>

            <FieldGroup>
              <FieldLabel>About Your Business</FieldLabel>
              <Textarea
                id="organizerDescription"
                rows={3}
                value={organizerDescription}
                placeholder="Briefly describe your business…"
                onChange={(e) => setOrganizerDescription(e.target.value)}
              />
            </FieldGroup>

            <Divider />

            <SectionHeading>
              <SectionIcon>◉</SectionIcon>
              <SectionTitle>
                Social Handles{" "}
                <span style={{ opacity: 0.45, fontSize: "0.78rem" }}>
                  (optional)
                </span>
              </SectionTitle>
            </SectionHeading>

            {["whatsapp", "facebook", "instagram", "twitter"].map(
              (platform) => (
                <SocialRow key={platform}>
                  <SocialHandle>{platform}</SocialHandle>
                  <SocialInput
                    type="url"
                    value={socialMediaHandles[platform] ?? ""}
                    hasError={!!socialMediaHandlesURLError[`${platform}Error`]}
                    placeholder={`https://${platform}.com/…`}
                    onChange={(e) =>
                      handleSocialChange(platform, e.target.value)
                    }
                  />
                  {socialMediaHandlesURLError[`${platform}Error`] && (
                    <FieldError
                      style={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
                    >
                      {socialMediaHandlesURLError[`${platform}Error`]}
                    </FieldError>
                  )}
                </SocialRow>
              ),
            )}
          </StepSlide>
        );

      // ── Step 2: Media ───────────────────────────────────────────────────
      case 2:
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>◉</SectionIcon>
              <SectionTitle>Media Assets</SectionTitle>
            </SectionHeading>

            <InfoNote>
              A high-quality flyer significantly improves click-through rate.
              Use a 1:1 or 4:5 ratio image for best results.
            </InfoNote>

            <AssetGrid>
              <AssetSlot>
                <AssetLabel>Discount Flyer *</AssetLabel>
                <Dropzone
                  onDrop={flyerImageHandler}
                  accept={"image/*"}
                  minSizeBytes={1}
                  maxSizeBytes={1000000}
                  maxFiles={1}
                  preview={true}
                  filename={filename}
                  bgImage={readDiscountFlyer}
                  isEmpty={isFlyerEmpty}
                  error={imageError.flyer}
                />
              </AssetSlot>
              <AssetSlot>
                <AssetLabel>Gallery Images (up to 3)</AssetLabel>
                <Dropzone
                  onDrop={onDrop}
                  accept={"image/*"}
                  minSizeBytes={1}
                  maxSizeBytes={1000000}
                  maxFiles={3}
                  error={imageError.images}
                />
              </AssetSlot>
            </AssetGrid>

            {readDiscountImages?.length > 0 && (
              <ImageGrid images={readDiscountImages} popImage={popImage} />
            )}

            <Divider />

            <SectionHeading>
              <SectionIcon>▷</SectionIcon>
              <SectionTitle>
                Video{" "}
                <span style={{ opacity: 0.45, fontSize: "0.78rem" }}>
                  (optional)
                </span>
              </SectionTitle>
            </SectionHeading>

            <FieldGroup>
              <FieldLabel>Video URL</FieldLabel>
              <Input
                type="url"
                value={videoURL}
                hasError={!!videoURLError}
                placeholder="https://youtube.com/watch?v=…"
                onChange={(e) => {
                  setVideoURL(e.target.value);
                  setVideoURLError(
                    isValidURL(e.target.value) || !e.target.value
                      ? ""
                      : "Invalid URL",
                  );
                }}
              />
              {videoURLError && <FieldError>{videoURLError}</FieldError>}
            </FieldGroup>
          </StepSlide>
        );

      // ── Step 3: Package + Submit ────────────────────────────────────────
      case 3:
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>◇</SectionIcon>
              <SectionTitle>Ad Package</SectionTitle>
            </SectionHeading>

            {discountPackages && (
              <PackageGrid>
                {discountPackages.map((pkg) => {
                  const active = packageOption?.type === pkg.type;
                  return (
                    <PackageCard
                      key={pkg.id}
                      active={active}
                      type="button"
                      onClick={() =>
                        setPackageOption({
                          ...pkg,
                          quantity: packageOption?.quantity || 1,
                        })
                      }
                    >
                      <PackageCheck active={active}>✓</PackageCheck>
                      <PackageName active={active}>{pkg.type}</PackageName>
                      <PackagePrice>
                        GHS {parseFloat(pkg.price).toFixed(2)}
                        <PackagePricePer>/ {pkg.type}</PackagePricePer>
                      </PackagePrice>
                    </PackageCard>
                  );
                })}
              </PackageGrid>
            )}

            {packageOption && (
              <FieldGroup>
                <FieldLabel>Quantity</FieldLabel>
                <QuantityRow>
                  <QtyButton
                    type="button"
                    onClick={() =>
                      setPackageOption((p) => ({
                        ...p,
                        quantity: Math.max(1, p.quantity - 1),
                      }))
                    }
                  >
                    −
                  </QtyButton>
                  <QtyValue>{packageOption.quantity}</QtyValue>
                  <QtyButton
                    type="button"
                    onClick={() =>
                      setPackageOption((p) => ({
                        ...p,
                        quantity: p.quantity + 1,
                      }))
                    }
                  >
                    +
                  </QtyButton>
                  <span
                    style={{
                      color: T.textMuted,
                      fontSize: "0.85rem",
                      marginLeft: 8,
                    }}
                  >
                    Total: GHS{" "}
                    {(
                      parseFloat(packageOption.price) * packageOption.quantity
                    ).toFixed(2)}
                  </span>
                </QuantityRow>
              </FieldGroup>
            )}

            <Divider />

            <SectionHeading>
              <SectionIcon>✦</SectionIcon>
              <SectionTitle>Agreement</SectionTitle>
            </SectionHeading>

            <AgreementBox
              checked={agreement === "agreed"}
              onClick={() =>
                setAgreement(agreement === "agreed" ? "" : "agreed")
              }
            >
              <Checkbox
                id="agreement"
                type="checkbox"
                readOnly
                checked={agreement === "agreed"}
                value={agreement}
              />
              <AgreementText>
                I have read and agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms and Conditions
                </a>{" "}
                and confirm that all information provided is accurate.
              </AgreementText>
            </AgreementBox>

            {/* Payment component sits below when triggered */}
            {props.payment && (
              <Payment
                payment={props.payment}
                package_type={packageOption?.type}
              />
            )}
          </StepSlide>
        );

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageWrap id="top">
      <CardOuter>
        <CardTag>
          <CardTagText>New Ad</CardTagText>
          <CardTagLine />
        </CardTag>
        <Card>
          {/* ── Header ── */}
          <CardHeader>
            <Eyebrow>Quick Discount</Eyebrow>
            <FormTitle>
              {discount ? "Update Discount Ad" : "Create Discount Ad"}
            </FormTitle>

            {/* Step indicators */}
            <StepRow>
              {STEPS.map((s, i) => (
                <React.Fragment key={s.label}>
                  <StepItem
                    type="button"
                    active={i === step}
                    done={i < step}
                    onClick={() => i < step && goTo(i)}
                  >
                    <StepDot active={i === step} done={i < step}>
                      {i < step ? "✓" : i + 1}
                    </StepDot>
                    <StepLabel active={i === step}>{s.label}</StepLabel>
                  </StepItem>
                  {i < STEPS.length - 1 && <StepConnector done={i < step} />}
                </React.Fragment>
              ))}
            </StepRow>

            <ProgressBar pct={pct} />
          </CardHeader>

          {/* ── Body ── */}
          <CardBody>{renderStepContent()}</CardBody>

          {/* ── Footer ── */}
          <CardFooter>
            <StepCounter>
              {step + 1} / {STEPS.length}
            </StepCounter>

            {step > 0 && (
              <PrevButton type="button" onClick={() => goTo(step - 1)}>
                ← Back
              </PrevButton>
            )}

            {step < STEPS.length - 1 ? (
              <NextButton
                type="button"
                disabled={!canProceed[step]}
                onClick={() => goTo(step + 1)}
              >
                Continue →
              </NextButton>
            ) : (
              <NextButton
                type="button"
                disabled={!canProceed[step]}
                onClick={handlePostDiscount}
              >
                {discount ? "Update Ad" : "Submit Ad"} →
              </NextButton>
            )}
          </CardFooter>
        </Card>
      </CardOuter>
    </PageWrap>
  );
};

// ─── Redux connections (unchanged from original) ──────────────────────────────
const mapStateToProps = (state) => ({
  categories: state.discountState.categories,
  discount_packages: state.discountState.discount_packages,
  discount_media: state.organizerState.discount_media,
  payment: state.discountState.payment,
  organizer: state.organizerState.organizer,
  createDiscountStatus: state.organizerState.createDiscountStatus,
});

const mapDispatchToProps = (dispatch) => ({
  getCategories: () => dispatch(getCategoriesAPI()),
  getDiscountPackages: () => dispatch(getDiscountPackagesAPI()),
  postDiscount: (payload) => dispatch(createDiscountAPI(payload)),
  updateDiscount: (payload) => dispatch(updateDiscountAPI(payload)),
  getDiscountMedia: (id) => dispatch(getDiscountMediaAPI(id)),
  setUrl: (url) => dispatch(setPreviousUrl(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountForm);
