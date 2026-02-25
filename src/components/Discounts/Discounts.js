import { useState, useEffect } from "react";
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import { connect } from "react-redux";
import { getDiscountsAPI } from "../../actions";

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

const SORTS = ["Popular", "Newest", "Biggest Deal"];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
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
  padding: 72px 0 0;
  text-align: center;
  animation: ${fadeUp} 0.55s ease both;

  @media (min-width: 600px) {
    padding-top: 96px;
  }
`;

const Headline = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.08;
  color: ${T.text};
  text-align: center;
  em {
    font-style: italic;
    color: ${T.orange};
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
  gap: 12px;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.55s 0.1s ease both;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    flex-shrink: 1;
  }
`;

const SortSelect = styled.select`
  background: ${T.surface};
  border: 1px solid ${T.border};
  color: ${T.textSub};
  font-family: "Courier New", monospace;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  padding: 7px 12px;
  border-radius: 30px;
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: border-color 0.2s;
  min-width: 0;
  flex-shrink: 1;

  @media (max-width: 480px) {
    flex: 1;
  }

  &:focus,
  &:hover {
    border-color: rgba(250, 129, 40, 0.35);
    color: ${T.text};
  }

  option {
    background: #1a1a16;
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
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
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
  height: 190px;
  overflow: hidden;
  background: #1a1a16;

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
  min-width: 0;
  max-width: 340px;

  @media (max-width: 480px) {
    max-width: none;
  }
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
function DiscountsPage(props) {
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(new Set());

  const { getDiscounts, discounts, loading: propsLoading } = props;

  // Fetch discounts on mount if not already loaded
  useEffect(() => {
    if (!discounts?.results) {
      getDiscounts();
    }
  }, [discounts, getDiscounts]);

  // Derive unique category list from live data
  const allDiscounts = discounts?.results || [];
  const cats = [
    "All",
    ...[
      ...new Set(allDiscounts.flatMap((d) => d.categories.map((c) => c.name))),
    ],
  ];

  const loading = propsLoading || !discounts?.results;

  // Filter + sort
  const filtered = allDiscounts
    .filter(
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
      if (sort === "Popular") return (b.likes || 0) - (a.likes || 0);
      if (sort === "Biggest Deal")
        return (b.percentage_discount || 0) - (a.percentage_discount || 0);
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

  // Format end_date for display
  const formatExpiry = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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
            <Headline>
              Fresh deals, <em>no wahala.</em>
            </Headline>
          </Header>

          <Rule />

          {/* ── Controls ── */}
          <Controls>
            <CatRail>
              {cats.map((cat) => (
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
          <Grid>
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
                <Card key={d.id}>
                  <CardImg>
                    <img src={d.flyer} alt={d.title} />
                    {d.percentage_discount && (
                      <Badge>-{d.percentage_discount}%</Badge>
                    )}
                    {d.end_date && (
                      <ExpiryTag>Ends {formatExpiry(d.end_date)}</ExpiryTag>
                    )}
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

const mapStateToProps = (state) => ({
  discounts: state.discountState.discounts,
  loading: state.discountState.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getDiscounts: () => dispatch(getDiscountsAPI()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsPage);
