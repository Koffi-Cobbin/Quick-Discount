import { useState, useEffect, useRef } from "react";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";

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

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DISCOUNTS = [
  {
    id: 1,
    title: "50% Off Fresh Groceries",
    location: "Accra Mall, Accra",
    likes: 214,
    categories: [{ name: "Food" }],
    discount_pct: 50,
    expiry: "Mar 2",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
  },
  {
    id: 2,
    title: "Nike Trainers Flash Sale",
    location: "Okaishie, Accra",
    likes: 189,
    categories: [{ name: "Fashion" }],
    discount_pct: 35,
    expiry: "Mar 5",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    id: 3,
    title: "Nairobi Spa Weekend Deal",
    location: "East Legon, Accra",
    likes: 97,
    categories: [{ name: "Wellness" }],
    discount_pct: 40,
    expiry: "Mar 10",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  },
  {
    id: 4,
    title: "Samsung Galaxy S24 Ultra",
    location: "Tema, Greater Accra",
    likes: 305,
    categories: [{ name: "Electronics" }],
    discount_pct: 20,
    expiry: "Mar 3",
    img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
  },
  {
    id: 5,
    title: "Rooftop Dining Experience",
    location: "Cantonments, Accra",
    likes: 152,
    categories: [{ name: "Food" }],
    discount_pct: 25,
    expiry: "Mar 8",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    id: 6,
    title: "Kente & Fabric Sale",
    location: "Kumasi Central",
    likes: 78,
    categories: [{ name: "Fashion" }],
    discount_pct: 60,
    expiry: "Mar 12",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
  },
  {
    id: 7,
    title: "Gym Membership — 3 Months",
    location: "Labone, Accra",
    likes: 43,
    categories: [{ name: "Wellness" }],
    discount_pct: 45,
    expiry: "Mar 15",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    id: 8,
    title: "HP Laptop Clearance",
    location: "Tesano, Accra",
    likes: 261,
    categories: [{ name: "Electronics" }],
    discount_pct: 30,
    expiry: "Mar 4",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  },
  {
    id: 9,
    title: "Weekend Brunch Buffet",
    location: "Airport Hills, Accra",
    likes: 119,
    categories: [{ name: "Food" }],
    discount_pct: 15,
    expiry: "Mar 9",
    img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  },
];

const CATS = ["All", "Food", "Fashion", "Electronics", "Wellness"];
const SORTS = ["Popular", "Newest", "Biggest Deal"];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(250,129,40,0); }
  50%       { box-shadow: 0 0 22px 4px rgba(250,129,40,0.18); }
`;
const grain = keyframes`
  0%,100% { transform: translate(0,0); }
  10%      { transform: translate(-2%,-3%); }
  30%      { transform: translate(3%,-1%); }
  50%      { transform: translate(-1%,2%); }
  70%      { transform: translate(2%,3%); }
  90%      { transform: translate(-3%,1%); }
`;

// ─── Global ───────────────────────────────────────────────────────────────────
const Global = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; }
  ::-webkit-scrollbar { width: 4px; } 
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(250,129,40,0.3); border-radius: 4px; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${T.bg};
  font-family: "DM Sans", sans-serif;
  position: relative;
  overflow-x: hidden;
`;

const GrainOverlay = styled.div`
  pointer-events: none;
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: ${grain} 8s steps(10) infinite;
  z-index: 0;
`;

const AmbientBlob = styled.div`
  pointer-events: none;
  position: fixed;
  top: -200px;
  right: -200px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(250, 129, 40, 0.07) 0%,
    transparent 65%
  );
  z-index: 0;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 80px;

  @media (max-width: 600px) {
    padding: 0 16px 60px;
  }
`;

// ─── Header band ─────────────────────────────────────────────────────────────
const Header = styled.div`
  padding: 64px 0 0;
  animation: ${fadeUp} 0.55s ease both;
`;

const Eyebrow = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${T.orange};
  margin-bottom: 12px;
`;

const Headline = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.08;
  color: ${T.text};
  em {
    font-style: italic;
    color: ${T.orange};
  }
`;

const Sub = styled.p`
  margin-top: 14px;
  font-size: 0.95rem;
  color: ${T.textSub};
  max-width: 480px;
  line-height: 1.65;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

const PostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: ${T.orange};
  color: #fff;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  animation: ${pulseGlow} 3s ease-in-out infinite;

  &:hover {
    background: #e06510;
    transform: translateY(-1px);
  }
`;

// ─── Divider ─────────────────────────────────────────────────────────────────
const Rule = styled.div`
  height: 1px;
  background: ${T.border};
  margin: 36px 0 28px;
`;

// ─── Controls row ────────────────────────────────────────────────────────────
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.55s 0.1s ease both;
`;

const CatRail = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex-shrink: 1;
  min-width: 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Chip = styled.button`
  padding: 7px 16px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-family: "Courier New", monospace;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
  border: 1px solid ${({ $active }) => ($active ? T.orange : T.border)};
  background: ${({ $active }) => ($active ? T.orangeDim : "transparent")};
  color: ${({ $active }) => ($active ? T.orange : T.textSub)};

  &:hover {
    border-color: ${T.orange};
    color: ${T.orange};
    background: ${T.orangeDim};
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const SortSelect = styled.select`
  background: ${T.surface};
  border: 1px solid ${T.border};
  color: ${T.textSub};
  font-family: "Courier New", monospace;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  padding: 7px 14px;
  border-radius: 30px;
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: border-color 0.2s;

  &:focus,
  &:hover {
    border-color: rgba(250, 129, 40, 0.35);
    color: ${T.text};
  }

  option {
    background: #1a1a16;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: 8px;
  overflow: hidden;
`;

const ViewBtn = styled.button`
  padding: 7px 12px;
  border: none;
  background: ${({ $active }) => ($active ? T.orangeDim : "transparent")};
  color: ${({ $active }) => ($active ? T.orange : T.textMuted)};
  cursor: pointer;
  transition: all 0.18s;
  font-size: 14px;
  display: flex;
  align-items: center;

  &:hover {
    color: ${T.orange};
  }
`;

// ─── Results count ───────────────────────────────────────────────────────────
const ResultsMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.55s 0.15s ease both;
`;

const ResultsCount = styled.p`
  font-family: "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: ${T.textMuted};
  text-transform: uppercase;
`;

const ActiveFilters = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-family: "Courier New", monospace;
  background: ${T.orangeDim};
  border: 1px solid rgba(250, 129, 40, 0.3);
  color: ${T.orange};
  cursor: pointer;

  &:hover {
    background: rgba(250, 129, 40, 0.25);
  }
`;

// ─── Grid ────────────────────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  gap: 20px;
  ${({ $view }) =>
    $view === "grid"
      ? css`
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        `
      : css`
          grid-template-columns: 1fr;
        `}
  animation: ${fadeUp} 0.5s 0.2s ease both;
`;

// ─── Card ────────────────────────────────────────────────────────────────────
const Card = styled.div`
  position: relative;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.25s,
    transform 0.25s,
    box-shadow 0.25s;

  ${({ $list }) =>
    $list &&
    css`
      display: flex;
      align-items: stretch;
    `}

  &:hover {
    border-color: rgba(250, 129, 40, 0.35);
    transform: translateY(-3px);
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(250, 129, 40, 0.1);
  }
`;

const CardImg = styled.div`
  position: relative;
  ${({ $list }) =>
    $list
      ? css`
          width: 200px;
          flex-shrink: 0;
          height: auto;
        `
      : css`
          height: 190px;
        `}
  overflow: hidden;
  background: #1a1a16;

  @media (max-width: 500px) {
    ${({ $list }) =>
      $list &&
      css`
        width: 130px;
      `}
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.06);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${T.orange};
  color: #fff;
  font-family: "Playfair Display", serif;
  font-style: italic;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: -0.01em;
  line-height: 1;
`;

const ExpiryTag = styled.div`
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

const CardBody = styled.div`
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const CatLabel = styled.span`
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

const CardTitle = styled.h3`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.08rem;
  font-weight: 700;
  color: ${T.text};
  line-height: 1.3;
  margin-bottom: 8px;
  transition: color 0.2s;

  ${Card}:hover & {
    color: ${T.orange};
  }
`;

const CardLoc = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: ${T.textSub};
  margin-bottom: auto;

  svg {
    color: ${T.orange};
    flex-shrink: 0;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${T.border};
`;

const Likes = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: ${T.textMuted};
  transition: color 0.2s;

  ${Card}:hover & {
    color: ${T.orange};
  }
`;

const SaveBtn = styled.button`
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

// ─── Skeleton ────────────────────────────────────────────────────────────────
const SkeletonShimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const SkeletonBase = css`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 37%,
    rgba(255, 255, 255, 0.04) 63%
  );
  background-size: 600px 100%;
  animation: ${SkeletonShimmer} 1.4s infinite linear;
  border-radius: 6px;
`;

const SkeletonCard = styled.div`
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: ${T.radius};
  overflow: hidden;
`;
const SkeletonImg = styled.div`
  ${SkeletonBase};
  height: 190px;
`;
const SkeletonLine = styled.div`
  ${SkeletonBase};
  height: 14px;
  width: ${({ w }) => w || "80%"};
  margin: 10px 18px 0;
`;
const SkeletonThin = styled.div`
  ${SkeletonBase};
  height: 10px;
  width: ${({ w }) => w || "55%"};
  margin: 8px 18px 18px;
`;

// ─── Empty ───────────────────────────────────────────────────────────────────
const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  animation: ${fadeUp} 0.4s ease both;
`;
const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;
const EmptyText = styled.p`
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  font-style: italic;
  color: ${T.textSub};
  margin-bottom: 8px;
`;
const EmptySub = styled.p`
  font-size: 0.85rem;
  color: ${T.textMuted};
`;

// ─── Search bar ──────────────────────────────────────────────────────────────
const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;
  max-width: 340px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${T.surface};
  border: 1px solid ${T.border};
  border-radius: 30px;
  color: ${T.text};
  font-family: "DM Sans", sans-serif;
  font-size: 0.85rem;
  padding: 8px 16px 8px 38px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${T.textMuted};
  }
  &:focus {
    border-color: rgba(250, 129, 40, 0.4);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: ${T.textMuted};
  font-size: 14px;
  pointer-events: none;
`;

// ─── Main component ───────────────────────────────────────────────────────────
export default function DiscountsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [view, setView] = useState("grid");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(new Set());

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Filter + sort
  const filtered = MOCK_DISCOUNTS.filter(
    (d) =>
      activeCat === "All" || d.categories.some((c) => c.name === activeCat),
  )
    .filter(
      (d) =>
        !query ||
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.location.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "Popular") return b.likes - a.likes;
      if (sort === "Biggest Deal") return b.discount_pct - a.discount_pct;
      return 0;
    });

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <Global />
      <Page>
        <GrainOverlay />
        <AmbientBlob />

        <Inner>
          {/* ── Header ── */}
          <Header>
            <HeaderRow>
              <div>
                <Eyebrow>🔥 QuickDiscount — Browse</Eyebrow>
                <Headline>
                  Fresh deals,
                  <br />
                  <em>no wahala.</em>
                </Headline>
                <Sub>
                  All the latest discounts from across Ghana, curated and
                  updated daily.
                </Sub>
              </div>
              <PostBtn>
                <span>+</span> Post a Discount
              </PostBtn>
            </HeaderRow>
          </Header>

          <Rule />

          {/* ── Controls ── */}
          <Controls>
            <CatRail>
              {CATS.map((cat) => (
                <Chip
                  key={cat}
                  $active={activeCat === cat}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </Chip>
              ))}
            </CatRail>

            <RightControls>
              <SearchWrap>
                <SearchIcon>🔍</SearchIcon>
                <SearchInput
                  placeholder="Search deals..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </SearchWrap>

              <SortSelect
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </SortSelect>

              <ViewToggle>
                <ViewBtn
                  $active={view === "grid"}
                  onClick={() => setView("grid")}
                  title="Grid view"
                >
                  ⊞
                </ViewBtn>
                <ViewBtn
                  $active={view === "list"}
                  onClick={() => setView("list")}
                  title="List view"
                >
                  ☰
                </ViewBtn>
              </ViewToggle>
            </RightControls>
          </Controls>

          {/* ── Results meta ── */}
          {!loading && (
            <ResultsMeta>
              <ResultsCount>
                {filtered.length} deal{filtered.length !== 1 ? "s" : ""} found
                {activeCat !== "All" ? ` · ${activeCat}` : ""}
              </ResultsCount>
              <ActiveFilters>
                {activeCat !== "All" && (
                  <FilterPill onClick={() => setActiveCat("All")}>
                    {activeCat} ✕
                  </FilterPill>
                )}
                {query && (
                  <FilterPill onClick={() => setQuery("")}>
                    "{query}" ✕
                  </FilterPill>
                )}
              </ActiveFilters>
            </ResultsMeta>
          )}

          {/* ── Grid ── */}
          <Grid $view={view}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i}>
                  <SkeletonImg />
                  <SkeletonLine w="75%" />
                  <SkeletonLine w="55%" />
                  <SkeletonThin w="40%" />
                </SkeletonCard>
              ))
            ) : filtered.length === 0 ? (
              <Empty>
                <EmptyIcon>🔎</EmptyIcon>
                <EmptyText>No discounts found.</EmptyText>
                <EmptySub>Try a different category or search term.</EmptySub>
              </Empty>
            ) : (
              filtered.map((d) => (
                <Card key={d.id} $list={view === "list"}>
                  <CardImg $list={view === "list"}>
                    <img src={d.img} alt={d.title} />
                    <Badge>-{d.discount_pct}%</Badge>
                    <ExpiryTag>Ends {d.expiry}</ExpiryTag>
                  </CardImg>
                  <CardBody>
                    <CardMeta>
                      {d.categories.map((c) => (
                        <CatLabel key={c.name}>{c.name}</CatLabel>
                      ))}
                    </CardMeta>
                    <CardTitle>{d.title}</CardTitle>
                    <CardLoc>
                      <svg
                        width="12"
                        height="12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {d.location}
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
                        <b>{d.likes}</b> likes
                      </Likes>
                      <SaveBtn onClick={(e) => toggleSave(d.id, e)}>
                        {saved.has(d.id) ? "✦ Saved" : "♡ Save"}
                      </SaveBtn>
                    </CardFooter>
                  </CardBody>
                </Card>
              ))
            )}
          </Grid>
        </Inner>
      </Page>
    </>
  );
}
