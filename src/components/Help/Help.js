import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

// ─── Section data ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "basics",   label: "Basics",          icon: "✦" },
  { id: "accounts", label: "Account",         icon: "◈" },
  { id: "payment",  label: "Payment",         icon: "◎" },
  { id: "packages", label: "Ad Packages",     icon: "◇" },
  { id: "location", label: "Google Location", icon: "◉" },
];

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:          "#faf8f5",
  surface:     "#ffffff",
  surfaceWarm: "#f5f2ed",
  border:      "rgba(0,0,0,0.08)",
  borderMed:   "rgba(0,0,0,0.12)",
  orange:      "#fa8128",
  orangeDim:   "rgba(250,129,40,0.1)",
  orangeMid:   "rgba(250,129,40,0.2)",
  text:        "#1a1710",
  textSub:     "rgba(26,23,16,0.55)",
  textMuted:   "rgba(26,23,16,0.38)",
  radius:      "14px",
  radiusSm:    "8px",
};

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const drawLine = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;

const pipPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  color: ${T.text};
  font-family: "Georgia", "Times New Roman", serif;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = styled.div`
  position: relative;
  padding: 130px 8% 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(
    180deg,
    rgba(250, 129, 40, 0.06) 0%,
    rgba(250, 129, 40, 0.02) 60%,
    transparent 100%
  );
  border-bottom: 1px solid ${T.border};

  @media (max-width: 768px) {
    padding: 110px 6% 60px;
  }
`;

/* Decorative cross-hatch dots in the hero background */
const HeroDots = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.045;
  background-image: radial-gradient(circle, #8B6914 1px, transparent 1px);
  background-size: 28px 28px;
`;

/* Top-left editorial bracket mark */
const HeroCornerMark = styled.div`
  position: absolute;
  top: 32px;
  left: 5%;
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: ${T.textMuted};
  text-transform: uppercase;
  animation: ${fadeUp} 0.5s ease both;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Courier New", monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${T.orange};
  border: 1px solid ${T.orangeMid};
  background: ${T.orangeDim};
  padding: 5px 16px;
  border-radius: 20px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.5s ease both;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${T.orange};
    animation: ${pipPulse} 2s ease-in-out infinite;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.025em;
  margin: 0 0 12px;
  color: ${T.text};
  animation: ${fadeUp} 0.55s 0.08s ease both;
`;

const HeroAccent = styled.span`
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #fa8128, #e06010, #fa8128);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation:
    ${shimmer} 5s linear infinite,
    ${fadeUp} 0.55s 0.12s ease both;

  /* Animated underline stroke */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #fa8128, #e06010);
    border-radius: 2px;
    animation: ${drawLine} 0.8s 0.7s ease both;
    width: 0;
  }
`;

const HeroSub = styled.p`
  font-size: 1.05rem;
  color: ${T.textSub};
  margin: 16px 0 40px;
  max-width: 520px;
  line-height: 1.7;
  font-style: italic;
  animation: ${fadeUp} 0.55s 0.18s ease both;
`;

const HeroChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  animation: ${fadeUp} 0.55s 0.28s ease both;
`;

const HeroChip = styled.button`
  background: ${T.surface};
  border: 1px solid ${T.border};
  color: ${T.textSub};
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-family: "Courier New", monospace;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  &:hover {
    background: ${T.orangeDim};
    border-color: ${T.orangeMid};
    color: ${T.orange};
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(250,129,40,0.15);
  }
`;

// ─── Body Layout ──────────────────────────────────────────────────────────────
const Body = styled.div`
  display: flex;
  align-items: flex-start;
  width: 88%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0 120px;
  gap: 56px;

  @media (max-width: 900px) {
    flex-direction: column;
    width: 92%;
    gap: 0;
    padding: 40px 0 80px;
  }
`;

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = styled.aside`
  width: 210px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  align-self: flex-start;

  @media (max-width: 900px) { display: none; }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SidebarLabel = styled.p`
  font-family: "Courier New", monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${T.textMuted};
  margin: 0 0 16px;
  padding-left: 14px;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid ${T.border};
`;

const SidebarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ active }) => (active ? T.orangeDim : "transparent")};
  border: none;
  border-left: 2px solid ${({ active }) => (active ? T.orange : "transparent")};
  color: ${({ active }) => (active ? T.orange : T.textSub)};
  padding: 9px 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
  margin-left: -1px;

  &:hover {
    color: ${({ active }) => (active ? T.orange : T.text)};
    background: ${({ active }) => (active ? T.orangeDim : "rgba(0,0,0,0.03)")};
  }
`;

const SidebarIcon = styled.span`
  font-size: 12px;
  opacity: ${({ active }) => (active ? 1 : 0.4)};
  transition: opacity 0.2s;
  flex-shrink: 0;
`;

const SidebarText = styled.span`
  font-size: 13px;
  font-weight: ${({ active }) => (active ? "600" : "400")};
  font-family: "Georgia", serif;
  letter-spacing: 0.01em;
`;

const SidebarPip = styled.div`
  margin-left: auto;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${T.orange};
  flex-shrink: 0;
  animation: ${pipPulse} 2.5s ease-in-out infinite;
`;

const SidebarFooter = styled.div`
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid ${T.border};
  padding-left: 14px;
`;

const SidebarFooterLink = styled(Link)`
  font-family: "Courier New", monospace;
  font-size: 11px;
  color: ${T.orange};
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover { opacity: 1; }
`;

// ─── Main Content ─────────────────────────────────────────────────────────────
const Content = styled.main`
  flex: 1;
  min-width: 0;
`;

const Section = styled.section`
  padding: 0 0 16px;
  /* Push the scroll target below the fixed navbar (~80px) + breathing room */
  scroll-margin-top: 96px;
  opacity: ${({ revealed }) => (revealed ? 1 : 0)};
  transform: ${({ revealed }) => (revealed ? "translateY(0)" : "translateY(20px)")};
  transition: opacity 0.6s ease, transform 0.6s ease;
`;

/* Large ghost number behind section heading */
const SectionTag = styled.span`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: ${T.orange};
  opacity: 0.55;
  display: block;
  margin-bottom: 8px;
`;

const SectionHeadingWrap = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SectionGhostNum = styled.span`
  position: absolute;
  right: 0;
  top: -20px;
  font-family: "Georgia", serif;
  font-size: clamp(5rem, 10vw, 8rem);
  font-weight: 700;
  color: ${T.orange};
  opacity: 0.04;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  letter-spacing: -0.04em;
`;

const SectionHeading = styled.h2`
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 700;
  color: ${T.text};
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

const Lead = styled.p`
  font-size: 1.02rem;
  line-height: 1.78;
  color: ${T.textSub};
  margin: 0 auto 36px;
  max-width: 620px;
  text-align: center;
`;

const Orange = styled.span`
  color: ${T.orange};
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${T.border};
  margin: 56px 0;
  position: relative;

  &::after {
    content: "◆";
    position: absolute;
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
    font-size: 10px;
    color: ${T.orange};
    opacity: 0.3;
    background: ${T.bg};
    padding: 0 8px;
  }
`;

// ─── Info / Success Boxes ─────────────────────────────────────────────────────
const InfoBox = styled.div`
  margin-top: 28px;
  padding: 16px 20px;
  background: ${T.orangeDim};
  border-left: 3px solid ${T.orange};
  border-radius: 0 ${T.radiusSm} ${T.radiusSm} 0;
  font-size: 0.9rem;
  color: ${T.textSub};
  line-height: 1.65;
`;

const SuccessBox = styled.div`
  margin-top: 36px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(250,129,40,0.07), rgba(250,129,40,0.03));
  border: 1px solid ${T.orangeMid};
  border-radius: ${T.radius};
  font-size: 0.95rem;
  color: ${T.textSub};
  line-height: 1.65;

  a {
    color: ${T.orange};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

// ─── Step Grid (Basics) ───────────────────────────────────────────────────────
const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
`;

const StepCard = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-top: 3px solid ${T.orangeDim};
  border-radius: ${T.radius};
  padding: 22px 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: border-top-color 0.25s, box-shadow 0.25s, transform 0.25s;

  &:hover {
    border-top-color: ${T.orange};
    box-shadow: 0 6px 20px rgba(0,0,0,0.07);
    transform: translateY(-2px);
  }
`;

const StepNum = styled.div`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: ${T.orange};
  margin-bottom: 12px;
  opacity: 0.7;
`;

const StepTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 8px;
`;

const StepBody = styled.p`
  font-size: 0.875rem;
  color: ${T.textSub};
  line-height: 1.62;
  margin: 0;
`;

// ─── Feature List (Accounts) ──────────────────────────────────────────────────
const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radiusSm};
  font-size: 0.92rem;
  color: ${T.textSub};
  line-height: 1.55;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: ${T.surfaceWarm};
    border-color: ${T.borderMed};
  }
`;

const FeatureEmoji = styled.span`
  font-size: 17px;
  flex-shrink: 0;
  margin-top: 1px;
`;

// ─── Payment Grid ─────────────────────────────────────────────────────────────
const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const PaymentCard = styled.div`
  padding: 20px 18px;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: border-color 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: ${T.orangeMid};
    box-shadow: 0 4px 16px rgba(250,129,40,0.08);
  }
`;

const PaymentCardLabel = styled.h4`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${T.orange};
  margin: 0 0 10px;
  font-family: "Courier New", monospace;
`;

const PaymentCardDetail = styled.p`
  font-size: 0.9rem;
  color: ${T.textSub};
  line-height: 1.62;
  margin: 0;
`;

// ─── Ad Packages ─────────────────────────────────────────────────────────────
const PackagesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const PackageCard = styled.div`
  position: relative;
  padding: 28px 22px 22px;
  background: ${({ featured }) =>
    featured
      ? "linear-gradient(145deg, rgba(250,129,40,0.07) 0%, rgba(250,129,40,0.03) 100%)"
      : T.surface};
  border: 1px solid ${({ featured }) => (featured ? T.orangeMid : T.border)};
  border-top: 3px solid ${({ accent }) => accent};
  border-radius: ${T.radius};
  box-shadow: ${({ featured }) =>
    featured
      ? "0 4px 24px rgba(250,129,40,0.1)"
      : "0 1px 4px rgba(0,0,0,0.04)"};
  transition: transform 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ featured }) =>
      featured
        ? "0 12px 36px rgba(250,129,40,0.15)"
        : "0 8px 24px rgba(0,0,0,0.08)"};
  }
`;

const PackageFeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${T.orange};
  color: #fff;
  font-family: "Courier New", monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 20px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(250,129,40,0.35);
`;

const PackageName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${T.text};
  margin: 0 0 12px;
`;

const PackagePrice = styled.div`
  font-size: 1.9rem;
  font-weight: 700;
  color: ${T.orange};
  margin-bottom: 4px;
  line-height: 1.1;
`;

const PackagePriceSub = styled.span`
  font-size: 0.82rem;
  font-weight: 400;
  color: ${T.textMuted};
`;

const PackagePriceAlt = styled.div`
  font-size: 0.76rem;
  color: ${T.textMuted};
  font-family: "Courier New", monospace;
  margin-bottom: 16px;
`;

const PackageDesc = styled.p`
  font-size: 0.875rem;
  color: ${T.textSub};
  line-height: 1.65;
  margin: 0 0 16px;
`;

const PackageBadge = styled.div`
  font-size: 0.73rem;
  font-family: "Courier New", monospace;
  color: ${T.orange};
  opacity: 0.65;
  border-top: 1px solid ${T.border};
  padding-top: 12px;
`;

// ─── Location Steps ───────────────────────────────────────────────────────────
const LocationSteps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  text-align: left;

  &::before {
    content: "";
    position: absolute;
    left: 19px;
    top: 20px;
    bottom: 20px;
    width: 1px;
    background: linear-gradient(to bottom, ${T.orange}, rgba(250,129,40,0.08));
  }
`;

const LocationStep = styled.li`
  display: flex;
  gap: 20px;
  padding: 18px 0;
`;

const LocationStepNum = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid ${T.orangeMid};
  background: ${T.orangeDim};
  color: ${T.orange};
  font-family: "Courier New", monospace;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
  box-shadow: 0 0 0 3px ${T.bg};
`;

const LocationStepContent = styled.div`
  padding-top: 6px;
  flex: 1;
`;

const LocationStepTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${T.text};
  margin: 0 0 5px;
`;

const LocationStepBody = styled.p`
  font-size: 0.9rem;
  color: ${T.textSub};
  line-height: 1.65;
  margin: 0;
`;

const ExternalLink = styled.a`
  color: ${T.orange};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

// ─── Component ────────────────────────────────────────────────────────────────
function Help() {
  const { secId } = useParams();
  const [activeSection, setActiveSection] = useState("basics");
  const [revealed, setRevealed] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    if (secId) {
      setTimeout(() => {
        const el = document.getElementById(secId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [secId]);

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            setRevealed((prev) => ({ ...prev, [id]: true }));
          }
        },
        { threshold: 0.15, rootMargin: "-80px 0px -30% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionNumbers = { basics: "01", accounts: "02", payment: "03", packages: "04", location: "05" };

  return (
    <Page>
      {/* ── Hero ── */}
      <Hero>
        <HeroDots />
        <HeroCornerMark>QuickDiscount / Help Center</HeroCornerMark>
        <HeroBadge>Help Center</HeroBadge>
        <HeroTitle>
          Everything you need
          <br />
          <HeroAccent>to get started.</HeroAccent>
        </HeroTitle>
        <HeroSub>Guides, pricing, and tips — all in one place.</HeroSub>
        <HeroChips>
          {SECTIONS.map(({ id, label }) => (
            <HeroChip key={id} onClick={() => scrollTo(id)}>
              {label}
            </HeroChip>
          ))}
        </HeroChips>
      </Hero>

      {/* ── Body ── */}
      <Body>
        {/* Sticky sidebar */}
        <Sidebar>
          <SidebarInner>
            <SidebarLabel>On this page</SidebarLabel>
            <SidebarNav>
              {SECTIONS.map(({ id, label, icon }) => (
                <SidebarItem
                  key={id}
                  active={activeSection === id}
                  onClick={() => scrollTo(id)}
                >
                  <SidebarIcon active={activeSection === id}>{icon}</SidebarIcon>
                  <SidebarText active={activeSection === id}>{label}</SidebarText>
                  {activeSection === id && <SidebarPip />}
                </SidebarItem>
              ))}
            </SidebarNav>
            <SidebarFooter>
              <SidebarFooterLink to="/discounts/add">
                Post a Discount →
              </SidebarFooterLink>
            </SidebarFooter>
          </SidebarInner>
        </Sidebar>

        {/* Main content */}
        <Content>

          {/* ── Basics ── */}
          <Section id="basics" revealed={revealed["basics"]}>
            <SectionTag>01 — Basics</SectionTag>
            <SectionHeadingWrap>
              <SectionGhostNum>01</SectionGhostNum>
              <SectionHeading>Getting Started</SectionHeading>
            </SectionHeadingWrap>
            <Lead>
              Welcome to <Orange>QuickDiscount</Orange> — get all your latest
              discounts with no <em>wahala!</em> Wanna run a discount promo?
              Just create a QuickDiscount ad.
            </Lead>
            <StepGrid>
              {[
                { n: "01", title: "Create an account",  body: "Sign up or log in if you already have one. Takes 30 seconds." },
                { n: "02", title: 'Click "Post"',        body: "Hit Post in the navigation bar to begin your discount ad creation." },
                { n: "03", title: "Set your deal",       body: "Enter percentage discounts, prices, dates, and all relevant promo info." },
                { n: "04", title: "Go live",             body: "Once submitted, your ad is reviewed and goes live. Customers can start purchasing." },
              ].map(({ n, title, body }) => (
                <StepCard key={n}>
                  <StepNum>{n}</StepNum>
                  <StepTitle>{title}</StepTitle>
                  <StepBody>{body}</StepBody>
                </StepCard>
              ))}
            </StepGrid>
          </Section>

          <Divider />

          {/* ── Accounts ── */}
          <Section id="accounts" revealed={revealed["accounts"]}>
            <SectionTag>02 — Account</SectionTag>
            <SectionHeadingWrap>
              <SectionGhostNum>02</SectionGhostNum>
              <SectionHeading>Your Account</SectionHeading>
            </SectionHeadingWrap>
            <Lead>
              A QuickDiscount account gives you full control of your discount
              ads, analytics, and customer interactions.
            </Lead>
            <FeatureList>
              {[
                { icon: "✏️", text: "Create, edit, and delete discount ads." },
                { icon: "📊", text: "Track views, clicks, and engagement on your ads." },
                { icon: "🔔", text: "Get notified when customers interact with your offers." },
                { icon: "💬", text: "Respond to reviews and build your brand reputation." },
                { icon: "🔒", text: "Secure login and account recovery options." },
              ].map(({ icon, text }) => (
                <FeatureItem key={text}>
                  <FeatureEmoji>{icon}</FeatureEmoji>
                  <span>{text}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            <InfoBox>
              💡 Keep your account details up to date to ensure smooth payment processing and customer communication.
            </InfoBox>
          </Section>

          <Divider />

          {/* ── Payment ── */}
          <Section id="payment" revealed={revealed["payment"]}>
            <SectionTag>03 — Payment</SectionTag>
            <SectionHeadingWrap>
              <SectionGhostNum>03</SectionGhostNum>
              <SectionHeading>Payment</SectionHeading>
            </SectionHeadingWrap>
            <Lead>
              QuickDiscount uses Paystack for secure, fast payments. We support
              mobile money and card payments across Ghana.
            </Lead>
            <PaymentGrid>
              {[
                { label: "Mobile Money", detail: "Pay via MTN MoMo, Vodafone Cash, or AirtelTigo Money. You'll receive an OTP to confirm." },
                { label: "Card Payment", detail: "Visa and Mastercard accepted. Your card details are never stored on our servers." },
                { label: "Secure & Encrypted", detail: "All transactions are SSL-encrypted and processed by Paystack — a PCI DSS Level 1 compliant provider." },
                { label: "Instant Activation", detail: "Your ad goes live immediately after a successful payment confirmation." },
              ].map(({ label, detail }) => (
                <PaymentCard key={label}>
                  <PaymentCardLabel>{label}</PaymentCardLabel>
                  <PaymentCardDetail>{detail}</PaymentCardDetail>
                </PaymentCard>
              ))}
            </PaymentGrid>
          </Section>

          <Divider />

          {/* ── Packages ── */}
          <Section id="packages" revealed={revealed["packages"]}>
            <SectionTag>04 — Ad Packages</SectionTag>
            <SectionHeadingWrap>
              <SectionGhostNum>04</SectionGhostNum>
              <SectionHeading>Ad Packages</SectionHeading>
            </SectionHeadingWrap>
            <Lead>
              Choose a package that fits your promo timeline and budget.
              Every package includes homepage visibility.
            </Lead>
            <PackagesRow>
              <PackageCard accent="#fa8128">
                <PackageName>Daily</PackageName>
                <PackagePrice>GHS 20 <PackagePriceSub>/ day</PackagePriceSub></PackagePrice>
                <PackagePriceAlt>or GHS 50 for unlimited visibility</PackagePriceAlt>
                <PackageDesc>
                  Visible on the main page for 24 hours. One clickthrough per day.
                  Perfect for limited-time offers or new product launches.
                </PackageDesc>
                <PackageBadge>Best for quick promos</PackageBadge>
              </PackageCard>

              <PackageCard accent="#e05a00" featured>
                <PackageFeaturedBadge>Most Popular</PackageFeaturedBadge>
                <PackageName>Weekly</PackageName>
                <PackagePrice>GHS 100 <PackagePriceSub>up to 10 clicks</PackagePriceSub></PackagePrice>
                <PackagePriceAlt>GHS 140 for 10+ clicks</PackagePriceAlt>
                <PackageDesc>
                  Homepage visibility for a full week with multiple clicks allowed.
                  Great for ongoing promotions and sale periods.
                </PackageDesc>
                <PackageBadge>Best for sale weeks</PackageBadge>
              </PackageCard>

              <PackageCard accent="#c44800">
                <PackageName>Monthly</PackageName>
                <PackagePrice>GHS 300 <PackagePriceSub>/ month</PackagePriceSub></PackagePrice>
                <PackagePriceAlt>Top banner position</PackagePriceAlt>
                <PackageDesc>
                  Premium top-banner placement on the home screen for an entire month.
                  Maximum reach for serious promoters.
                </PackageDesc>
                <PackageBadge>Best for brands</PackageBadge>
              </PackageCard>
            </PackagesRow>
          </Section>

          <Divider />

          {/* ── Google Location ── */}
          <Section id="location" revealed={revealed["location"]}>
            <SectionTag>05 — Google Location</SectionTag>
            <SectionHeadingWrap>
              <SectionGhostNum>05</SectionGhostNum>
              <SectionHeading>Adding Your Location</SectionHeading>
            </SectionHeadingWrap>
            <Lead>
              Follow these steps to pin your business on Google Maps and embed
              the map link into your QuickDiscount ad.
            </Lead>
            <LocationSteps>
              {[
                { n: "1", title: "Open Google Maps",        body: <> Go to <ExternalLink href="https://www.google.com/maps" target="_blank" rel="noreferrer">google.com/maps</ExternalLink> in your browser. </> },
                { n: "2", title: "Search for Your Location", body: "Use the search bar at the top left to find your address or business name." },
                { n: "3", title: "Pin Your Location",        body: "Click on the map to drop a red pin exactly where your business is." },
                { n: "4", title: "Access Share Option",      body: "Click the red pin — a card will appear. Click the Share button on that card." },
                { n: "5", title: "Generate the Embed Link",  body: 'In the "Share this place" window, click the "Embed a map" tab. Customise the size if needed.' },
                { n: "6", title: "Copy & Paste",             body: "Copy the full iframe HTML code and paste it into the Google Location field in the discount creation form." },
              ].map(({ n, title, body }) => (
                <LocationStep key={n}>
                  <LocationStepNum>{n}</LocationStepNum>
                  <LocationStepContent>
                    <LocationStepTitle>{title}</LocationStepTitle>
                    <LocationStepBody>{body}</LocationStepBody>
                  </LocationStepContent>
                </LocationStep>
              ))}
            </LocationSteps>
            <SuccessBox>
              🎉 Congratulations! You've successfully added your location. Reach
              out via the <Link to="/help">Help Center</Link> if you need further assistance.
            </SuccessBox>
          </Section>

        </Content>
      </Body>
    </Page>
  );
}

export default Help;