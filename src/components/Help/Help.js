import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

// ─── Section data ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "basics",      label: "Basics",            icon: "✦" },
  { id: "accounts",   label: "Account",            icon: "◈" },
  { id: "payment",    label: "Payment",            icon: "◎" },
  { id: "packages",   label: "Ad Packages",        icon: "◇" },
  { id: "location",   label: "Google Location",    icon: "◉" },
];

function Help() {
  const { secId } = useParams();
  const [activeSection, setActiveSection] = useState("basics");
  const [revealed, setRevealed] = useState({});
  const sectionRefs = useRef({});

  // Scroll to section from URL param
  useEffect(() => {
    if (secId) {
      setTimeout(() => {
        const el = document.getElementById(secId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [secId]);

  // Intersection observer — active sidebar + reveal animations
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
        { threshold: 0.15, rootMargin: "-80px 0px -30% 0px" }
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

  return (
    <Page>
      {/* ── Hero ── */}
      <Hero>
        <HeroGrain />
        <HeroBadge>Help Center</HeroBadge>
        <HeroTitle>
          Everything you need<br />
          <HeroAccent>to get started.</HeroAccent>
        </HeroTitle>
        <HeroSub>
          QuickDiscount — Ghana's fastest way to run and find discount promos.
          No wahala.
        </HeroSub>
        <HeroChips>
          {SECTIONS.map(({ id, label }) => (
            <HeroChip key={id} onClick={() => scrollTo(id)}>{label}</HeroChip>
          ))}
        </HeroChips>
      </Hero>

      {/* ── Body ── */}
      <Body>
        {/* Sticky sidebar */}
        <Sidebar>
          <SidebarInner>
            <SidebarLabel>ON THIS PAGE</SidebarLabel>
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
              <SidebarFooterLink to="/discounts/add">Post a Discount →</SidebarFooterLink>
            </SidebarFooter>
          </SidebarInner>
        </Sidebar>

        {/* Main content */}
        <Content>

          {/* ── Basics ── */}
          <Section id="basics" revealed={revealed["basics"]}>
            <SectionTag>01</SectionTag>
            <SectionHeading>Basics</SectionHeading>
            <Lead>
              Welcome to <Orange>QuickDiscount</Orange> — get all your latest
              discounts with no <em>wahala!</em> Wanna run a discount promo?
              Just create a QuickDiscount ad.
            </Lead>
            <StepGrid>
              {[
                { n: "01", title: "Create an account", body: "Sign up or log in if you already have one. Takes 30 seconds." },
                { n: "02", title: 'Click "Post"', body: "Hit Post in the navigation bar to begin your discount ad creation." },
                { n: "03", title: "Set your deal", body: "Enter percentage discounts, prices, dates, and all relevant promo info." },
                { n: "04", title: "Go live", body: "Once submitted, your ad is reviewed and goes live. Customers can start purchasing." },
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
            <SectionTag>02</SectionTag>
            <SectionHeading>Account</SectionHeading>
            <Lead>
              A QuickDiscount account gives you full control of your discount
              ads, analytics, and customer interactions.
            </Lead>
            <FeatureList>
              {[
                { icon: "✏️", text: "Create, edit, and delete discount ads." },
                { icon: "💰", text: "Set up payment preferences and receive payments directly." },
                { icon: "📊", text: "View discount statistics and engagement details." },
                { icon: "💬", text: "Communicate with customers through our messaging system." },
              ].map(({ icon, text }) => (
                <FeatureItem key={text}>
                  <FeatureEmoji>{icon}</FeatureEmoji>
                  <span>{text}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            <InfoBox>
              Keep your account information secure and updated to ensure smooth
              discount management.
            </InfoBox>
          </Section>

          <Divider />

          {/* ── Payment ── */}
          <Section id="payment" revealed={revealed["payment"]}>
            <SectionTag>03</SectionTag>
            <SectionHeading>Payment</SectionHeading>
            <Lead>
              QuickDiscount provides secure payment processing for your discount
              sales, supporting multiple payment methods for shops and customers.
            </Lead>
            <PaymentGrid>
              {[
                { label: "Choose Gateway", detail: "Select your preferred payment gateway — MoMo or Bank transfer." },
                { label: "Enter Details", detail: "Input your payment details to receive discount sales revenue securely." },
                { label: "Customer Checkout", detail: "Customers pay via their preferred method through our encrypted checkout." },
                { label: "Track Earnings", detail: "Monitor payouts and earnings in real time from your account dashboard." },
              ].map(({ label, detail }) => (
                <PaymentCard key={label}>
                  <PaymentCardLabel>{label}</PaymentCardLabel>
                  <PaymentCardDetail>{detail}</PaymentCardDetail>
                </PaymentCard>
              ))}
            </PaymentGrid>
          </Section>

          <Divider />

          {/* ── Ad Packages ── */}
          <Section id="packages" revealed={revealed["packages"]}>
            <SectionTag>04</SectionTag>
            <SectionHeading>Ad Packages</SectionHeading>
            <Lead>
              Choose the package that matches your promo goals and budget.
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
                <PackagePrice>GHS 75 <PackagePriceSub>up to 10 clicks</PackagePriceSub></PackagePrice>
                <PackagePriceAlt>GHS 100 for 10+ clicks</PackagePriceAlt>
                <PackageDesc>
                  Homepage visibility for a full week with multiple clicks
                  allowed. Great for ongoing promotions and sale periods.
                </PackageDesc>
                <PackageBadge>Best for sale weeks</PackageBadge>
              </PackageCard>

              <PackageCard accent="#b84500">
                <PackageName>Monthly</PackageName>
                <PackagePrice>GHS 300 <PackagePriceSub>/ month</PackagePriceSub></PackagePrice>
                <PackagePriceAlt>Top banner position</PackagePriceAlt>
                <PackageDesc>
                  Premium top-banner placement on the home screen for an entire
                  month. Maximum reach for serious promoters.
                </PackageDesc>
                <PackageBadge>Best for brands</PackageBadge>
              </PackageCard>
            </PackagesRow>
          </Section>

          <Divider />

          {/* ── Google Location ── */}
          <Section id="location" revealed={revealed["location"]}>
            <SectionTag>05</SectionTag>
            <SectionHeading>Adding Your Location</SectionHeading>
            <Lead>
              Follow these steps to pin your business on Google Maps and embed
              the map link into your QuickDiscount ad.
            </Lead>
            <LocationSteps>
              {[
                {
                  n: "1",
                  title: "Open Google Maps",
                  body: <>Go to <ExternalLink href="https://www.google.com/maps" target="_blank" rel="noreferrer">google.com/maps</ExternalLink> in your browser.</>,
                },
                {
                  n: "2",
                  title: "Search for Your Location",
                  body: "Use the search bar at the top left to find your address or business name.",
                },
                {
                  n: "3",
                  title: "Pin Your Location",
                  body: "Click on the map to drop a red pin exactly where your business is.",
                },
                {
                  n: "4",
                  title: "Access Share Option",
                  body: "Click the red pin — a card will appear. Click the Share button on that card.",
                },
                {
                  n: "5",
                  title: "Generate the Embed Link",
                  body: 'In the "Share this place" window, click the "Embed a map" tab. Customise the size if needed.',
                },
                {
                  n: "6",
                  title: "Copy & Paste",
                  body: "Copy the full iframe HTML code and paste it into the Google Location field in the discount creation form.",
                },
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
              🎉 Congratulations! You've successfully added your location.
              Reach out via the{" "}
              <Link to="/help">Help Center</Link> if you need further assistance.
            </SuccessBox>
          </Section>

        </Content>
      </Body>
    </Page>
  );
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const pip = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background-color: #0e0c0b;
  color: #f0ece6;
  font-family: 'Georgia', 'Times New Roman', serif;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  position: relative;
  padding: 140px 8% 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(250, 129, 40, 0.18) 0%, transparent 70%);
  border-bottom: 1px solid rgba(250, 129, 40, 0.15);

  @media (max-width: 768px) {
    padding: 120px 6% 60px;
  }
`;

const HeroGrain = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px;
  pointer-events: none;
`;

const HeroBadge = styled.span`
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fa8128;
  border: 1px solid rgba(250, 129, 40, 0.4);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.6s ease both;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.4rem, 6vw, 4.8rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
  color: #f5f0e8;
  animation: ${fadeUp} 0.6s 0.1s ease both;
`;

const HeroAccent = styled.span`
  background: linear-gradient(90deg, #fa8128, #ffb366, #fa8128);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite, ${fadeUp} 0.6s 0.15s ease both;
`;

const HeroSub = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(240, 236, 230, 0.55);
  max-width: 480px;
  line-height: 1.6;
  margin: 0 auto 40px;
  text-align: center;
  font-family: 'Georgia', serif;
  animation: ${fadeUp} 0.6s 0.2s ease both;
`;

const HeroChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  animation: ${fadeUp} 0.6s 0.3s ease both;
`;

const HeroChip = styled.button`
  background: rgba(250, 129, 40, 0.10);
  border: 1px solid rgba(250, 129, 40, 0.25);
  color: rgba(250, 129, 40, 0.9);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background: rgba(250, 129, 40, 0.20);
    border-color: rgba(250, 129, 40, 0.55);
    color: #fa8128;
  }
`;

// ─── Body Layout ──────────────────────────────────────────────────────────────

const Body = styled.div`
  display: flex;
  align-items: flex-start;
  width: 88%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 0 120px;
  gap: 60px;

  @media (max-width: 900px) {
    flex-direction: column;
    width: 92%;
    gap: 0;
    padding: 40px 0 80px;
  }
`;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  align-self: flex-start;

  @media (max-width: 900px) {
    display: none;
  }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SidebarLabel = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(240, 236, 230, 0.3);
  margin: 0 0 16px 0;
  padding-left: 4px;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SidebarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ active }) => active ? "rgba(250, 129, 40, 0.08)" : "transparent"};
  border: none;
  border-left: 2px solid ${({ active }) => active ? "#fa8128" : "rgba(240,236,230,0.08)"};
  color: ${({ active }) => active ? "#fa8128" : "rgba(240, 236, 230, 0.45)"};
  padding: 10px 14px;
  cursor: pointer;
  text-align: left;
  border-radius: 0 8px 8px 0;
  transition: all 0.2s ease;
  position: relative;
  width: 100%;

  &:hover {
    color: ${({ active }) => active ? "#fa8128" : "rgba(240, 236, 230, 0.75)"};
    background: rgba(250, 129, 40, 0.05);
  }
`;

const SidebarIcon = styled.span`
  font-size: 13px;
  opacity: ${({ active }) => active ? 1 : 0.5};
  transition: opacity 0.2s;
`;

const SidebarText = styled.span`
  font-size: 13px;
  font-weight: ${({ active }) => active ? "600" : "400"};
  font-family: 'Georgia', serif;
  letter-spacing: 0.01em;
`;

const SidebarPip = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #fa8128;
  margin-right: 10px;
`;

const SidebarFooter = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(240, 236, 230, 0.08);
`;

const SidebarFooterLink = styled(Link)`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: rgba(250, 129, 40, 0.7);
  text-decoration: none;
  padding-left: 4px;
  transition: color 0.2s;

  &:hover { color: #fa8128; }
`;

// ─── Content ─────────────────────────────────────────────────────────────────

const Content = styled.main`
  flex: 1;
  min-width: 0;
`;

const Section = styled.section`
  padding: 0 0 12px;
  opacity: ${({ revealed }) => (revealed ? 1 : 0)};
  transform: ${({ revealed }) => (revealed ? "translateY(0)" : "translateY(24px)")};
  transition: opacity 0.65s ease, transform 0.65s ease;
`;

const SectionTag = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: rgba(250, 129, 40, 0.5);
  display: block;
  margin-bottom: 10px;
`;

const SectionHeading = styled.h2`
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 700;
  color: #f5f0e8;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
  line-height: 1.1;
`;

const Lead = styled.p`
  font-size: 1.05rem;
  line-height: 1.75;
  color: rgba(240, 236, 230, 0.65);
  margin: 0 auto 36px;
  max-width: 640px;
  text-align: center;
`;

const Orange = styled.span`
  color: #fa8128;
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(240, 236, 230, 0.07);
  margin: 56px 0;
`;

// ─── Info / Success Boxes ─────────────────────────────────────────────────────

const InfoBox = styled.div`
  margin-top: 28px;
  padding: 18px 22px;
  background: rgba(250, 129, 40, 0.06);
  border-left: 3px solid rgba(250, 129, 40, 0.5);
  border-radius: 0 10px 10px 0;
  font-size: 0.9rem;
  color: rgba(240, 236, 230, 0.6);
  line-height: 1.6;
`;

const SuccessBox = styled.div`
  margin-top: 36px;
  padding: 20px 24px;
  background: rgba(250, 129, 40, 0.08);
  border: 1px solid rgba(250, 129, 40, 0.2);
  border-radius: 12px;
  font-size: 0.95rem;
  color: rgba(240, 236, 230, 0.7);
  line-height: 1.6;

  a {
    color: #fa8128;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

// ─── Step Grid (Basics) ───────────────────────────────────────────────────────

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const StepCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(240, 236, 230, 0.07);
  border-radius: 14px;
  padding: 24px 22px;
  transition: border-color 0.25s, background 0.25s;

  &:hover {
    border-color: rgba(250, 129, 40, 0.3);
    background: rgba(250, 129, 40, 0.04);
  }
`;

const StepNum = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #fa8128;
  margin-bottom: 12px;
  opacity: 0.8;
`;

const StepTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #f5f0e8;
  margin: 0 0 8px;
`;

const StepBody = styled.p`
  font-size: 0.875rem;
  color: rgba(240, 236, 230, 0.5);
  line-height: 1.6;
  margin: 0;
`;

// ─── Feature List (Accounts) ──────────────────────────────────────────────────

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(240, 236, 230, 0.06);
  border-radius: 10px;
  font-size: 0.92rem;
  color: rgba(240, 236, 230, 0.65);
  line-height: 1.55;
  transition: background 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.04); }
`;

const FeatureEmoji = styled.span`
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
`;

// ─── Payment Grid ─────────────────────────────────────────────────────────────

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentCard = styled.div`
  padding: 22px 20px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(240, 236, 230, 0.06);
  border-radius: 12px;
  transition: border-color 0.25s, background 0.25s;

  &:hover {
    border-color: rgba(250, 129, 40, 0.25);
    background: rgba(250, 129, 40, 0.03);
  }
`;

const PaymentCardLabel = styled.h4`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fa8128;
  margin: 0 0 10px;
  font-family: 'Courier New', monospace;
`;

const PaymentCardDetail = styled.p`
  font-size: 0.9rem;
  color: rgba(240, 236, 230, 0.55);
  line-height: 1.6;
  margin: 0;
`;

// ─── Ad Packages ─────────────────────────────────────────────────────────────

const PackagesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PackageCard = styled.div`
  position: relative;
  padding: 28px 24px 24px;
  background: ${({ featured }) =>
    featured
      ? "linear-gradient(135deg, rgba(250,129,40,0.14) 0%, rgba(180,70,0,0.10) 100%)"
      : "rgba(255, 255, 255, 0.025)"};
  border: 1px solid ${({ featured, accent }) =>
    featured ? `rgba(250, 129, 40, 0.45)` : "rgba(240, 236, 230, 0.07)"};
  border-radius: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    border-color: ${({ accent }) => accent}88;
  }
`;

const PackageFeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fa8128;
  color: #0e0c0b;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 14px;
  border-radius: 20px;
  white-space: nowrap;
`;

const PackageName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #f5f0e8;
  margin: 0 0 14px;
`;

const PackagePrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #fa8128;
  margin-bottom: 4px;
  line-height: 1.1;
`;

const PackagePriceSub = styled.span`
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(240, 236, 230, 0.4);
`;

const PackagePriceAlt = styled.div`
  font-size: 0.78rem;
  color: rgba(240, 236, 230, 0.35);
  font-family: 'Courier New', monospace;
  margin-bottom: 18px;
`;

const PackageDesc = styled.p`
  font-size: 0.875rem;
  color: rgba(240, 236, 230, 0.55);
  line-height: 1.65;
  margin: 0 0 18px;
`;

const PackageBadge = styled.div`
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  color: rgba(250, 129, 40, 0.6);
  border-top: 1px solid rgba(240, 236, 230, 0.07);
  padding-top: 14px;
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
    content: '';
    position: absolute;
    left: 19px;
    top: 20px;
    bottom: 20px;
    width: 1px;
    background: linear-gradient(to bottom, rgba(250,129,40,0.4), rgba(250,129,40,0.05));
  }
`;

const LocationStep = styled.li`
  display: flex;
  gap: 20px;
  padding: 20px 0;
`;

const LocationStepNum = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(250, 129, 40, 0.4);
  background: rgba(250, 129, 40, 0.08);
  color: #fa8128;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
`;

const LocationStepContent = styled.div`
  padding-top: 6px;
  flex: 1;
`;

const LocationStepTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #f5f0e8;
  margin: 0 0 6px;
`;

const LocationStepBody = styled.p`
  font-size: 0.9rem;
  color: rgba(240, 236, 230, 0.55);
  line-height: 1.65;
  margin: 0;
`;

const ExternalLink = styled.a`
  color: #fa8128;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

export default Help;