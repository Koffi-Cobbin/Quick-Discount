import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  getDiscountPackagesAPI,
  getDiscountMediaAPI,
  setPreviousUrl,
} from "../../actions";
import Payment from "../Payment/Payment";

// ─── Theme tokens (light / white background) ──────────────────────────────────
const T = {
  bg: "#f5f4f2",
  surface: "#ffffff",
  surfaceHover: "rgba(0,0,0,0.025)",
  border: "rgba(0,0,0,0.1)",
  borderFocus: "rgba(250,129,40,0.55)",
  orange: "#fa8128",
  orangeDim: "rgba(250,129,40,0.1)",
  orangeGlow: "rgba(250,129,40,0.06)",
  text: "#1a1a16",
  textMuted: "rgba(20,20,15,0.45)",
  textSub: "rgba(20,20,15,0.9)",
  error: "#d93025",
  errorBg: "rgba(217,48,37,0.06)",
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
      rgba(250, 129, 40, 0.07) 0%,
      transparent 68%
    ),
    radial-gradient(
      ellipse 40% 30% at 80% 80%,
      rgba(250, 129, 40, 0.04) 0%,
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

  /* Subtle grain texture */
  &::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.018;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px 256px;
  }

  /* Left edge accent line */
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
      rgba(250, 129, 40, 0.4) 25%,
      rgba(250, 129, 40, 0.2) 65%,
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
  background: linear-gradient(to right, rgba(250, 129, 40, 0.35), transparent);
`;

const CardTagText = styled.span`
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(250, 129, 40, 0.75);
  white-space: nowrap;
  font-weight: 600;
`;

// ─── Card shell ───────────────────────────────────────────────────────────────
const Card = styled.div`
  width: 100%;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-top: 1px solid rgba(250, 129, 40, 0.25);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
`;

// ─── Header ───────────────────────────────────────────────────────────────────
const CardHeader = styled.div`
  padding: 24px 16px 20px;
  border-bottom: 1px solid ${T.border};
  border-radius: 16px 16px 0 0;
  background: #faf9f7;

  @media (min-width: 400px) {
    padding: 28px 24px 22px;
  }

  @media (min-width: 560px) {
    padding: 32px 36px 24px;
  }
`;

const Eyebrow = styled.span`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${T.orange};
  opacity: 0.9;
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
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
  font-size: 11.5px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s;
  background: ${({ active, done }) =>
    done ? T.orange : active ? "transparent" : "rgba(0,0,0,0.04)"};
  border: 1.5px solid
    ${({ active, done }) =>
      active || done ? T.orange : "rgba(0,0,0,0.5)"};
  color: ${({ active, done }) =>
    done ? "#fff" : active ? T.orange : T.textSub};

  @media (min-width: 400px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
`;

const StepLabel = styled.span`
  font-family: "Courier New", monospace;
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ active }) => (active ? T.orange : "rgba(20,20,15,0.9)")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-weight: ${({ active }) => (active ? "700" : "600")};

  @media (max-width: 360px) {
    display: none;
  }

  @media (min-width: 400px) {
    font-size: 10px;
    letter-spacing: 0.12em;
  }
`;

const StepConnector = styled.div`
  flex: 1 1 8px;
  min-width: 6px;
  max-width: 28px;
  height: 1px;
  background: ${({ done }) => (done ? T.orange : "rgba(0,0,0,0.15)")};
  transition: background 0.4s;
  margin-bottom: 13px;

  @media (max-width: 360px) {
    margin-bottom: 0;
  }
`;

const ProgressBar = styled.div`
  height: 2px;
  background: rgba(0, 0, 0, 0.08);
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
      ? css`${slideIn} 0.38s cubic-bezier(0.4, 0, 0.2, 1) both`
      : css`${slideInLeft} 0.38s cubic-bezier(0.4, 0, 0.2, 1) both`};
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
  opacity: 0.75;
  color: ${T.orange};
`;

const SectionTitle = styled.h3`
  font-family: "Georgia", serif;
  font-size: 1.05rem;
  font-weight: 700;
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
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.text};
  opacity: 0.85;
  margin-bottom: 7px;
  font-weight: 600;
`;

const baseInput = css`
  width: 100%;
  background: #faf9f7;
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
    color: rgba(20,20,15,0.35);
  }

  &:focus {
    border-color: ${T.borderFocus};
    background: ${T.surface};
    box-shadow: 0 0 0 3px rgba(250, 129, 40, 0.08);
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
  font-size: 0.8rem;
  color: ${T.error};
  margin: 5px 0 0;
  font-family: "Courier New", monospace;
  font-weight: 600;
`;

const FieldHint = styled.p`
  font-size: 0.82rem;
  color: "rgba(20,20,15,0.55)";
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

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 132px;
  overflow-y: auto;
  padding: 2px 2px 8px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
`;

const CategoryCount = styled.span`
  display: block;
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${T.textSub};
  margin-top: 10px;
`;

// Shown when no category has been selected yet
const CategoryRequiredHint = styled.span`
  display: block;
  font-family: "Courier New", monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${T.error};
  margin-top: 6px;
  opacity: 0.85;
`;

const Chip = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-family: "Courier New", monospace;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1px solid ${({ active }) => (active ? T.orange : "rgba(0,0,0,0.18)")};
  background: ${({ active }) => (active ? T.orangeDim : "transparent")};
  color: ${({ active }) => (active ? T.orange : "rgba(20,20,15,0.7)")};
  font-weight: ${({ active }) => (active ? "600" : "400")};

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }

  ${({ active }) => active && "box-shadow: 0 0 0 3px rgba(250,129,40,0.1);"}
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
  font-size: 12px;
  color: ${T.orange};
  opacity: 0.9;
  width: 80px;
  flex-shrink: 0;
  letter-spacing: 0.05em;
  font-weight: 600;
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
      ? "linear-gradient(135deg, rgba(250,129,40,0.1) 0%, rgba(180,70,0,0.05) 100%)"
      : "#faf9f7"};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ active }) => (active ? T.orange : "rgba(250,129,40,0.4)")};
    background: ${({ active }) => (active ? undefined : "rgba(250,129,40,0.04)")};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
`;

const PackageName = styled.div`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ active }) => (active ? T.orange : "rgba(20,20,15,0.6)")};
  margin-bottom: 6px;
  font-weight: 600;
`;

const PackagePrice = styled.div`
  font-family: "Georgia", serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${T.text};
`;

const PackagePricePer = styled.span`
  font-size: 0.72rem;
  font-weight: 500;
  color: ${T.textSub};
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
  background: ${({ checked }) => (checked ? T.orangeGlow : "#faf9f7")};
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
  font-size: 0.88rem;
  color: rgba(20,20,15,0.75);
  line-height: 1.55;

  a {
    color: ${T.orange};
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
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
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${T.text};
  opacity: 0.85;
  margin: 0 0 8px;
  font-weight: 600;
`;

// ─── Footer actions ───────────────────────────────────────────────────────────
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${T.border};
  border-radius: 0 0 16px 16px;
  background: #faf9f7;
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
  border: 1px solid rgba(0,0,0,0.15);
  color: rgba(20,20,15,0.7);
  flex-shrink: 0;

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }
`;

const NextButton = styled(NavButton)`
  background: ${T.orange};
  border: 1px solid ${T.orange};
  color: #fff;
  margin-left: auto;
  flex-shrink: 0;
  font-weight: 600;

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
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(20,20,15,0.55);
  flex-shrink: 0;
  white-space: nowrap;
  font-weight: 500;
`;

// ─── InfoNote ─────────────────────────────────────────────────────────────────
const InfoNote = styled.div`
  padding: 12px 16px;
  border-left: 3px solid rgba(250, 129, 40, 0.4);
  background: ${T.orangeGlow};
  border-radius: 0 8px 8px 0;
  font-size: 0.86rem;
  color: rgba(20,20,15,0.7);
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
  border: 1px solid rgba(0,0,0,0.15);
  background: transparent;
  color: ${T.text};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s;

  &:hover:not(:disabled) {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyValue = styled.span`
  font-family: "Georgia", serif;
  font-size: 1.1rem;
  font-weight: 700;
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
  { label: "Payment", icon: "◈" },
];

// days contributed by one unit of each package type
const DAYS_PER_TYPE = { daily: 1, weekly: 7, monthly: 30 };

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const DiscountForm = (props) => {
  // ── State ─────────────────────────────────────────────────────────────────
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

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

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
  const goTo = useCallback((next) => {
    setDirection(next > step ? "forward" : "back");
    setStep(next);
  }, [step]);

  // Returns an ISO date string (YYYY-MM-DD) for the end date given a package
  // type and quantity. daily=1 day each, weekly=7 days each, monthly=30 days each.
  const computeEndDate = useCallback((type, qty) => {
    const daysPerUnit = DAYS_PER_TYPE[type?.toLowerCase()] ?? 1;
    const end = new Date(startDate || new Date());
    end.setDate(end.getDate() + daysPerUnit * qty);
    return end.toISOString().slice(0, 10);
  }, [startDate]);

  // Recompute end date whenever start date or package selection changes
  useEffect(() => {
    setEndDate(computeEndDate(packageOption?.type, packageOption?.quantity ?? 1));
  }, [startDate, packageOption, computeEndDate]);

  const toggleCategory = useCallback((cat) => {
    setDiscountCategories((prev) => {
      const exists = prev.some((c) => c.name === cat.name);
      return exists ? prev.filter((c) => c.name !== cat.name) : [...prev, cat];
    });
  }, []);

  const handleEmailChange = useCallback((val) => {
    setEmail(val);
    const res = isEmailValid(val);
    setEmailError(res[1] ? res[1] : "");
  }, []);

  const handleContactChange = useCallback((val) => {
    setPhoneNumber(val);
    const res = isContactValid(val);
    setContactError(res[1] ? res[1] : "");
  }, []);

  const handleSocialChange = useCallback((platform, value) => {
    setSocialMediaHandles((prev) => ({ ...prev, [platform]: value }));
    setSocialMediaHandlesURLError((prev) => ({
      ...prev,
      [`${platform}Error`]: value && !isValidURL(value) ? "Invalid URL" : "",
    }));
  }, []);

  // ── Media handlers ────────────────────────────────────────────────────────
  const flyerImageHandler = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setDiscountFlyer(file);
    setIsFlyerEmpty(false);
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setReadDiscountFlyer(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
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
  }, [discountImages.length]);

  const popImage = useCallback((id) => {
    setDiscountImages((prev) => prev.filter((img) => img.id !== id));
    setReadDiscountImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const generateEmbed = useCallback(async () => {
    try {
      const embed = await generateEmbedFromName(location);
      setAddress(embed);
      return embed;
    } catch (err) {
      console.error("Could not generate embed:", err);
    }
  }, [location]);

  const handlePostDiscount = useCallback(async () => {
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

    // Guard: flyer is required for new discounts
    const flyerIsFile = discountFlyer instanceof File;
    if (!discount && !flyerIsFile) {
      setIsFlyerEmpty(true);
      goTo(2);
      return;
    }

    // Edit mode: if flyer hasn't been replaced it's still a URL string —
    // pass it in the payload so the backend can keep the existing file.
    if (discount && !flyerIsFile && typeof discountFlyer === "string") {
      payload.discount_data.flyer_url = discountFlyer;
    }

    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    if (flyerIsFile) formData.append("flyer", discountFlyer);
    formData.append("images_length", discountImages.length);

    if (discount) {
      discountImages.forEach((img, i) => {
        formData.append(`image-${i}`, img.file ? img.file : JSON.stringify(img));
      });
      props.updateDiscount?.({ formData, discount_id: discount.id });
    } else {
      discountImages.forEach((img, i) => formData.append(`image-${i}`, img.file));
      props.postDiscount?.(formData);
      console.log("FormData entries:");
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
    }
  }, [
    address, generateEmbed, socialMediaHandles, discountTitle, discountDescription,
    packageOption, percentageDiscount, startDate, endDate, discountCategories,
    videoURL, websiteURL, agreement, location, organizerName, organizerDescription,
    email, phoneNumber, discountFlyer, discountImages, discount,
    props.updateDiscount, props.postDiscount,
  ]);

  // ── Step validation ───────────────────────────────────────────────────────
  const canProceed = useMemo(() => [
    // Step 0: title, description, percentage value, at least one category,
    //         and a start date. End date is always valid (computed automatically).
    Boolean(
      discountTitle?.trim() &&
      discountDescription?.trim() &&
      percentageDiscount?.trim() &&
      discountCategories?.length > 0 &&
      startDate
    ),
    // Step 1: organizer name + valid email, no outstanding field errors
    Boolean(
      organizerName?.trim() &&
      email?.trim() &&
      !emailError &&
      !contactError &&
      !Object.values(socialMediaHandlesURLError).some(Boolean) &&
      !websiteURLError
    ),
    // Step 2: flyer required for new discounts; no invalid video URL
    Boolean(
      (discount ? true : Boolean(discountFlyer)) &&
      !videoURLError
    ),
    // Step 3: a package must be selected and T&Cs must be agreed
    Boolean(agreement === "agreed" && packageOption),
    // Step 4: payment — package just needs to be set (payment handled inline)
    Boolean(packageOption),
  ], [
    discountTitle, discountDescription, percentageDiscount, discountCategories,
    startDate,
    organizerName, email, emailError, contactError, socialMediaHandlesURLError, websiteURLError,
    discount, discountFlyer, videoURLError,
    agreement, packageOption,
  ]);

  const pct = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  // ─── Step content renderer ────────────────────────────────────────────────
  // Called as renderStepContent(), NOT as <StepContent /> — avoids React
  // treating it as a new component type each render which unmounts inputs.
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
                  placeholder="e.g. 30% OFF or GHS 50 OFF"
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
                <FieldLabel>Start Date *</FieldLabel>
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
                  readOnly
                  style={{ opacity: 0.6, cursor: "not-allowed", background: "rgba(0,0,0,0.03)" }}
                />
                <FieldHint style={{ color: "rgba(20,20,15,0.5)", marginTop: 5 }}>
                  Set automatically by package &amp; quantity
                </FieldHint>
              </FieldGroup>
            </TwoCol>

            <Divider />

            <SectionHeading>
              <SectionIcon>◈</SectionIcon>
              <SectionTitle>Categories *</SectionTitle>
            </SectionHeading>

            {allCategories ? (
              <CategoryWrap>
                <ChipGrid>
                  {allCategories.map((cat) => (
                    <Chip
                      key={cat.id}
                      active={discountCategories?.some((c) => c.name === cat.name)}
                      onClick={() => toggleCategory(cat)}
                      type="button"
                    >
                      {cat.name}
                    </Chip>
                  ))}
                </ChipGrid>
                {discountCategories?.length > 0 ? (
                  <CategoryCount>
                    {discountCategories.length} selected · scroll to see all
                  </CategoryCount>
                ) : (
                  <CategoryRequiredHint>
                    Select at least one category to continue
                  </CategoryRequiredHint>
                )}
              </CategoryWrap>
            ) : (
              <FieldHint>Loading categories…</FieldHint>
            )}
          </StepSlide>
        );

      // ── Step 1: Organizer Info ────────────────────────────────────────────
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
                <span style={{ opacity: 0.55, fontSize: "0.78rem" }}>
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

      // ── Step 2: Media ─────────────────────────────────────────────────────
      case 2:
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>◉</SectionIcon>
              <SectionTitle>Media</SectionTitle>
            </SectionHeading>

            <AssetGrid>
              <AssetSlot>
                <AssetLabel>Discount Flyer *</AssetLabel>
                <Dropzone
                  onDrop={flyerImageHandler}
                  accept="image/*"
                  minSizeBytes={1}
                  maxSizeBytes={1000000}
                  maxFiles={1}
                  filename={filename}
                  bgImage={readDiscountFlyer}
                  isEmpty={isFlyerEmpty}
                  error={imageError.flyer}
                />
                {!discountFlyer && !discount && (
                  <FieldError style={{ marginTop: 6 }}>Flyer is required to continue</FieldError>
                )}
              </AssetSlot>

              <AssetSlot>
                <AssetLabel>Gallery Images (up to 3)</AssetLabel>
                <Dropzone
                  onDrop={onDrop}
                  accept="image/*"
                  minSizeBytes={1}
                  maxSizeBytes={1000000}
                  maxFiles={3}
                  imageCount={readDiscountImages.length}
                  error={imageError.images}
                />
                {readDiscountImages.length > 0 && (
                  <ImageGrid images={readDiscountImages} popImage={popImage} />
                )}
              </AssetSlot>
            </AssetGrid>

            <Divider />

            <SectionHeading>
              <SectionIcon>▷</SectionIcon>
              <SectionTitle>
                Video{" "}
                <span style={{ opacity: 0.55, fontSize: "0.78rem" }}>
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
                    isValidURL(e.target.value) || !e.target.value ? "" : "Invalid URL",
                  );
                }}
              />
              {videoURLError && <FieldError>{videoURLError}</FieldError>}
            </FieldGroup>
          </StepSlide>
        );

      // ── Step 3: Package + Agreement ───────────────────────────────────────
      case 3:
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>◇</SectionIcon>
              <SectionTitle>Ad Package *</SectionTitle>
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
                      onClick={() => {
                        const qty = packageOption?.quantity || 1;
                        setPackageOption({ ...pkg, quantity: qty });
                        setEndDate(computeEndDate(pkg.type, qty));
                      }}
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
                    disabled={packageOption.quantity <= 1}
                    onClick={() => {
                      const newQty = Math.max(1, packageOption.quantity - 1);
                      setPackageOption((p) => ({ ...p, quantity: newQty }));
                      setEndDate(computeEndDate(packageOption.type, newQty));
                    }}
                  >
                    −
                  </QtyButton>
                  <QtyValue>{packageOption.quantity}</QtyValue>
                  <QtyButton
                    type="button"
                    onClick={() => {
                      const newQty = packageOption.quantity + 1;
                      setPackageOption((p) => ({ ...p, quantity: newQty }));
                      setEndDate(computeEndDate(packageOption.type, newQty));
                    }}
                  >
                    +
                  </QtyButton>
                  <span style={{ color: "rgba(20,20,15,0.65)", fontSize: "0.88rem", marginLeft: 8 }}>
                    Total: GHS {(parseFloat(packageOption.price) * packageOption.quantity).toFixed(2)}
                  </span>
                </QuantityRow>
              </FieldGroup>
            )}

            <Divider />

            <SectionHeading>
              <SectionIcon>✦</SectionIcon>
              <SectionTitle>Agreement *</SectionTitle>
            </SectionHeading>

            <AgreementBox
              checked={agreement === "agreed"}
              onClick={() => setAgreement(agreement === "agreed" ? "" : "agreed")}
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
                <a href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  Terms and Conditions
                </a>{" "}
                and confirm that all information provided is accurate.
              </AgreementText>
            </AgreementBox>
          </StepSlide>
        );

      // ── Step 4: Payment ───────────────────────────────────────────────────
      case 4: {
        const totalAmount =
          parseFloat(packageOption?.price || 0) * (packageOption?.quantity || 1);
        return (
          <StepSlide direction={direction}>
            <SectionHeading>
              <SectionIcon>◈</SectionIcon>
              <SectionTitle>Payment</SectionTitle>
            </SectionHeading>

            <InfoNote>
              Complete your purchase to publish your discount ad.
            </InfoNote>

            <Payment
              amount={totalAmount}
              package_type={packageOption?.type}
              user={{
                name: organizerName,
                email: email,
                contact: phoneNumber,
              }}
              handlePostDiscount={handlePostDiscount}
            />
          </StepSlide>
        );
      }

      default:
        return null;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
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
            <FormTitle>{discount ? "Update Discount Ad" : "Create Discount Ad"}</FormTitle>

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
            <StepCounter>{step + 1} / {STEPS.length}</StepCounter>

            {step > 0 && (
              <PrevButton type="button" onClick={() => goTo(step - 1)}>
                ← Back
              </PrevButton>
            )}

            {step < STEPS.length - 1 && (
              <NextButton
                type="button"
                disabled={!canProceed[step]}
                onClick={() => goTo(step + 1)}
              >
                Continue →
              </NextButton>
            )}
          </CardFooter>
        </Card>
      </CardOuter>
    </PageWrap>
  );
};

// ─── Redux connections ────────────────────────────────────────────────────────
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